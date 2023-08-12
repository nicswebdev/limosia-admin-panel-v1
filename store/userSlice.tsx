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
    users: User[];
    token: UserToken | null;
    error: ErrorStatus | null;
};

// const access_token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;

const initialState: InitialState = {
    user: null,
    users: [],
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

export const fetchUsersList = createAsyncThunk('user/fetchUsersList', async (_, { fulfillWithValue, rejectWithValue }) => {
    const token = localStorage.getItem(authConfig.storageTokenName);

    try {
        const { data } = await httpClient.get('users?page=1&limit=10&sortBy=ASC', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, { payload }) {
            state.user = payload;
        },
        setToken(state, { payload }: { payload: UserToken }) {
            state.token = payload;
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

        // fetch users list
        builder.addCase(fetchUsersList.fulfilled, (state, action) => {
            const users = action.payload.items;

            state.users = users;
        });
    },
});

export const { setUser, setToken } = userSlice.actions;

export const userReducer = userSlice.reducer;
