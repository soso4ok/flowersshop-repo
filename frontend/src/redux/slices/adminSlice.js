import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// ── Dashboard ────────────────────────────────────────
export const fetchDashboardStats = createAsyncThunk(
    'admin/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/stats');
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

// ── Users ────────────────────────────────────────────
export const fetchAdminUsers = createAsyncThunk(
    'admin/fetchAdminUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/users');
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const deleteAdminUser = createAsyncThunk(
    'admin/deleteAdminUser',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/users/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to delete user');
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async ({ email, role }, { rejectWithValue }) => {
        try {
            await api.put('/users/role', { email, role });
            return { email, role };
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to update role');
        }
    }
);

// ── Orders ───────────────────────────────────────────
export const fetchAllOrders = createAsyncThunk(
    'admin/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/order/orders');
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const changeOrderStatus = createAsyncThunk(
    'admin/changeOrderStatus',
    async ({ orderId, newStatus }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/order/status/${orderId}`, { newStatus });
            return { orderId, newStatus, data };
        } catch (e) {
            return rejectWithValue(e.response?.data || 'Failed to change order status');
        }
    }
);

export const deleteOrder = createAsyncThunk(
    'admin/deleteOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            await api.delete(`/order/${orderId}`);
            return orderId;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to delete order');
        }
    }
);

// ── Flowers ──────────────────────────────────────────
export const fetchFlowers = createAsyncThunk(
    'admin/fetchFlowers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/products/flowers');
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to fetch flowers');
        }
    }
);

export const createFlower = createAsyncThunk(
    'admin/createFlower',
    async ({ flowerData, imageFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('flowerRequest', new Blob([JSON.stringify(flowerData)], { type: 'application/json' }));
            formData.append('imageFile', imageFile);
            const { data } = await api.post('/products/flowers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to create flower');
        }
    }
);

export const updateFlower = createAsyncThunk(
    'admin/updateFlower',
    async ({ id, flowerData, imageFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Object.entries(flowerData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) formData.append(key, value);
            });
            formData.append('imageFile', imageFile);
            const { data } = await api.put(`/products/flowers/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to update flower');
        }
    }
);

export const deleteFlower = createAsyncThunk(
    'admin/deleteFlower',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/products/flowers/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to delete flower');
        }
    }
);

// ── Bouquets ─────────────────────────────────────────
export const fetchBouquets = createAsyncThunk(
    'admin/fetchBouquets',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/products/bouquets');
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to fetch bouquets');
        }
    }
);

export const createBouquet = createAsyncThunk(
    'admin/createBouquet',
    async ({ bouquetData, imageFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('bouquetRequest', new Blob([JSON.stringify(bouquetData)], { type: 'application/json' }));
            formData.append('imageFile', imageFile);
            const { data } = await api.post('/products/bouquets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to create bouquet');
        }
    }
);

export const updateBouquet = createAsyncThunk(
    'admin/updateBouquet',
    async ({ id, bouquetData, imageFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Object.entries(bouquetData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) formData.append(key, value);
            });
            formData.append('imageFile', imageFile);
            const { data } = await api.put(`/products/bouquets/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to update bouquet');
        }
    }
);

export const deleteBouquet = createAsyncThunk(
    'admin/deleteBouquet',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/products/bouquets/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to delete bouquet');
        }
    }
);

// ── Blogs ────────────────────────────────────────────
export const fetchBlogs = createAsyncThunk(
    'admin/fetchBlogs',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/blogs');
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to fetch blogs');
        }
    }
);

export const createBlog = createAsyncThunk(
    'admin/createBlog',
    async ({ blogData, imageFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('blogDTO', new Blob([JSON.stringify(blogData)], { type: 'application/json' }));
            formData.append('imageFile', imageFile);
            const { data } = await api.post('/blogs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to create blog');
        }
    }
);

export const updateBlog = createAsyncThunk(
    'admin/updateBlog',
    async ({ id, blogData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/blogs/${id}`, blogData);
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to update blog');
        }
    }
);

export const deleteBlog = createAsyncThunk(
    'admin/deleteBlog',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/blogs/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to delete blog');
        }
    }
);

// ── Slides (note: different base path /slides, not /api/v1/slides) ──
import axios from "axios";

