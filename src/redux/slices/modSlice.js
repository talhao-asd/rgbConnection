import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAnimation: 1, // Index of the selected animation
  animationSpeed: 5, // Default animation speed value (1-10)
  waitingTime: 50,    // Default waiting time value (0-100)
  lightIntensity: 50, // Default light intensity value (0-100)
  animations: [
    { id: 1, name: 'Animation 1' },
    { id: 2, name: 'Animation 2' },
    { id: 3, name: 'Animation 3' },
    { id: 4, name: 'Animation 4' },
    { id: 5, name: 'Animation 5' },
    { id: 6, name: 'Animation 6' },
    { id: 7, name: 'Animation 7' },
    { id: 8, name: 'Animation 8' },
    { id: 9, name: 'Animation 9' },
    { id: 10, name: 'Animation 10' },
    { id: 11, name: 'Animation 11' },
    { id: 12, name: 'Animation 12' },
  ],
};

const modSlice = createSlice({
  name: 'mod',
  initialState,
  reducers: {
    setSelectedAnimation: (state, action) => {
      state.selectedAnimation = action.payload;
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
    resetModState: (state) => {
      return initialState;
    },
  },
});

export const { 
  setSelectedAnimation, 
  setAnimationSpeed,
  setWaitingTime,
  setLightIntensity,
  resetModState 
} = modSlice.actions;

export default modSlice.reducer; 