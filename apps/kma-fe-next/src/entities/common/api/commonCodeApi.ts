import { gql } from '@kma/utils';
import { CommonCodeType } from '@kma/api-interface'; // Entity -> Type으로 변경

/**
 * 상위 코드(upCd)를 기준으로 공통 코드 리스트 조회 (콤보박스용)
 * @param upCd 상위 코드 (예: 지역본부 'com00006')
 */
export async function getCommonCodes(upCd: string): Promise<CommonCodeType[]> {
  // Backend의 CommonCodeResolver에 정의된 Query 명칭과 일치해야 함
  const q = `query($upCd: String!) {
    comnDetailList(upCd: $upCd) {
      comnCd
      comnNm
      upCd
      sort
    }
  }`;

  // gql 제네릭에 반환 타입을 명시하여 'data'의 타입을 확정
  const data = await gql<{ comnDetailList: CommonCodeType[] }>(q, { upCd });

  return data.comnDetailList || [];
}
