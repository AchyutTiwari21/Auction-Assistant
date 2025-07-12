import { createSlice } from "@reduxjs/toolkit";

const bidSlice = createSlice({
  name: "bids",
  initialState: {
    bids: [],
  },
  reducers: {
    setBids: (state, action) => {
      state.bids = action.payload;
    },
  },
});

export const { setBids } = bidSlice.actions;
export default bidSlice.reducer;
