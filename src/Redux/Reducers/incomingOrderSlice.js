import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
};

const incomingOrder = createSlice({
  name: 'incomingOrder',
  initialState,
  reducers: {
    addIncomingOrder(state, action) {
      state.value = action.payload;
    },
    removeIncomingOrder(state) {
      state.value = {};
    },
  
  },
});

export const { addIncomingOrder, removeIncomingOrder} = incomingOrder.actions;
export default incomingOrder.reducer;
