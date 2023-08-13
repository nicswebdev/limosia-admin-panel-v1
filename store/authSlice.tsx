import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { httpClient } from '@/src/shared/utils';
import { ErrorStatus } from '@/src/types/ErrorStatus.type';
import { User } from '@/src/types/entities';
import { authConfig } from '@/src/shared/config';

type UserToken = {
    access_token: string;
    expires_in: number;
};
type InitialState = {
    user: User | null;
    token: UserToken | null;
    error: ErrorStatus | null;
};

const initialState: InitialState = {
    user: null,
    token: null,
    error: null,
};

export const doUserLogin = createAsyncThunk('user/doUserLogin', async (payload: any, { fulfillWithValue, rejectWithValue }) => {
    try {
        const { data } = await httpClient.post('auth/login', {
            email: payload.email,
            password: payload.password,
        });

        // store user's token in local storage
        localStorage.setItem(authConfig.storageTokenName, data.token.access_token);

        return fulfillWithValue(data);
    } catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const doLogout = createAsyncThunk('user/doLogout', async (_, { fulfillWithValue }) => {
    localStorage.removeItem(authConfig.storageUserData);
    localStorage.removeItem(authConfig.storageTokenName);

    return fulfillWithValue;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, { payload }) {
            state.user = payload;
        },
        setToken(state, { payload }: { payload: UserToken | null }) {
            state.token = payload;
        },
        setError(state, { payload }: { payload: ErrorStatus | null }) {
            state.error = payload;
        },
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(doUserLogin.fulfilled, (state, action) => {
            const token = action.payload.token as UserToken;
            const user = action.payload.user;

            state.token = token;
            state.user = user;
            state.error = null;
        });
        builder.addCase(doUserLogin.rejected, (state, action) => {
            console.log({ action });
            const error = action.payload as ErrorStatus;

            state.error = error;
        });

        // logout
        builder.addCase(doLogout.fulfilled, (state, action) => {
            console.log({ action, state });

            state.user = null;
            state.token = null;
            state.error = null;
        });
    },
});

export const { setUser, setToken, setError } = authSlice.actions;

export const authReducer = authSlice.reducer;
