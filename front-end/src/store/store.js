import {  configureStore} from "@reduxjs/toolkit";
import authReducer from './auth-slice/index.js'
// collects all the store
const store=configureStore({
    reducer:{
        auth:authReducer,
    }
})

export default store;