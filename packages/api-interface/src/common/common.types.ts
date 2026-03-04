import type { DateValue } from '@internationalized/date';

/** * @description 전역 공통 날짜 범위 인터페이스
 * UI 패키지 의존성을 없애고 모든 도메인에서 참조 가능하도록 최상위 구성
 */
export interface DateRange {
  start: DateValue;
  end: DateValue;
}

/** @description 공통 코드 기본 정보 (GQL) */
export type CommonCodeType = {
  comnCd: string;
  comnNm: string;
  upCd?: string | null;
  sort: number;
  comnDiv?: string | null;
};

/** @description 공통 코드 Upsert 입력 타입 */
export type CommonCodeUpsertInputType = {
  comnCd: string;
  comnNm: string;
  upCd?: string | null;
  sort?: number | null;
  comnDiv?: string | null;
};
