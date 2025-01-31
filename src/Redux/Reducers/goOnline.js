import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value:false
};

const goOnline = createSlice({
  name: 'goOnline',
  initialState,
  reducers: {
    userOnline(state) {
      state.value = true;
    },
    userOffline(state) {
      state.value = false;
    },
    
  },
});

export const { userOffline,userOnline } = goOnline.actions;
export default goOnline.reducer;
