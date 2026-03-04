// [보완] 상위 공통 타입에서 DateRange를 가져옵니다.
import { DateRange } from '../common';

/** @description 회원 기본 정보 (GQL) */
export type MemberType = {
  userId: string;
  userName: string;
  age?: number | null;
  joinDate?: string | null;
  content?: string | null;
  fileGrpId?: string | null;
};

/** @description 회원 가공/입력 데이터 */
export type MemberUpsertInputType = {
  userId: string;
  userName: string;
  age?: number | null;
  content?: string | null;
  fileGrpId?: string | null;
};

/** @description UI 폼 관리 전용 타입 */
export type MemberFormValueType = {
  userId: string;
  userName: string;
  age: string;
  joinDate?: string;
  content: string;
  fileGrpId?: string | null;
};

/** @description 회원 검색 필터 인터페이스 */
export interface MemberSearchFilter {
  page: number;
  keyword: string;
  areaCd: string;
  payDiv: string;
  boardDiv: string;
  dateRange: DateRange | null; // 공통 DateRange 사용
}
