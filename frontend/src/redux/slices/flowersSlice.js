import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

/**
 * Fetches flowers with optional server-side filtering and sorting.
 * @param {Object} filters - Filter parameters
 * @param {number} [filters.minPrice] - Minimum price filter
 * @param {number} [filters.maxPrice] - Maximum price filter
 * @param {string} [filters.search] - Name search filter
 * @param {string} [filters.sortBy] - Field to sort by (default: 'id')
 * @param {string} [filters.sortDir] - Sort direction: 'asc' or 'desc' (default: 'asc')
 */
export const fetchFlowers = createAsyncThunk('flowers/fetchFilterFlowers', async (filters = {}) => {
    try {
        // Build query string from filter parameters
        const params = new URLSearchParams();
        if (filters.minPrice != null) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice != null) params.append('maxPrice', filters.maxPrice);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortDir) params.append('sortDir', filters.sortDir);

        const queryString = params.toString();
        const url = `/products/flowers${queryString ? `?${queryString}` : ''}`;

        const { data } = await api.get(url);
        // Normalise API response to always be an array
        const flowers = Array.isArray(data)
            ? data
            : Array.isArray(data?.body)
                ? data.body
                : [];

        if (flowers.length === 0) {
            return [];
        }

        return flowers;
    }
    catch (e) {
        console.error("Error fetching flowers:", e);
        return []
    }
})

const initialState = {
    flowers: [],
    loading: false,
}

const flowersSlice = createSlice({
    name: "flowers",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlowers.pending, (state) => {
                state.flowers = [];
                state.loading = true;
            })
            .addCase(fetchFlowers.fulfilled, (state, action) => {
                state.flowers = action.payload;
                state.loading = false;
            })
            .addCase(fetchFlowers.rejected, (state) => {
                state.flowers = [];
                state.loading = false;
            })
    }
})

export const { } = flowersSlice.actions;

export default flowersSlice.reducer