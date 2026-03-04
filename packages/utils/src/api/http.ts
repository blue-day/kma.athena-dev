import axios from 'axios';

type TokenGetter = () => string | null | undefined;

interface HttpConfig {
  tokenGetter: TokenGetter;
  apiBaseUrl?: string;
  gqlPath?: string;
}

let getToken: TokenGetter = () => null;
let currentGqlPath = '/graphql';
const getApiMode = () => (process.env.NEXT_PUBLIC_API_MODE ?? 'real').toLowerCase();

export const http = axios.create({ timeout: 15000 });

type MockMember = {
  userId: string;
  userName: string;
  age: number | null;
  joinDate: string;
  content: string;
  fileGrpId: string | null;
  areaDiv: string | null;
  payDiv: string | null;
  boardDiv: string | null;
};

const mockDb = {
  users: [
    { id: 'admin', name: '관리자', dept: '디지털전략팀', roles: ['ADMIN'] },
    { id: 'user1', name: '일반사용자', dept: '회원지원팀', roles: ['USER'] },
  ],
  menus: [
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
  ],
  members: [
    {
      userId: 'm001',
      userName: '홍길동',
      age: 41,
      joinDate: new Date('2024-01-10').toISOString(),
      content: '<p>서울지부 회원</p>',
      fileGrpId: null,
      areaDiv: 'area01',
      payDiv: 'pay01',
      boardDiv: 'board01',
    },
    {
      userId: 'm002',
      userName: '김철수',
      age: 36,
      joinDate: new Date('2024-06-15').toISOString(),
      content: '<p>부산지부 회원</p>',
      fileGrpId: null,
      areaDiv: 'area02',
      payDiv: 'pay02',
      boardDiv: 'board02',
    },
  ] as MockMember[],
  codes: {
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
  } as Record<string, any[]>,
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const makeId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const runMockGql = (query: string, variables?: Record<string, any>) => {
  const input = variables?.input ?? {};

  if (query.includes('login(')) {
    const id = variables?.id ?? 'admin';
    const roles = id === 'admin' ? ['ADMIN'] : ['USER'];
    return {
      login: {
        accessToken: `mock-token-${id}`,
        user: { userId: id, userName: id === 'admin' ? '관리자' : '일반사용자', roles },
      },
    };
  }

  if (query.includes('menuList')) return { menuList: clone(mockDb.menus) };

  if (query.includes('memberList')) {
    const kw = (input.keyword ?? '').toString().toLowerCase();
    const start = input.startDate ? new Date(`${input.startDate}T00:00:00`) : null;
    const end = input.endDate ? new Date(`${input.endDate}T23:59:59.999`) : null;
    const list = mockDb.members
      .filter((m) => {
        if (kw && !(m.userId.toLowerCase().includes(kw) || m.userName.toLowerCase().includes(kw))) {
          return false;
        }
        if (start && end) {
          const d = new Date(m.joinDate);
          if (d < start || d > end) return false;
        }
        if (input.areaDiv && m.areaDiv !== input.areaDiv) return false;
        if (input.payDiv && m.payDiv !== input.payDiv) return false;
        if (input.boardDiv && m.boardDiv !== input.boardDiv) return false;
        return true;
      })
      .sort((a, b) => (a.joinDate < b.joinDate ? 1 : -1));
    return { memberList: clone(list) };
  }

  if (query.includes('member(') && query.includes('userId')) {
    const found = mockDb.members.find((m) => m.userId === variables?.userId) ?? null;
    return { member: clone(found) };
  }

  if (query.includes('memberUpsert')) {
    const payload = variables?.input ?? {};
    const idx = mockDb.members.findIndex((m) => m.userId === payload.userId);
    if (idx >= 0) {
      mockDb.members[idx] = { ...mockDb.members[idx], ...payload };
      return { memberUpsert: clone(mockDb.members[idx]) };
    }
    const created: MockMember = {
      userId: payload.userId || makeId('member'),
      userName: payload.userName || '신규회원',
      age: payload.age ?? null,
      joinDate: new Date().toISOString(),
      content: payload.content ?? '',
      fileGrpId: payload.fileGrpId ?? null,
      areaDiv: payload.areaDiv ?? null,
      payDiv: payload.payDiv ?? null,
      boardDiv: payload.boardDiv ?? null,
    };
    mockDb.members.push(created);
    return { memberUpsert: clone(created) };
  }

  if (query.includes('memberDelete')) {
    const userId = variables?.userId;
    mockDb.members = mockDb.members.filter((m) => m.userId !== userId);
    return { memberDelete: true };
  }

  if (query.includes('comnMasterList')) return { comnMasterList: clone(mockDb.codes[''] ?? []) };

  if (query.includes('comnDetailList') || query.includes('commonCodesByUpCd')) {
    const upCd = variables?.upCd ?? '';
    return {
      comnDetailList: clone(mockDb.codes[upCd] ?? []),
      commonCodesByUpCd: clone(mockDb.codes[upCd] ?? []),
    };
  }

  if (query.includes('comnUpsert')) {
    const payload = variables?.input ?? {};
    const upCdKey = payload.upCd ?? '';
    if (!mockDb.codes[upCdKey]) mockDb.codes[upCdKey] = [];
    if (!payload.comnCd) payload.comnCd = makeId('code');
    const list = mockDb.codes[upCdKey];
    const idx = list.findIndex((it) => it.comnCd === payload.comnCd);
    if (idx >= 0) list[idx] = { ...list[idx], ...payload };
    else list.push(payload);
    return { comnUpsert: clone(payload) };
  }

  if (query.includes('comnBatchDelete')) {
    const ids: string[] = variables?.ids ?? [];
    Object.keys(mockDb.codes).forEach((key) => {
      mockDb.codes[key] = mockDb.codes[key].filter((it) => !ids.includes(it.comnCd));
    });
    return { comnBatchDelete: true };
  }

  if (query.includes('myProfile')) {
    const token = getToken() ?? '';
    const id = token.replace('mock-token-', '') || 'admin';
    const user = mockDb.users.find((u) => u.id === id) ?? mockDb.users[0];
    return { myProfile: { id: user.id, name: user.name, dept: user.dept } };
  }

  if (query.includes('userList')) return { userList: clone(mockDb.users) };

  if (query.includes('user(') && query.includes('id')) {
    const found = mockDb.users.find((u) => u.id === variables?.id) ?? null;
    return { user: clone(found) };
  }

  return {};
};

export const initHttp = (config: HttpConfig) => {
  getToken = config.tokenGetter;

  if (config.apiBaseUrl) http.defaults.baseURL = config.apiBaseUrl;
  if (config.gqlPath) currentGqlPath = config.gqlPath;
};

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export async function gql<T>(query: string, variables?: Record<string, any>): Promise<T> {
  if (getApiMode() === 'mock') {
    return runMockGql(query, variables) as T;
  }

  const path = currentGqlPath;
  const res = await http.post(
    path,
    { query, variables },
    { headers: { 'content-type': 'application/json' } },
  );
  const body = res.data;
  if (body?.errors?.length) {
    const firstErr = body.errors[0];
    const msg = firstErr?.message ?? 'GraphQL Error';
    console.error('[GQL Error]', body.errors);
    throw new Error(msg);
  }
  return body.data as T;
}
