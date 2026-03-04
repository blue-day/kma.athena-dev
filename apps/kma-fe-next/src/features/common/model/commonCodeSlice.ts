import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; //  PayloadAction 제거
import { CommonCodeType } from '@kma/api-interface';
import { getCommonCodes } from '@/entities/common/api/commonCodeApi';

interface CommonCodeState {
  codes: Record<string, CommonCodeType[]>; // upCd별 코드 리스트 저장
  loading: boolean;
}

const initialState: CommonCodeState = {
  codes: {},
  loading: false,
};

// 특정 upCd의 코드를 가져오는 Thunk
export const fetchCodesThunk = createAsyncThunk('commonCode/fetchCodes', async (upCd: string) => {
  const data = await getCommonCodes(upCd);
  return { upCd, data };
});

const commonCodeSlice = createSlice({
  name: 'commonCode',
  initialState,
  reducers: {
    clearCodes(state) {
      state.codes = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCodesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCodesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.codes[action.payload.upCd] = action.payload.data;
      })
      .addCase(fetchCodesThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCodes } = commonCodeSlice.actions;
export default commonCodeSlice.reducer;
