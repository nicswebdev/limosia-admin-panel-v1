import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { httpClient } from '@/src/shared/utils';
import { Order } from '@/src/types/entities';
import { authConfig } from '@/src/shared/config';

type InitialState = {
    order: Order;
    orders: Order[];
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

const initialState: InitialState = {
    order: {
        id: 0,
        user_id: 0,
        order_no: '',
        f_name: '',
        l_name: '',
        email: '',
        phone: '',
        dob: '1999-12-12',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        pickup_point: '',
        destination_point: '',
        pickup_date: '1999-12-12',
        pickup_time: '',
        flight_number: '',
        total_guest: 0,
        total_suitcase: 0,
        car_class_name: '',
        airport_name: '',
        range: 0,
        total_price: 0,
        price_schema_name: '',
        order_currency: '',
        payment_status: {
            name: '',
            description: null,
        },
        order_status: {
            name: '',
            description: null,
        },
        created_at: '1999-12-12',
        updated_at: '1999-12-12',
        delete_row: false,
    },
    orders: [],
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

export const fetchOrdersList = createAsyncThunk('order/fetchOrdersList', async (params: Object, { fulfillWithValue, rejectWithValue }) => {
    const token = localStorage.getItem(authConfig.storageTokenName);

    try {
        const { data } = await httpClient.get('orders', {
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

export const fetchSingleOrder = createAsyncThunk('order/fetchSingleOrder', async (params: any, { fulfillWithValue, rejectWithValue }) => {
    const token = localStorage.getItem(authConfig.storageTokenName);

    try {
        const { data } = await httpClient.get(`orders/${params.id}`, {
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

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders(state, { payload }) {
            state.orders = payload;
        },
        setSingleItemOrder(state, { payload }) {
            state.order = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrdersList.fulfilled, (state, action) => {
            const orders = action.payload.items;
            const meta = action.payload.meta;

            state.orders = orders;
            state.meta = meta;
        });
        builder.addCase(fetchSingleOrder.fulfilled, (state, action) => {
            const order = action.payload;

            state.order = order;
        });
    },
});

export const { setOrders, setSingleItemOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
