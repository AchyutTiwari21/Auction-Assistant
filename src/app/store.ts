import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/usersSlice';
import auctionReducer from './features/auctionSlice';
import bidReducer from './features/bidSlice';
import callLogReducer from './features/callLogSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    auctions: auctionReducer,
    bids: bidReducer,
    callLogs: callLogReducer,
    auth: authReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;