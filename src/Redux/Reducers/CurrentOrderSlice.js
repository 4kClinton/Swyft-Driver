import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
};

const currentOrder = createSlice({
  name: 'currentOrder',
  initialState,
  reducers: {
    saveOrder(state, action) {
      state.value = action.payload;
    },
    declineOrder(state) {
      state.value = {};
    },
  },
});

export const { saveOrder, declineOrder } = currentOrder.actions;
export default currentOrder.reducer;
