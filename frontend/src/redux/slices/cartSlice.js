import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalPrice: 0
}

const recalcTotalPrice = (items) =>
    items.reduce((sum, cur) => {
        const price = Number(cur.price) || 0;
        const count = Number(cur.count) || 0;
        
        if (cur.type === 'CUSTOM_BOUQUET') return sum + price;
        return sum + (price * count);
    }, 0);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart(state, action) {
            const findItem = state.items.find(obj => obj.id === action.payload.id)

            if (findItem) {
                findItem.count++;
            } else {
                state.items.push({
                    ...action.payload,
                    count: 1
                });
            }

            state.totalPrice = recalcTotalPrice(state.items);
        },
        addCustomBouquet(state, action) {
            const { items, totalPrice } = action.payload;
            state.items.push({
                id: crypto.randomUUID(),
                type: 'CUSTOM_BOUQUET',
                name: 'Custom Bouquet',
                items: items,
                price: totalPrice,
                count: 1
            });
            state.totalPrice = recalcTotalPrice(state.items);
        },
        changeItemCount(state, action) {
            const findItem = state.items.find(obj => obj.id === action.payload.itemId)

            // Custom bouquets don't support quantity changes
            if (findItem && findItem.type === 'CUSTOM_BOUQUET') return;

            if (action.payload.add) {
                findItem.count++;
            } else {
                if (findItem.count > 1) {
                    findItem.count--;
                }
            }

            state.totalPrice = recalcTotalPrice(state.items);
        },
        removeItem(state, action) {
            state.items = state.items.filter(obj => obj.id !== action.payload);
            state.totalPrice = recalcTotalPrice(state.items);
        },
        clearCart(state) {
            state.items = [];
            state.totalPrice = 0;
        }
    }
})

export const { addItemToCart, addCustomBouquet, changeItemCount, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer