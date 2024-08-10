import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       start: (state) => {
            state.error = null;
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signupSuccess: (state) => {
            state.error = null;
            state.loading = false;
        },
        singupFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state, action) => {
            state.error = null;
            state.loading = true
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
    }
})

export const { start, loginSuccess, loginFailure, signupSuccess, singupFailure, logoutSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, updateFailure, updateSuccess, updateStart } = userSlice.actions;

export default userSlice.reducer;