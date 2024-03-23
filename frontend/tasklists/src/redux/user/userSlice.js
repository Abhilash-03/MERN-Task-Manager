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
        logoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false
        }
    }
})

export const { start, loginSuccess, loginFailure, signupSuccess, singupFailure, logoutSuccess } = userSlice.actions;

export default userSlice.reducer;