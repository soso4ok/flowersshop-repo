import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const getUser = createAsyncThunk(
    'users/getUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/info');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch user info';
            return rejectWithValue(message);
        }
    }
);

export const logUser = createAsyncThunk(
    'users/logUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/authenticate', {
                email,
                password
            });
            return data.access_token;
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid email or password';
            return rejectWithValue(message);
        }
    }
);

export const regUser = createAsyncThunk(
    'users/regUser',
    async ({ firstName, lastName, email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/register', {
                firstname: firstName,
                lastname: lastName,
                email,
                password,
                role: "USER"
            });
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Email may already be in use.';
            return rejectWithValue(message);
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'users/verifyEmail',
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/auth/confirm?token=${token}`);
            return data;
        } catch (error) {
            const message = error.response?.data?.error || 'Verification failed';
            return rejectWithValue(message);
        }
    }
);

export const changePassword = createAsyncThunk(
    'users/changePassword',
    async ({ oldPassword, newPassword }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/users/change-password', {
                oldPassword,
                newPassword
            });
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to change password';
            return rejectWithValue(message);
        }
    }
);

const token = localStorage.getItem('token');

const initialState = {
    // Auth state
    token: token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    registrationSuccess: false,

    // User info
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',

    // Password change
    passwordLoading: false,
    passwordError: null,
    passwordSuccess: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo(state, action) {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.role = action.payload.role;
        },
        setToken(state, action) {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        logout(state) {
            state.token = null;
            state.isAuthenticated = false;
            state.registrationSuccess = false;
            state.id = '';
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.role = '';
            state.error = null;
            localStorage.removeItem('token');
        },
        clearError(state) {
            state.error = null;
            state.registrationSuccess = false;
        },
        clearPasswordStatus(state) {
            state.passwordError = null;
            state.passwordSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // logUser cases
            .addCase(logUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('token', action.payload);
            })
            .addCase(logUser.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            // regUser cases
            .addCase(regUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registrationSuccess = false;
            })
            .addCase(regUser.fulfilled, (state) => {
                state.loading = false;
                state.registrationSuccess = true;
                state.error = null;
            })
            .addCase(regUser.rejected, (state, action) => {
                state.loading = false;
                state.registrationSuccess = false;
                state.error = action.payload;
            })

            // verifyEmail cases
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('token', action.payload.access_token);
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getUser cases
            .addCase(getUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.id = action.payload.id;
                state.firstName = action.payload.firstname || action.payload.firstName || '';
                state.lastName = action.payload.lastname || action.payload.lastName || '';
                state.email = action.payload.email || '';
                state.role = action.payload.role || '';
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // changePassword cases
            .addCase(changePassword.pending, (state) => {
                state.passwordLoading = true;
                state.passwordError = null;
                state.passwordSuccess = false;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.passwordLoading = false;
                state.passwordSuccess = true;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.passwordLoading = false;
                state.passwordError = action.payload;
            });
    }
});

export const { setUserInfo, setToken, logout, clearError, clearPasswordStatus } = userSlice.actions;

export default userSlice.reducer;