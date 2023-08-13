import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { httpClient } from '@/src/shared/utils';
import { User } from '@/src/types/entities';
import { authConfig } from '@/src/shared/config';

type InitialState = {
    users: User[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
    params: {
        limit: number;
        page: number;
        sortBy: [];
        search: string | null;
    };
    loading: boolean;
};

// const access_token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;

const initialState: InitialState = {
    users: [],
    meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 10,
        totalPages: 0,
        currentPage: 1,
    },
    params: {
        limit: 10,
        page: 1,
        sortBy: [],
        search: null,
    },
    loading: false,
};

export const fetchUsersList = createAsyncThunk('user/fetchUsersList', async (params: Object, { getState, fulfillWithValue, rejectWithValue }) => {
    const token = localStorage.getItem(authConfig.storageTokenName);

    try {
        const { data } = await httpClient.get('users', {
            params: {
                ...params,
            },
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
        setUsers(state, { payload }) {
            state.users = payload;
        },
    },
    extraReducers: (builder) => {
        // fetch users list
        builder.addCase(fetchUsersList.fulfilled, (state, action) => {
            const users = action.payload.items;
            const meta = action.payload.meta;

            state.users = users;
            state.meta = meta;
        });
    },
});

export const { setUsers } = userSlice.actions;

export const userReducer = userSlice.reducer;
