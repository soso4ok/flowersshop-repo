import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedFlower: null,
    // Server-side filter parameters
    minPrice: null,
    maxPrice: null,
    search: '',
    sortBy: 'id',
    sortDir: 'asc',
}

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSelectedFlower(state, action) {
            state.selectedFlower = action.payload;
        },
        setMinPrice(state, action) {
            state.minPrice = action.payload;
        },
        setMaxPrice(state, action) {
            state.maxPrice = action.payload;
        },
        setPriceRange(state, action) {
            state.minPrice = action.payload.min;
            state.maxPrice = action.payload.max;
        },
        setSearch(state, action) {
            state.search = action.payload;
        },
        setSortBy(state, action) {
            state.sortBy = action.payload;
        },
        setSortDir(state, action) {
            state.sortDir = action.payload;
        },
        setSort(state, action) {
            state.sortBy = action.payload.sortBy;
            state.sortDir = action.payload.sortDir;
        },
        clearFilters(state) {
            state.minPrice = null;
            state.maxPrice = null;
            state.search = '';
            state.sortBy = 'id';
            state.sortDir = 'asc';
        },
    },
})

export const {
    setSelectedFlower,
    setMinPrice,
    setMaxPrice,
    setPriceRange,
    setSearch,
    setSortBy,
    setSortDir,
    setSort,
    clearFilters
} = filterSlice.actions;

export default filterSlice.reducer