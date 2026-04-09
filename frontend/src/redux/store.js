import { configureStore } from '@reduxjs/toolkit';
import filter from './slices/filterSlice';
import bouquets from './slices/bouqetsSlice.js';
import flowers from './slices/flowersSlice.js';
import cart from './slices/cartSlice.js';
import user from './slices/userSlice.js'
import orders from './slices/ordersSlice.js';
import builder from './slices/builderSlice.js';
import addresses from './slices/addressSlice.js';
import favorites from './slices/favoritesSlice.js';
import admin from './slices/adminSlice.js';

import blogs from './slices/blogSlice.js';

export const store = configureStore({
    reducer: {
        flowers,
        bouquets,
        filter,
        orders,
        cart,
        user,
        blogs,
        builder,
        addresses,
        favorites,
        admin,
    },
});
