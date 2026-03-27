export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface JwtPayloadUser {
  id: string;
  name: string;
  roles: string[];
}

/** @description 인증된 사용자 정보 (GQL) */
export type AuthUserType = {
  userId: string;
  userName: string;
  roles: string[];
};

/** @description 로그인 응답 (GQL) */
export type LoginResponseType = {
  accessToken: string;
  user: AuthUserType;
};
