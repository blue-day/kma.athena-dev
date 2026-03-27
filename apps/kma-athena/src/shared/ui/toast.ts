'use client';

import Swal from 'sweetalert2';

type ToastType = 'success' | 'error' | 'info';

type CommonToastOptions = {
  type?: ToastType;
  duration?: number;
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timerProgressBar: false,
  customClass: {
    popup: 'kma-toast',
  },
});

export function showToast(message: string, options?: CommonToastOptions) {
  const { type = 'info', duration = 2000 } = options ?? {};
  const iconMap = { success: 'success', error: 'error', info: 'info' } as const;
  Toast.fire({ icon: iconMap[type], title: message, timer: duration });
}

export function dismissToast(_toastId?: string) {
  Swal.close();
}
// 'use client';

// import toast, { ToastOptions } from 'react-hot-toast';

// type ToastType = 'success' | 'error' | 'info';

// type CommonToastOptions = Omit<ToastOptions, 'icon'> & {
//   type?: ToastType;
// };

// export function showToast(message: string, options?: CommonToastOptions) {
//   const { type = 'info', ...toastOptions } = options ?? {};

//   if (type === 'success') {
//     return toast.success(message, toastOptions);
//   }

//   if (type === 'error') {
//     return toast.error(message, toastOptions);
//   }

//   return toast(message, toastOptions);
// }

// export function dismissToast(toastId?: string) {
//   toast.dismiss(toastId);
// }
