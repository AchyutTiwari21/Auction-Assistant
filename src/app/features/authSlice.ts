import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        initUser: (state, action) => {
            state.status = true,
            state.userData = action.payload;
        },
        loginUser: (state, action) => {
            state.status = true,
            state.userData = action.payload;
        },
        logoutUser: (state, action) => {
            state.status = true,
            state.userData = action.payload;
        },
        updateUser: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        }
    }
});

export const { initUser, loginUser, logoutUser, updateUser } = authSlice.actions;
export default authSlice.reducer;

