// import axios from 'axios';
// import appConfig from '../appConfig';
// import { refreshToken, logoutUser } from '../store/auth-slice';

// const axiosInstance = axios.create({
//   baseURL: appConfig.frontendApiURL,
//   withCredentials: true,
// });

// let store;
// export const injectStore = _store => {
//   store = _store;
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await store.dispatch(refreshToken());
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         store.dispatch(logoutUser());
//         window.location.href = '/auth/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



// import axios from 'axios';
// import appConfig from '../appConfig';
// import { refreshToken, logoutUser } from '../store/auth-slice';

// const axiosInstance = axios.create({
//   baseURL: appConfig.frontendApiURL,
//   withCredentials: true,
// });
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };
// let store;
// export const injectStore = _store => {
//   store = _store;
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => axiosInstance(originalRequest))
//           .catch(err => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         await store.dispatch(refreshToken());
//         isRefreshing = false;
//         processQueue(null);
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         isRefreshing = false;
//         processQueue(refreshError, null);
//         store.dispatch(logoutUser());
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
// export default axiosInstance;





import axios from 'axios';
import appConfig from '../appConfig';
import { refreshToken, logoutUser } from '../store/auth-slice';

const axiosInstance = axios.create({
  baseURL: appConfig.frontendApiURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

let store;
export const injectStore = _store => {
  store = _store;
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const result = await store.dispatch(refreshToken()).unwrap();
      processQueue(null, result);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      store.dispatch(logoutUser());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
export default axiosInstance;