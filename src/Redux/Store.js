import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducers/UserSlice"
import alertReducer from "./Reducers/alertSlice"
import currentOrderReducer from "./Reducers/CurrentOrderSlice"



export const store = configureStore({
    reducer:{
        user:userReducer,
        alert:alertReducer,
        currentOrder:currentOrderReducer

       
    }
})