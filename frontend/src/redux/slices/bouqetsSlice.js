import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

/**
 * Fetches bouquets with optional server-side filtering and sorting.
 * @param {Object} filters - Filter parameters
 * @param {number} [filters.minPrice] - Minimum price filter
 * @param {number} [filters.maxPrice] - Maximum price filter
 * @param {string} [filters.search] - Name search filter
 * @param {string} [filters.sortBy] - Field to sort by (default: 'id')
 * @param {string} [filters.sortDir] - Sort direction: 'asc' or 'desc' (default: 'asc')
 */
export const fetchBouquet = createAsyncThunk('bouquet/fetchFilterFlowers', async (filters = {}) => {
    try {
        // Build query string from filter parameters
        const params = new URLSearchParams();
        if (filters.minPrice != null) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice != null) params.append('maxPrice', filters.maxPrice);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortDir) params.append('sortDir', filters.sortDir);

        const queryString = params.toString();
        const url = `/products/bouquets${queryString ? `?${queryString}` : ''}`;

        const { data } = await api.get(url);

        // Normalise API response to always be an array
        const bouquets = Array.isArray(data)
            ? data
            : Array.isArray(data?.body)
                ? data.body
                : [];

        if (bouquets.length === 0) {
            return [];
        }

        return bouquets;
    }
    catch (e) {
        console.error("Error fetching bouquets:", e);
        return []
    }
})

const initialState = {
    bouquets: [],
    loading: false,
}

const bouquetsSlice = createSlice({
    name: "bouquets",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchBouquet.pending, (state) => {
                state.bouquets = [];
                state.loading = true;
            })
            .addCase(fetchBouquet.fulfilled, (state, action) => {
                state.bouquets = action.payload;
                state.loading = false;
            })
            .addCase(fetchBouquet.rejected, (state) => {
                state.bouquets = [];
                state.loading = false;
            })
    }
})

export const { } = bouquetsSlice.actions;

export default bouquetsSlice.reducer