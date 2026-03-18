import { configureStore } from '@reduxjs/toolkit';
import { notificationReducer } from '@/features/pop/model/notificationSlice';

export const appStore = configureStore({
  reducer: {
    pops: notificationReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
