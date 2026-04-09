import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const fetchAddresses = createAsyncThunk(
    'addresses/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/addresses');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch addresses';
            return rejectWithValue(message);
        }
    }
);

export const addAddress = createAsyncThunk(
    'addresses/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/addresses', addressData);
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add address';
            return rejectWithValue(message);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'addresses/deleteAddress',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/addresses/${id}`);
            return id;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete address';
            return rejectWithValue(message);
        }
    }
);

const addressSlice = createSlice({
    name: "addresses",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAddressError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload);
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter(a => a.id !== action.payload);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAddressError } = addressSlice.actions;

export default addressSlice.reducer;
