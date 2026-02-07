import { createSlice } from "@reduxjs/toolkit";

const TM_LIST = ["김주언", "이선주", "김민세", "최진주"];

const initial = { tm: "", allowed: TM_LIST };

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    login(state, action) {
      const tm = action.payload;
      if (state.allowed.includes(tm)) state.tm = tm;
    },
    logout(state) { state.tm = ""; },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
