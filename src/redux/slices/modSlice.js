import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAnimation: 0, // Index of the selected animation
  animationSpeed: 50, // Default animation speed value (0-100)
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
    { id: 13, name: 'Animation 13' },
    { id: 14, name: 'Animation 14' },
    { id: 15, name: 'Animation 15' },
    { id: 16, name: 'Animation 16' },
    { id: 17, name: 'Animation 17' },
    { id: 18, name: 'Animation 18' },
    { id: 19, name: 'Animation 19' },
    { id: 20, name: 'Animation 20' },
    { id: 21, name: 'Animation 21' },
    { id: 22, name: 'Animation 22' },
    { id: 23, name: 'Animation 23' },
    { id: 24, name: 'Animation 24' },
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