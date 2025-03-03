import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  color: {
    r: 255,
    g: 255,
    b: 255,
  },
  speed: 50, // Default speed value (0-100)
};

const rgbSlice = createSlice({
  name: 'rgb',
  initialState,
  reducers: {
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
    resetRgbState: (state) => {
      return initialState;
    },
  },
});

export const { setColor, setSpeed, resetRgbState } = rgbSlice.actions;

export default rgbSlice.reducer; 