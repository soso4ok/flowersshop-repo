import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalPrice: 0,
    isValid: false,
};

const MIN_ITEMS = 3;

const recalculate = (state) => {
    state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.count,
        0
    );
    const totalCount = state.items.reduce((sum, item) => sum + item.count, 0);
    state.isValid = totalCount >= MIN_ITEMS;
};

const builderSlice = createSlice({
    name: "builder",
    initialState,
    reducers: {
        addItem(state, action) {
            const existing = state.items.find(
                (item) => item.id === action.payload.id
            );
            if (existing) {
                existing.count++;
            } else {
                state.items.push({
                    id: action.payload.id,
                    name: action.payload.name,
                    price: action.payload.price,
                    image: action.payload.image,
                    count: 1,
                });
            }
            recalculate(state);
        },
        removeItem(state, action) {
            const index = state.items.findIndex(
                (item) => item.id === action.payload
            );
            if (index !== -1) {
                if (state.items[index].count > 1) {
                    state.items[index].count--;
                } else {
                    state.items.splice(index, 1);
                }
            }
            recalculate(state);
        },
        clearBuilder(state) {
            state.items = [];
            state.totalPrice = 0;
            state.isValid = false;
        },
    },
});

export const { addItem, removeItem, clearBuilder } = builderSlice.actions;

export const selectBuilderItems = (state) => state.builder.items;
export const selectBuilderTotalPrice = (state) => state.builder.totalPrice;
export const selectBuilderIsValid = (state) => state.builder.isValid;
export const selectBuilderTotalCount = (state) =>
    state.builder.items.reduce((sum, item) => sum + item.count, 0);

export default builderSlice.reducer;
