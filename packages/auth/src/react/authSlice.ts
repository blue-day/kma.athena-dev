import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gql } from '@kma/utils';
import { AuthUserType, LoginResponseType } from '@kma/api-interface';
// kma-comn의 Zustand 세션 스토어 임포트
import { useAuthSession } from '@kma/comn';

type State = {
  isLoggedIn: boolean;
  token: string | null;
  user: AuthUserType | null;
};

const initialState: State = { isLoggedIn: false, token: null, user: null };

export const loginThunk = createAsyncThunk('auth/login', async (payload: { id: string; pw: string }) => {
  const q = `
    mutation Login($id:String!, $pw:String!){
      login(id:$id, pw:$pw){
        accessToken
        user { userId userName roles }
      }
    }
  `;
  const data = await gql<{ login: LoginResponseType }>(q, payload);
  return data.login;
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(s) {
      s.isLoggedIn = false;
      s.token = null;
      s.user = null;
      // Redux 로그아웃 시 Zustand 세션도 함께 초기화
      useAuthSession.getState().logout();
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.fulfilled, (s, a) => {
      const { accessToken, user } = a.payload;
      s.isLoggedIn = true;
      s.token = accessToken;
      s.user = user;

      // 로그인 성공 시 kma-comn의 Zustand 스토어에 세션 정보를 주입합니다.
      // 이 작업이 완료되어야 MainLayout에서 구독 중인 useAccessControl의 isLoggedIn이 true가 됩니다.
      useAuthSession.getState().setSession(user as any, accessToken);
    });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
