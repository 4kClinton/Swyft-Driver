import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
};

const currentCustomer = createSlice({
  name: 'currentCustomer',
  initialState,
  reducers: {
    saveCustomer(state, action) {
      state.value = action.payload;
    },
    removeCustomer(state) {
      state.value = {};
    },
  },
});

export const { saveCustomer, removeCustomer } = currentCustomer.actions;
export default currentCustomer.reducer;
