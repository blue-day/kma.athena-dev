import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { gql } from '@kma/utils';
import { MenuItemType } from '@kma/api-interface';
import { create } from 'zustand';

type SessionUser = {
  userId: string;
  userName: string;
  roles: string[];
  id?: string;
  name?: string;
  dept?: string;
};

type AuthSessionState = {
  isLoggedIn: boolean;
  isInitialized: boolean;
  token: string | null;
  user: SessionUser | null;
  initialize: () => void;
  setSession: (user: SessionUser, token: string) => void;
  logout: () => void;
};

const isBrowser = typeof window !== 'undefined';
const isMockMode = () => (process.env.NEXT_PUBLIC_API_MODE ?? 'real') === 'mock';
const TOKEN_KEY = 'kma_token';
const USER_KEY = 'kma_user';

const mockMenu: MenuItemType[] = [
  {
    id: 'M001',
    label: '회원관리',
    path: '/members',
    children: [
      { id: 'M00101', label: '회원목록', path: '/members' },
      { id: 'M00102', label: '회원등록', path: '/members/new' },
    ],
  },
  {
    id: 'M002',
    label: '시스템',
    path: '/system',
    children: [{ id: 'M00201', label: '공통코드', path: '/system/common-code' }],
  },
];

const mockCodeMap: Record<string, any[]> = {
  '': [
    { comnCd: 'com00006', comnNm: '지역', upCd: null, sort: 1, comnDiv: 'MASTER' },
    { comnCd: 'com00007', comnNm: '회비구분', upCd: null, sort: 2, comnDiv: 'MASTER' },
    { comnCd: 'com00009', comnNm: '게시판구분', upCd: null, sort: 3, comnDiv: 'MASTER' },
  ],
  com00006: [
    { comnCd: 'area01', comnNm: '서울', upCd: 'com00006', sort: 1, comnDiv: 'DETAIL' },
    { comnCd: 'area02', comnNm: '부산', upCd: 'com00006', sort: 2, comnDiv: 'DETAIL' },
  ],
  com00007: [
    { comnCd: 'pay01', comnNm: '정회원', upCd: 'com00007', sort: 1, comnDiv: 'DETAIL' },
    { comnCd: 'pay02', comnNm: '준회원', upCd: 'com00007', sort: 2, comnDiv: 'DETAIL' },
  ],
  com00009: [
    { comnCd: 'board01', comnNm: '공지', upCd: 'com00009', sort: 1, comnDiv: 'DETAIL' },
    { comnCd: 'board02', comnNm: '일반', upCd: 'com00009', sort: 2, comnDiv: 'DETAIL' },
  ],
};

const readStored = <T,>(key: string): T | null => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeStored = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const removeStored = (key: string) => {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
};

export const useAuthSession = create<AuthSessionState>((set, get) => ({
  isLoggedIn: false,
  isInitialized: false,
  token: null,
  user: null,
  initialize: () => {
    if (!isBrowser) {
      set({ isInitialized: true });
      return;
    }
    const token = readStored<string>(TOKEN_KEY);
    const user = readStored<SessionUser>(USER_KEY);
    set({
      isLoggedIn: Boolean(token && user),
      isInitialized: true,
      token: token ?? null,
      user: user ?? null,
    });
  },
  setSession: (user, token) => {
    writeStored(TOKEN_KEY, token);
    writeStored(USER_KEY, user);
    set({ user, token, isLoggedIn: true, isInitialized: true });
  },
  logout: () => {
    removeStored(TOKEN_KEY);
    removeStored(USER_KEY);
    set({ user: null, token: null, isLoggedIn: false, isInitialized: true });
  },
}));

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GQL_PATH || '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = useAuthSession.getState().token;
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export const useAccessControl = () => {
  const { isLoggedIn, user } = useAuthSession();
  const roles = user?.roles ?? [];
  return {
    isLoggedIn,
    isAdmin: roles.includes('ADMIN'),
    roles,
  };
};

