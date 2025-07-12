import { createSlice } from "@reduxjs/toolkit";

const callLogSlice = createSlice({
  name: "callLogs",
  initialState: {
    callLogs: [],
  },
  reducers: {
    setCallLogs: (state, action) => {
      state.callLogs = action.payload;
    },
  },
});

export const { setCallLogs } = callLogSlice.actions;
export default callLogSlice.reducer;
