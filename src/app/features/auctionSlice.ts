import { createSlice } from "@reduxjs/toolkit";

const auctionSlice = createSlice({
  name: "auctions",
  initialState: {
    auctions: [],
  },
  reducers: {
    setAuctions: (state, action) => {
      state.auctions = action.payload;
    },
  },
});

export const { setAuctions } = auctionSlice.actions;
export default auctionSlice.reducer;
