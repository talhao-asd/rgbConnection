import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  moduleType: null, // Changed from 'rgb' to null to not select a default module
  moduleCount: 1,    // 1, 2, or 3
  activeComponent: null, // Changed from 'RGB' to null
};

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    setModuleType: (state, action) => {
      state.moduleType = action.payload;
      
      // Set default active component based on module type
      if (action.payload === 'rgb') {
        state.activeComponent = 'RGB';
      } else if (action.payload === 'yildiz') {
        state.activeComponent = 'Yıldız';
      } else if (action.payload === 'double') {
        state.activeComponent = 'RGB';
      }
    },
    setModuleCount: (state, action) => {
      state.moduleCount = action.payload;
    },
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    },
  },
});

export const { setModuleType, setModuleCount, setActiveComponent } = moduleSlice.actions;

export default moduleSlice.reducer; 