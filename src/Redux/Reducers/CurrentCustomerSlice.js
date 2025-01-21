import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  destination: null,
};

const currentCustomer = createSlice({
  name: 'currentCustomer',
  initialState,
  reducers: {
    saveCustomer(state, action) {
      state.value = action.payload;
    },
    saveDestination(state, action) {
      state.destination = action.payload;
    },
    removeCustomer(state) {
      state.value = {};
    },
  },
});

export const { saveCustomer, removeCustomer, saveDestination } = currentCustomer.actions;
export default currentCustomer.reducer;
