// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axiosInstance from "@/utils/axios";

// const AUTH_REGISTER = "/auth/register";
// const AUTH_LOGIN = "/auth/login";
// const AUTH_CHECK_TOKEN = "/auth/check-auth";

// const parseApiError = (error) => ({
//   message: error.response?.data?.message || "An unexpected error occurred",
//   status: error.response?.status || 500,
// });

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   isLoading: true,
//   error: null,
//   isInitialized: false,
// };

// export const registerUser = createAsyncThunk(AUTH_REGISTER, async (formData, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post('/api/auth/register', formData);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(parseApiError(error));
//   }
// });

// export const loginUser = createAsyncThunk(AUTH_LOGIN, async (formData, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post('/api/auth/login', formData);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(parseApiError(error));
//   }
// });

// export const checkAuth = createAsyncThunk(AUTH_CHECK_TOKEN, async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get('/api/auth/check-auth');
//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       return { success: false, user: null, isInitialized: true };
//     }
//     return rejectWithValue(parseApiError(error));
//   }
// });


// export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post('/api/auth/refresh-token');
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(parseApiError(error));
//   }
// });

// export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post('/api/auth/logout');
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(parseApiError(error));
//   }
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       state.isLoading = false;
//       state.isInitialized = true;
//       state.error = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isInitialized = true;
//         state.user = action.payload.user || null;
//         state.isAuthenticated = true;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message || "Registration failed.";
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isInitialized = true;
//         if (action.payload?.success) {
//           state.user = action.payload.user;
//           state.isAuthenticated = true;
//         } else {
//           state.error = action.payload?.message || "Login failed.";
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message || "Login failed.";
//       })
//       .addCase(checkAuth.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isInitialized = true;
//         if (action.payload?.success) {
//           state.user = action.payload.user;
//           state.isAuthenticated = true;
//         } else {
//           state.user = null;
//           state.isAuthenticated = false;
//           state.isInitialized = true;
//         }
//       })
//       .addCase(checkAuth.rejected, (state) => {
//         state.isLoading = false;
//         state.isInitialized = true;
//         state.user = null;
//         state.isAuthenticated = false;
//       })
//       .addCase(refreshToken.fulfilled, (state, action) => {
//         if (action.payload?.user) {
//           state.user = action.payload.user;
//           state.isAuthenticated = true;
//           state.error = null;
//           state.isInitialized = true;
//         }
//       })
//       .addCase(refreshToken.rejected, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.isLoading = false;
//         state.error = "Session expired. Please login again.";
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.isLoading = false;
//         state.error = null;
//         state.isInitialized = true; // Add this line
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.error = action.payload.message || "Logout failed.";
//       });
//   },
// });

// export const { setUser, clearError } = authSlice.actions;
// export default authSlice.reducer;




import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

const AUTH_REGISTER = "/auth/register";
const AUTH_LOGIN = "/auth/login";
const AUTH_CHECK_TOKEN = "/auth/check-auth";

const parseApiError = (error) => ({
  message: error.response?.data?.message || "An unexpected error occurred",
  status: error.response?.status || 500,
});

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isInitialized: false,
};

export const registerUser = createAsyncThunk(AUTH_REGISTER, async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/register', formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseApiError(error));
  }
});

export const loginUser = createAsyncThunk(AUTH_LOGIN, async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(parseApiError(error));
  }
});

export const checkAuth = createAsyncThunk(AUTH_CHECK_TOKEN, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/auth/check-auth');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return { success: false, user: null, isInitialized: true };
    }
    return rejectWithValue(parseApiError(error));
  }
});


export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    const response = await axiosInstance.post('/api/auth/refresh-token');
    return response.data;
  }
);

export const initiateSilentRefresh = createAsyncThunk(
  'auth/initiateSilentRefresh',
  async (_, { dispatch }) => {
    const REFRESH_INTERVAL = 45 * 1000; // 45 seconds
    
    const interval = setInterval(() => {
      dispatch(refreshToken());
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    return rejectWithValue(parseApiError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isInitialized = true;
      state.error = null;
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
        state.isInitialized = true;
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
        state.isInitialized = true;
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
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload?.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.isInitialized = true;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.error = null;
          state.isInitialized = true;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = "Session expired. Please login again.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.isInitialized = true; // Add this line
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload.message || "Logout failed.";
      }).addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;