const slidesBaseURL = (import.meta.env.VITE_API_KEY || 'http://localhost:8080/api/v1').replace('/api/v1', '');

const slidesApi = axios.create({
    baseURL: slidesBaseURL,
    withCredentials: true,
});

slidesApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const fetchSlides = createAsyncThunk(
    'admin/fetchSlides',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await slidesApi.get('/slides');
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to fetch slides');
        }
    }
);

export const createSlide = createAsyncThunk(
    'admin/createSlide',
    async (imageFile, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('imageFile', imageFile);
            const { data } = await slidesApi.post('/slides', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to create slide');
        }
    }
);

export const deleteSlide = createAsyncThunk(
    'admin/deleteSlide',
    async (id, { rejectWithValue }) => {
        try {
            await slidesApi.delete(`/slides/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || 'Failed to delete slide');
        }
    }
);

// ── Slice ────────────────────────────────────────────
const initialState = {
    // Dashboard
    stats: { totalOrders: 0, totalUsers: 0, totalProducts: 0, totalRevenue: 0 },
    statsLoading: false,

    // Users
    users: [],
    usersLoading: false,

    // Orders
    orders: [],
    ordersLoading: false,

    // Products
    flowers: [],
    flowersLoading: false,
    bouquets: [],
    bouquetsLoading: false,

    // Blogs
    blogs: [],
    blogsLoading: false,

    // Slides
    slides: [],
    slidesLoading: false,

    // General
    error: null,
    successMessage: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminError(state) { state.error = null; },
        clearSuccessMessage(state) { state.successMessage = null; },
    },
    extraReducers: (builder) => {
        builder
            // Dashboard stats
            .addCase(fetchDashboardStats.pending, (s) => { s.statsLoading = true; })
            .addCase(fetchDashboardStats.fulfilled, (s, a) => { s.statsLoading = false; s.stats = a.payload; })
            .addCase(fetchDashboardStats.rejected, (s, a) => { s.statsLoading = false; s.error = a.payload; })

            // Users
            .addCase(fetchAdminUsers.pending, (s) => { s.usersLoading = true; })
            .addCase(fetchAdminUsers.fulfilled, (s, a) => { s.usersLoading = false; s.users = a.payload; })
            .addCase(fetchAdminUsers.rejected, (s, a) => { s.usersLoading = false; s.error = a.payload; })

            .addCase(deleteAdminUser.fulfilled, (s, a) => {
                s.users = s.users.filter(u => u.id !== a.payload);
                s.successMessage = 'User deleted successfully';
            })
            .addCase(deleteAdminUser.rejected, (s, a) => { s.error = a.payload; })

            .addCase(updateUserRole.fulfilled, (s, a) => {
                const user = s.users.find(u => u.email === a.payload.email);
                if (user) user.role = a.payload.role;
                s.successMessage = 'Role updated successfully';
            })
            .addCase(updateUserRole.rejected, (s, a) => { s.error = a.payload; })

            // Orders
            .addCase(fetchAllOrders.pending, (s) => { s.ordersLoading = true; })
            .addCase(fetchAllOrders.fulfilled, (s, a) => { s.ordersLoading = false; s.orders = a.payload; })
            .addCase(fetchAllOrders.rejected, (s, a) => { s.ordersLoading = false; s.error = a.payload; })

            .addCase(changeOrderStatus.fulfilled, (s, a) => {
                const order = s.orders.find(o => o.id === a.payload.orderId);
                if (order) order.orderStatus = a.payload.newStatus;
                s.successMessage = 'Order status updated';
            })
            .addCase(changeOrderStatus.rejected, (s, a) => { s.error = a.payload; })

            .addCase(deleteOrder.fulfilled, (s, a) => {
                s.orders = s.orders.filter(o => o.id !== a.payload);
                s.successMessage = 'Order deleted';
            })
            .addCase(deleteOrder.rejected, (s, a) => { s.error = a.payload; })

            // Flowers
            .addCase(fetchFlowers.pending, (s) => { s.flowersLoading = true; })
            .addCase(fetchFlowers.fulfilled, (s, a) => { s.flowersLoading = false; s.flowers = a.payload; })
            .addCase(fetchFlowers.rejected, (s, a) => { s.flowersLoading = false; s.error = a.payload; })

            .addCase(createFlower.fulfilled, (s, a) => {
                s.flowers.push(a.payload);
                s.successMessage = 'Flower created successfully';
            })
            .addCase(createFlower.rejected, (s, a) => { s.error = a.payload; })

            .addCase(updateFlower.fulfilled, (s, a) => {
                const idx = s.flowers.findIndex(f => f.id === a.payload.id);
                if (idx !== -1) s.flowers[idx] = a.payload;
                s.successMessage = 'Flower updated successfully';
            })
            .addCase(updateFlower.rejected, (s, a) => { s.error = a.payload; })

            .addCase(deleteFlower.fulfilled, (s, a) => {
                s.flowers = s.flowers.filter(f => f.id !== a.payload);
                s.successMessage = 'Flower deleted';
            })
            .addCase(deleteFlower.rejected, (s, a) => { s.error = a.payload; })

            // Bouquets
            .addCase(fetchBouquets.pending, (s) => { s.bouquetsLoading = true; })
            .addCase(fetchBouquets.fulfilled, (s, a) => { s.bouquetsLoading = false; s.bouquets = a.payload; })
            .addCase(fetchBouquets.rejected, (s, a) => { s.bouquetsLoading = false; s.error = a.payload; })

            .addCase(createBouquet.fulfilled, (s, a) => {
                s.bouquets.push(a.payload);
                s.successMessage = 'Bouquet created successfully';
            })
            .addCase(createBouquet.rejected, (s, a) => { s.error = a.payload; })

            .addCase(updateBouquet.fulfilled, (s, a) => {
                const idx = s.bouquets.findIndex(b => b.id === a.payload.id);
                if (idx !== -1) s.bouquets[idx] = a.payload;
                s.successMessage = 'Bouquet updated successfully';
            })
            .addCase(updateBouquet.rejected, (s, a) => { s.error = a.payload; })

            .addCase(deleteBouquet.fulfilled, (s, a) => {
                s.bouquets = s.bouquets.filter(b => b.id !== a.payload);
                s.successMessage = 'Bouquet deleted';
            })
            .addCase(deleteBouquet.rejected, (s, a) => { s.error = a.payload; })

            // Blogs
            .addCase(fetchBlogs.pending, (s) => { s.blogsLoading = true; })
            .addCase(fetchBlogs.fulfilled, (s, a) => { s.blogsLoading = false; s.blogs = a.payload; })
            .addCase(fetchBlogs.rejected, (s, a) => { s.blogsLoading = false; s.error = a.payload; })

            .addCase(createBlog.fulfilled, (s, a) => {
                s.blogs.push(a.payload);
                s.successMessage = 'Blog created successfully';
            })
            .addCase(createBlog.rejected, (s, a) => { s.error = a.payload; })

            .addCase(updateBlog.fulfilled, (s, a) => {
                const idx = s.blogs.findIndex(b => b.id === a.payload.id);
                if (idx !== -1) s.blogs[idx] = a.payload;
                s.successMessage = 'Blog updated successfully';
            })
            .addCase(updateBlog.rejected, (s, a) => { s.error = a.payload; })

            .addCase(deleteBlog.fulfilled, (s, a) => {
                s.blogs = s.blogs.filter(b => b.id !== a.payload);
                s.successMessage = 'Blog deleted';
            })
            .addCase(deleteBlog.rejected, (s, a) => { s.error = a.payload; })

            // Slides
            .addCase(fetchSlides.pending, (s) => { s.slidesLoading = true; })
            .addCase(fetchSlides.fulfilled, (s, a) => { s.slidesLoading = false; s.slides = a.payload; })
            .addCase(fetchSlides.rejected, (s, a) => { s.slidesLoading = false; s.error = a.payload; })

            .addCase(createSlide.fulfilled, (s, a) => {
                s.slides.push(a.payload);
                s.successMessage = 'Slide uploaded successfully';
            })
            .addCase(createSlide.rejected, (s, a) => { s.error = a.payload; })

            .addCase(deleteSlide.fulfilled, (s, a) => {
                s.slides = s.slides.filter(sl => sl.id !== a.payload);
                s.successMessage = 'Slide deleted';
            })
            .addCase(deleteSlide.rejected, (s, a) => { s.error = a.payload; });
    }
});

export const { clearAdminError, clearSuccessMessage } = adminSlice.actions;
export default adminSlice.reducer;
