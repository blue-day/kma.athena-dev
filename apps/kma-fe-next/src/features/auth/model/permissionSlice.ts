import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type State = { roles: string[] };
const initialState: State = { roles: ['ADMIN'] };
const slice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setRoles(s, a: PayloadAction<string[]>) {
      s.roles = a.payload;
    },
  },
});
export const { setRoles } = slice.actions;
export default slice.reducer;
