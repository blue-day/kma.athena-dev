import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MenuItemType } from '@kma/api-interface';
// 내부 API 대신 kma-comn의 비즈니스 서비스 호출
import { menuService } from '@kma/comn';

export const fetchMenusThunk = createAsyncThunk('menu/fetch', async () => {
  // kma-comn에서 처리된 메뉴 트리 데이터를 가져옴
  return await menuService.getMenuTree();
});

const slice = createSlice({
  name: 'menu',
  initialState: {
    items: [] as MenuItemType[],
    loading: false,
  },
  reducers: {
    // 필요한 경우 외부(Zustand)와 동기화하는 액션 추가 가능
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenusThunk.fulfilled, (state, action) => {
        // kma-comn에서 가져온 데이터를 Redux 상태에 저장
        state.items = action.payload as any;
        state.loading = false;
      })
      .addCase(fetchMenusThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default slice.reducer;
