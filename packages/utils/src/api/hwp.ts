import { http } from './http';

export async function convertHwpToHtml(file: File) {
  if ((process.env.NEXT_PUBLIC_API_MODE ?? 'real') === 'mock') {
    return {
      ok: true,
      html: `<h3>HWP Mock Preview</h3><p><b>${file.name}</b> 파일이 mock 모드에서 변환되었습니다.</p>`,
    };
  }

  const fd = new FormData();
  fd.append('file', file);
  // axios에서 Content-Type을 직접 지정하면 boundary가 빠져서
  // 서버(Multer)에서 multipart 파싱이 깨질 수 있습니다.
  // 헤더는 axios가 자동으로 세팅하도록 둡니다.
  const { data } = await http.post('/api/hwp/convert', fd);
  return data as { ok: boolean; html?: string; message?: string };
}
