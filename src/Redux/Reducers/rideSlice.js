import { createSlice } from '@reduxjs/toolkit'; // Add this import

const initialState = {
  addrCache: {}, // Ensure addrCache is initialized as an empty object
  // other properties...
};

const rideSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    cacheAddress: (state, action) => {
      const { key, addr } = action.payload;
      state.addrCache[key] = addr;
    },
    // other reducers...
  },
});

export const { cacheAddress } = rideSlice.actions;
export default rideSlice.reducer;