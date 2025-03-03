import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  animationMode: 0, // Index of the selected animation mode
  animationSpeed: 10, // Default animation speed value (0-100)
  waitingTime: 10,    // Default waiting time value (0-100)
  lightIntensity: 10, // Default light intensity value (0-100)
  direction: 'right', // 'left' or 'right'
  animationModes: [
    { id: 1, name: 'Mode 1' },
    { id: 2, name: 'Mode 2' },
    { id: 3, name: 'Mode 3' },
    { id: 4, name: 'Mode 4' },
    // Add more modes as needed
  ],
};

const kayanYildizSlice = createSlice({
  name: 'kayanYildiz',
  initialState,
  reducers: {
    setAnimationMode: (state, action) => {
      state.animationMode = action.payload;
    },
    setAnimationSpeed: (state, action) => {
      state.animationSpeed = action.payload;
    },
    setWaitingTime: (state, action) => {
      state.waitingTime = action.payload;
    },
    setLightIntensity: (state, action) => {
      state.lightIntensity = action.payload;
    },
    setDirection: (state, action) => {
      state.direction = action.payload;
    },
    resetKayanYildizState: (state) => {
      return initialState;
    },
  },
});

export const { 
  setAnimationMode, 
  setAnimationSpeed,
  setWaitingTime,
  setLightIntensity,
  setDirection, 
  resetKayanYildizState 
} = kayanYildizSlice.actions;

export default kayanYildizSlice.reducer; 