import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  color: {
    r: 255,
    g: 255,
    b: 255,
    w: 0,  // Added white value
  },
  speed: 50, // Default brightness/speed value
  isOn: false, // Power state
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
    togglePower: (state) => {
      state.isOn = !state.isOn;
    },
    setPower: (state, action) => {
      state.isOn = action.payload;
    },
  },
});

export const { setColor, setSpeed, togglePower, setPower } = rgbSlice.actions;

export default rgbSlice.reducer; 