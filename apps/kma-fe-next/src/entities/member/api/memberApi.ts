import { gql } from '@kma/utils';
import { MemberType, MemberUpsertInputType } from '@kma/api-interface';

/**
 * 회원 목록 조회 API
 */
export async function memberList(
  keyword?: string,
  startDate?: string,
  endDate?: string,
  areaCd?: string,
  regTypeCd?: string,
  filterCd?: string,
) {
  const q = `query($input: MemberSearchInput){
    memberList(input: $input){
      userId userName age joinDate areaDiv payDiv boardDiv
    }
  }`;

  const variables = {
    input: {
      keyword: keyword || null,
      startDate: startDate || null,
      endDate: endDate || null,
      areaDiv: areaCd || null,
      payDiv: regTypeCd || null,
      boardDiv: filterCd || null,
    },
  };

  return gql<{ memberList: MemberType[] }>(q, variables);
}

/**
 * 회원 상세 정보 조회 API
 */
export async function memberGet(userId: string) {
  const q = `query($userId: String!){
    member(userId: $userId){
      userId userName age joinDate content fileGrpId
    }
  }`;
  const data = await gql<{ member: MemberType | null }>(q, { userId });
  return data.member;
}

/**
 * 회원 정보 저장 및 수정 API (Upsert)
 * MemberUpsertInput 규격에 맞는 필드만 추출하고 age를 숫자로 변환
 */
export async function memberUpsert(input: any) {
  const q = `mutation($input: MemberUpsertInput!){
    memberUpsert(input: $input){
      userId userName
    }
  }`;

  const payload: MemberUpsertInputType = {
    userId: input.userId,
    userName: input.userName,
    // string으로 관리되는 age를 number로 변환
    age: input.age !== undefined && input.age !== '' ? Number(input.age) : null,
    content: input.content ?? '',
    fileGrpId: input.fileGrpId || null,
    // joinDate는 MemberUpsertInput에 없으므로 전송에서 제외됨
  };

  return gql<{ memberUpsert: MemberType }>(q, { input: payload });
}

/**
 * 회원 정보 삭제 API
 */
export async function memberDelete(userId: string) {
  const q = `mutation($userId: String!){ 
    memberDelete(userId: $userId) 
  }`;
  const data = await gql<{ memberDelete: boolean }>(q, { userId });
  return data.memberDelete;
}
