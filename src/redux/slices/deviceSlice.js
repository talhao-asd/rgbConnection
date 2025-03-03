import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deviceId: '',
  deviceName: '',
  isConnected: false,
  isConnecting: false,
  connectionError: null,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDeviceInfo: (state, action) => {
      const { id, name } = action.payload;
      state.deviceId = id || '';
      state.deviceName = name || '';
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setConnectingStatus: (state, action) => {
      state.isConnecting = action.payload;
    },
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
    },
    resetDeviceState: (state) => {
      return initialState;
    },
  },
});

export const { 
  setDeviceInfo, 
  setConnectionStatus, 
  setConnectingStatus, 
  setConnectionError,
  resetDeviceState
} = deviceSlice.actions;

export default deviceSlice.reducer; 