import { gql } from '@kma/utils';

/**
 * 공통코드 저장 및 수정 API (Upsert)
 */
export async function comnUpsert(input: any) {
  const q = `mutation($input: CommonCodeUpsertInput!){
    comnUpsert(input: $input){
      comnCd
      comnNm
      upCd
      sort
      comnDiv
      regId
      modId
    }
  }`;

  const payload = {
    comnCd: input.comnCd || '',
    comnNm: input.comnNm || '',
    upCd: input.upCd || null,
    sort: input.sort !== undefined ? Number(input.sort) : 0,
    comnDiv: input.comnDiv || '',
    regId: input.regId || null,
    modId: input.modId || null,
  };

  return gql<{ comnUpsert: any }>(q, { input: payload });
}

/**
 * 공통코드 일괄 삭제 API
 */
export async function comnBatchDelete(ids: string[]) {
  const q = `mutation($ids: [String!]!){ 
    comnBatchDelete(ids: $ids) 
  }`;
  const data = await gql<{ comnBatchDelete: boolean }>(q, { ids });
  return data.comnBatchDelete;
}
