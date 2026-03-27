import { http } from './http';

export async function convertHwpToHtml(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  // axios에서 Content-Type을 직접 지정하면 boundary가 빠져서
  // 서버(Multer)에서 multipart 파싱이 깨질 수 있음
  // 헤더는 axios가 자동으로 세팅하
  const { data } = await http.post('/api/hwp/convert', fd);
  return data as { ok: boolean; html?: string; message?: string };
}