export const menuService = {
  async getMenuTree(): Promise<MenuItemType[]> {
    if (isMockMode()) return mockMenu;
    const query = `
      query {
        menuList {
          id
          label
          path
          children { id label path }
        }
      }
    `;
    try {
      const res = await gql<{ menuList: MenuItemType[] }>(query);
      return res.menuList || [];
    } catch {
      return mockMenu;
    }
  },
};

type MenuState = {
  menu: MenuItemType[];
  loading: boolean;
  fetchMenus: () => Promise<void>;
};

export const useMenuStore = create<MenuState>((set) => ({
  menu: [],
  loading: false,
  fetchMenus: async () => {
    set({ loading: true });
    try {
      const menu = await menuService.getMenuTree();
      set({ menu, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));

export const useMenu = () => {
  const menu = useMenuStore((s) => s.menu);
  const loading = useMenuStore((s) => s.loading);
  const fetchMenus = useMenuStore((s) => s.fetchMenus);
  return { menu, loading, fetchMenus };
};

export const useUserProfile = () => {
  const user = useAuthSession((s) => s.user);
  const profile = user
    ? {
        id: user.userId || user.id || '',
        name: user.userName || user.name || '',
        dept: user.dept || '',
        roles: user.roles || [],
      }
    : null;

  return { profile, loading: false };
};

export const useAuthAction = () => {
  const setSession = useAuthSession((s) => s.setSession);
  const login = async (id: string, pw: string) => {
    if (isMockMode()) {
      const roles = id === 'admin' ? ['ADMIN'] : ['USER'];
      const user: SessionUser = {
        userId: id,
        userName: id === 'admin' ? '관리자' : '일반사용자',
        roles,
        id,
        name: id === 'admin' ? '관리자' : '일반사용자',
        dept: 'UI-MOCK',
      };
      setSession(user, `mock-token-${id}`);
      return { accessToken: `mock-token-${id}`, user };
    }

    const query = `
      mutation($id:String!, $pw:String!){
        login(id:$id, pw:$pw){
          accessToken
          user { userId userName roles }
        }
      }
    `;
    const data = await gql<{ login: { accessToken: string; user: SessionUser } }>(query, { id, pw });
    setSession(data.login.user, data.login.accessToken);
    return data.login;
  };

  return { login };
};

type CommonCodeState = {
  map: Record<string, any[]>;
  loadCodes: (upCd?: string, force?: boolean) => Promise<any[]>;
  getList: (upCd: string) => any[];
};

export const useCommonCodeStore = create<CommonCodeState>((set, get) => ({
  map: {},
  loadCodes: async (upCd = '', force = false) => {
    const key = upCd ?? '';
    const cached = get().map[key];
    if (!force && cached) return cached;

    if (isMockMode()) {
      const list = mockCodeMap[key] ?? [];
      set((s) => ({ map: { ...s.map, [key]: list } }));
      return list;
    }

    const query =
      key === ''
        ? `query { comnMasterList { comnCd comnNm upCd sort comnDiv regId modId } }`
        : `query($upCd:String!){ comnDetailList(upCd:$upCd){ comnCd comnNm upCd sort comnDiv regId modId } }`;
    try {
      const list = key
        ? (await gql<{ comnDetailList: any[] }>(query, { upCd: key })).comnDetailList || []
        : (await gql<{ comnMasterList: any[] }>(query)).comnMasterList || [];
      set((s) => ({ map: { ...s.map, [key]: list } }));
      return list;
    } catch {
      const list = mockCodeMap[key] ?? [];
      set((s) => ({ map: { ...s.map, [key]: list } }));
      return list;
    }
  },
  getList: (upCd: string) => get().map[upCd ?? ''] ?? [],
}));

export const useCommonCode = () => {
  const loadCodes = useCommonCodeStore((s) => s.loadCodes);
  const getList = useCommonCodeStore((s) => s.getList);
  return { loadCodes, getList };
};
