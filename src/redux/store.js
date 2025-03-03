import { configureStore } from '@reduxjs/toolkit';
import moduleReducer from './slices/moduleSlice';
import deviceReducer from './slices/deviceSlice';
import rgbReducer from './slices/rgbSlice';
import modReducer from './slices/modSlice';
import yildizReducer from './slices/yildizSlice';
import kayanYildizReducer from './slices/kayanYildizSlice';

const store = configureStore({
  reducer: {
    module: moduleReducer,
    device: deviceReducer,
    rgb: rgbReducer,
    mod: modReducer,
    yildiz: yildizReducer,
    kayanYildiz: kayanYildizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 