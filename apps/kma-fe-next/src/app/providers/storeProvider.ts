import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@kma/auth';
import menuReducer from '@/features/system/model/menuSlice';
import permissionReducer from '@/features/auth/model/permissionSlice';
import commonCodeReducer from '@/features/common/model/commonCodeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // menu: menuReducer, //메뉴 리듀서 등록 필수
    // permission: permissionReducer,
    // commonCode: commonCodeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
