"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { useStore  } from "@/RTK/Store"
import { PersistGate } from 'redux-persist/integration/react';

const ReduxProvider = ({ children }) => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__persistor}>
      {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider