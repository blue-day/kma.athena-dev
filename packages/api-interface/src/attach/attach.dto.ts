/** @description 첨부파일 데이터 전송 객체 (REST API) */
export type AttachDto = {
  fileGrpId: string;
  fileId: string;
  fileNm: string;
  fileSize: number;
};
