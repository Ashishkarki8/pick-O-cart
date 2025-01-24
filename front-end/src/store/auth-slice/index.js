import appConfig from "@/appConfig";
import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const AUTH_REGISTER = "/auth/register";
const AUTH_LOGIN = "/auth/login";
const AUTH_CHECK_TOKEN = "/auth/check-auth";
const AUTH_REFRESH_TOKEN = "/auth/refresh-token";


// Utility function for consistent error parsing
const parseApiError = (error) => ({
  message: error.response?.data?.message || "An unexpected error occurred",
  status: error.response?.status || 500,
});

// Initial state
//the app treats the user as unauthenticated during the brief moment before checkAuth completes.
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isInitialized: false,
  accessToken: null,
  refreshToken: null
};

export const registerUser = createAsyncThunk(
  AUTH_REGISTER, 
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  AUTH_LOGIN, 
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

export const checkAuth = createAsyncThunk(
  AUTH_CHECK_TOKEN, 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/auth/check-auth');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { user: null };
      }
      return rejectWithValue(parseApiError(error));
    }
  }
);

export const refreshToken = createAsyncThunk(
  AUTH_REFRESH_TOKEN,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/refresh-token');
      return response.data;
    } catch (error) {
      return rejectWithValue(parseApiError(error));
    }
  }
);
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isInitialized = true; // Add this
      state.error = null; // Good practice to clear any errors
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true; // Add this
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || "Registration failed.";
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true; // Add this
        if (action.payload?.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.error = action.payload?.message || "Login failed.";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || "Login failed.";
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;  // Clear previous errors (from your version)
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;  // New flag for initialization
        if (action.payload?.success) {  // Keep your success check
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.error = action.payload?.message || "Authentication failed.";
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;  // New flag for initialization
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Authentication failed.";  // Keep your error message handling
      })
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user; // Add this to update user data
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload?.message || "Token refresh failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload.message;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;






