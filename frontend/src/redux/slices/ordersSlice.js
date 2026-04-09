import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const fetchOrder =
    createAsyncThunk('fetch/fetchOrders',
        async ({ id }, { rejectWithValue }) => {
            try {
                const { data } = await api.get(`/order/user/${id}`);
                // Backend returns ResponseEntity wrapper, extract the body
                const orders = data.body || data;
                return Array.isArray(orders) ? orders : [];
            } catch (error) {
                console.error('Error fetching orders:', error);
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
            }
        })

export const postOrder =
    createAsyncThunk('order/postOrder',
        async (orderData, { rejectWithValue }) => {
            try {
                const response = await api.post('/order', orderData);
                return response.data;
            } catch (error) {
                console.error('Error posting order:', error);
                const message = error.response?.data?.message || 'Failed to create order. Please try again.';
                return rejectWithValue(message);
            }
        })

const initialState = {
    orders: [],
    loading: false,
    error: null
}

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearOrderError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchOrder cases
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure orders is always an array
                state.orders = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.loading = false;
                state.orders = [];
                state.error = action.payload || 'Failed to fetch orders';
            })
            // postOrder cases
            .addCase(postOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Add the new order to the beginning of the orders array
                if (action.payload) {
                    state.orders = [action.payload, ...state.orders];
                }
            })
            .addCase(postOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearOrderError } = ordersSlice.actions;

export default ordersSlice.reducer