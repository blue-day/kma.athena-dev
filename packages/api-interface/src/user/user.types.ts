/** @description 사용자 기본 정보 (GQL 대응) */
export type UserType = {
  userId: string;
  userName: string;
  email?: string | null;
  telNo?: string | null;
  deptCd?: string | null;
  posiCd?: string | null;
  useYn: string;
  regDt?: string | null;
  regId?: string | null;
};

/** @description 사용자 저장/수정 입력 타입 */
export type UserUpsertInputType = {
  userId: string;
  userName: string;
  password?: string | null; // 신규 등록 시 필수
  email?: string | null;
  telNo?: string | null;
  deptCd?: string | null;
  posiCd?: string | null;
  useYn: string;
};

/** @description 사용자 목록 검색 필터 */
export type UserSearchInputType = {
  keyword?: string | null;
  deptCd?: string | null;
  useYn?: string | null;
};
