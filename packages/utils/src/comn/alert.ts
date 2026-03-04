import Swal, { SweetAlertResult } from 'sweetalert2';

const isClient = typeof window !== 'undefined';

// 반환 타입을 Promise<void>로 명시하여 체이닝 시 타입 오류 방지
export const uiAlert = (title: string, text?: string): Promise<void> => {
  if (!isClient) {
    console.log(`[ALERT] ${title}: ${text || ''}`);
    return Promise.resolve();
  }
  return Swal.fire({
    title,
    text,
    confirmButtonText: '확인',
  }).then(() => {}); // SweetAlertResult를 무시하고 void 반환
};

export const uiError = (title: string, text?: string): Promise<void> => {
  if (!isClient) {
    console.error(`[ERROR] ${title}: ${text || ''}`);
    return Promise.resolve();
  }
  return Swal.fire({
    title,
    text,
    confirmButtonText: '확인',
  }).then(() => {});
};

export const uiConfirm = async (title: string, text?: string): Promise<boolean> => {
  if (!isClient) {
    console.log(`[CONFIRM] ${title}: ${text || ''} (서버: false)`);
    return false;
  }

  const result: SweetAlertResult = await Swal.fire({
    title,
    text,
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return !!result.isConfirmed;
};
