import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
    try {
        const { data } = await api.get('/blogs');
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Error fetching blogs:", e);
        return [];
    }
});

export const fetchBlogById = createAsyncThunk('blogs/fetchBlogById', async (id) => {
    try {
        const { data } = await api.get(`/blogs/${id}`);
        return data;
    } catch (e) {
        console.error("Error fetching blog by id:", e);
        throw e;
    }
});

export const createBlog = createAsyncThunk('blogs/createBlog', async (blogData) => {
    try {
        const { data } = await api.post('/blogs', blogData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    } catch (e) {
        console.error("Error creating blog:", e);
        throw e;
    }
});

export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id) => {
    try {
        await api.delete(`/blogs/${id}`);
        return id;
    } catch (e) {
        console.error("Error deleting blog:", e);
        throw e;
    }
});

const initialState = {
    blogs: [],
    currentBlog: null,
    status: 'idle',
    currentBlogStatus: 'idle',
};

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        clearCurrentBlog: (state) => {
            state.currentBlog = null;
            state.currentBlogStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state) => {
                state.status = 'failed';
                state.blogs = [];
            })
            .addCase(fetchBlogById.pending, (state) => {
                state.currentBlogStatus = 'loading';
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.currentBlogStatus = 'succeeded';
                state.currentBlog = action.payload;
            })
            .addCase(fetchBlogById.rejected, (state) => {
                state.currentBlogStatus = 'failed';
                state.currentBlog = null;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
            });
    }
});

export const { clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
