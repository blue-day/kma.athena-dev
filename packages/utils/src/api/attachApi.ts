import { http } from './http';
import { AttachDto } from '@kma/api-interface';

const isMockMode = () => (process.env.NEXT_PUBLIC_API_MODE ?? 'real') === 'mock';
const mockStore: Record<string, AttachDto[]> = {};
const makeId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export async function attachList(fileGrpId: string): Promise<AttachDto[]> {
  if (isMockMode()) {
    return mockStore[fileGrpId] ?? [];
  }
  const { data } = await http.get(`/api/attach/${encodeURIComponent(fileGrpId)}`);
  return data?.items ?? [];
}

export async function attachUpload(
  fileGrpId: string | null,
  files: File[],
): Promise<{ fileGrpId: string; items: AttachDto[] }> {
  if (isMockMode()) {
    const grp = fileGrpId || makeId('grp');
    const items: AttachDto[] = files.map((f) => ({
      fileGrpId: grp,
      fileId: makeId('file'),
      fileNm: f.name,
      fileSize: f.size,
    }));
    mockStore[grp] = [...(mockStore[grp] ?? []), ...items];
    return { fileGrpId: grp, items };
  }

  const form = new FormData();
  if (fileGrpId) form.append('fileGrpId', fileGrpId);
  files.forEach((f) => form.append('files', f));

  // axios에서는 Content-Type을 직접 지정하면 boundary가 빠져서
  // Nest(Multer)에서 업로드 파싱 실패(500)로 이어질 수 있음.
  // 헤더는 axios가 자동으로 세팅하도록 두고, fileGrpId는 안전하게 헤더로도 전달한다.
  const { data } = await http.post('/api/attach/upload', form, {
    headers: fileGrpId ? { 'x-file-grp-id': fileGrpId } : undefined,
  });
  return data;
}

export async function attachDelete(fileGrpId: string, fileId: string): Promise<void> {
  if (isMockMode()) {
    mockStore[fileGrpId] = (mockStore[fileGrpId] ?? []).filter((f) => f.fileId !== fileId);
    return;
  }
  await http.delete(`/api/attach/${encodeURIComponent(fileGrpId)}/${encodeURIComponent(fileId)}`);
}

export function attachDownloadUrl(fileGrpId: string, fileId: string) {
  if (isMockMode()) {
    return '#';
  }
  return `${http.defaults.baseURL}/api/attach/${encodeURIComponent(fileGrpId)}/${encodeURIComponent(fileId)}/download`;
}
