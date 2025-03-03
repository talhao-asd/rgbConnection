import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  moduleCount: 1, // Default module count
  animationMode: 0, // Index of the selected animation mode
  animationSpeed: 10, // Default animation speed value (0-100)
  waitingTime: 10,    // Default waiting time value (0-100)
  lightIntensity: 10, // Default light intensity value (0-100)
  animationModes: [
    { id: 1, name: 'Mode 1' },
    { id: 2, name: 'Mode 2' },
    { id: 3, name: 'Mode 3' },
    { id: 4, name: 'Mode 4' },
    // Add more modes as needed
  ],
};

const yildizSlice = createSlice({
  name: 'yildiz',
  initialState,
  reducers: {
    setModuleCount: (state, action) => {
      state.moduleCount = action.payload;
    },
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
    resetYildizState: (state) => {
      return initialState;
    },
  },
});

export const { 
  setModuleCount,
  setAnimationMode, 
  setAnimationSpeed,
  setWaitingTime,
  setLightIntensity,
  resetYildizState 
} = yildizSlice.actions;

export default yildizSlice.reducer; 