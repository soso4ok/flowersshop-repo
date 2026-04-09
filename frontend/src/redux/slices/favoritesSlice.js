import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const fetchFavoriteIds = createAsyncThunk(
    'favorites/fetchIds',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/favorites/ids');
            return data; // Set<Long> → number[]
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch favorites';
            return rejectWithValue(message);
        }
    }
);

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/favorites');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch favorites';
            return rejectWithValue(message);
        }
    }
);

export const addFavorite = createAsyncThunk(
    'favorites/add',
    async (productId, { rejectWithValue }) => {
        try {
            await api.post(`/users/favorites/${productId}`);
            return productId;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add favorite';
            return rejectWithValue(message);
        }
    }
);

export const removeFavorite = createAsyncThunk(
    'favorites/remove',
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`/users/favorites/${productId}`);
            return productId;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove favorite';
            return rejectWithValue(message);
        }
    }
);

const favoritesSlice = createSlice({
    name: "favorites",
    initialState: {
        ids: [],        // Array of product ids that are favorited (for quick lookup)
        items: [],      // Full product objects (for favorites page, if desired)
        loading: false,
        error: null,
    },
    reducers: {
        clearFavorites(state) {
            state.ids = [];
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchFavoriteIds
            .addCase(fetchFavoriteIds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
                state.loading = false;
                state.ids = action.payload;
            })
            .addCase(fetchFavoriteIds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchFavorites (full objects)
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = action.payload;
            })

            // addFavorite - optimistic update
            .addCase(addFavorite.fulfilled, (state, action) => {
                if (!state.ids.includes(action.payload)) {
                    state.ids.push(action.payload);
                }
            })

            // removeFavorite - optimistic update
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.ids = state.ids.filter(id => id !== action.payload);
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
