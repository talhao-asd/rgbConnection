import React, { useState, useEffect, createContext } from 'react';
import Navigation from './src/navigation';
import LoadingComponent from './src/components/LoadingComponent';
import { Provider } from 'react-redux';
import store from './src/redux/store';

// Create a loading context to manage loading state across the app
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {},
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Simulate initial app loading
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Add your initialization logic here
        // For example: load fonts, check authentication, etc.
        await new Promise(resolve => setTimeout(resolve, 3000)); // Changed from 2000 to 3000 ms
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isReady) {
    // Show loading screen during initial app load
    return <LoadingComponent />;
  }

  return (
    <Provider store={store}>
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        {isLoading && <LoadingComponent />}
        <Navigation />
      </LoadingContext.Provider>
    </Provider>
  );
};

export default App; 