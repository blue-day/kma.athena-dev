import { http } from './http';
import { AttachDto } from '@kma/api-interface';

/**
 * 파일 목록 조회 API
 */
export async function attachList(fileGrpId: string): Promise<AttachDto[]> {
  const { data } = await http.get(`/api/attach/${encodeURIComponent(fileGrpId)}`);
  // IApiResponse { ok, data, message } 구조이므로 data.data를 참조
  return data?.data ?? [];
}

/**
 * 파일 업로드 API
 */
export async function attachUpload(
  fileGrpId: string | null,
  files: File[],
): Promise<{ fileGrpId: string; items: AttachDto[] }> {
  const form = new FormData();
  if (fileGrpId) form.append('fileGrpId', fileGrpId);
  files.forEach((f) => form.append('files', f));

  const { data } = await http.post('/api/attach/upload', form, {
    headers: fileGrpId ? { 'x-file-grp-id': fileGrpId } : undefined,
  });

  // BE의 ApiResponse.success()는 { ok, message, data: { fileGrpId, items } } 형태임
  // 따라서 data.data를 반환해야 프론트에서 up.fileGrpId로 접근 가능함
  return data.data;
}

/**
 * 파일 삭제 API
 */
export async function attachDelete(fileGrpId: string, fileId: string): Promise<void> {
  await http.delete(`/api/attach/${encodeURIComponent(fileGrpId)}/${encodeURIComponent(fileId)}`);
}

/**
 * 파일 다운로드 URL 생성
 */
export function attachDownloadUrl(fileGrpId: string, fileId: string) {
  //  baseURL이 설정되지 않아 undefined일 경우, 빈 문자열로 처리하여 URL이 깨지는 현상을 방지
  const baseUrl = http.defaults.baseURL || '';
  return `${baseUrl}/api/attach/${encodeURIComponent(fileGrpId)}/${encodeURIComponent(fileId)}/download`;
}
