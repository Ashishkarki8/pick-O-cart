import appConfig from "@/appConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_REGISTER = "/auth/register";
const AUTH_LOGIN = "/auth/login";
const AUTH_CHECK_TOKEN = "/auth/check-auth";


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
  isLoading: true,  // Start with true
  error: null,
  isInitialized: false  // Add this flag
};

export const registerUser = createAsyncThunk(AUTH_REGISTER, async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${appConfig.frontendApiURL}/api/auth/register`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(parseApiError(error));
  }
});

export const loginUser = createAsyncThunk(AUTH_LOGIN, async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${appConfig.frontendApiURL}/api/auth/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(parseApiError(error));
  }
});

export const checkAuth = createAsyncThunk(AUTH_CHECK_TOKEN, async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${appConfig.frontendApiURL}/api/auth/check-auth`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
    return response.data;
  } catch (error) {
    // Don't treat auth check failures as errors, just return null user
    if (error.response?.status === 401) {
      return { user: null };
    }
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
      
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;

// reducers: {
//   // ... your existing reducers
//   logout: (state) => {
//     state.user = null;
//     state.isAuthenticated = false;
//     state.isLoading = false;
//     state.error = null;
//     state.isInitialized = true;
//   },
// }




// import appConfig from "@/appConfig";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const AUTH_REGISTER = "/auth/register";
// const AUTH_LOGIN = "/auth/login";
// const AUTH_CHECK_TOKEN = "/auth/check-auth";


// // Utility function for consistent error parsing
// const parseApiError = (error) => ({
//   message: error.response?.data?.message || "An unexpected error occurred",
//   status: error.response?.status || 500,
// });

// // Initial state
// //the app treats the user as unauthenticated during the brief moment before checkAuth completes.
// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   isLoading: false,  //pachi false banauda huncha
//   error: null,
// };

// export const registerUser = createAsyncThunk(AUTH_REGISTER, async (formData, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(`${appConfig.frontendApiURL}/api/auth/register`, formData, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(parseApiError(error));
//   }
// });

// export const loginUser = createAsyncThunk(AUTH_LOGIN, async (formData, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(`${appConfig.frontendApiURL}/api/auth/login`, formData, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(parseApiError(error));
//   }
// });

// export const checkAuth = createAsyncThunk(AUTH_CHECK_TOKEN, async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`${appConfig.frontendApiURL}/api/auth/check-auth`, {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//         "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
//       },
//     });
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
//       state.isLoading = false; //from copilot
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
//         if (action.payload?.success) {
//           state.user = action.payload.user;
//           state.isAuthenticated = true;
//         } else {
//           state.error = action.payload?.message || "Authentication failed.";
//         }
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message || "Authentication failed.";
//       });
//   },
// });

// export const { setUser, clearError } = authSlice.actions;

// export default authSlice.reducer;







