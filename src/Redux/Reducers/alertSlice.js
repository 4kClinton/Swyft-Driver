import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    alertOn(state) {
      state.value = true;
    },
    alertOff(state) {
      state.value = false;
    },
  },
});

export const { alertOn, alertOff } = alertSlice.actions;
export default alertSlice.reducer;
