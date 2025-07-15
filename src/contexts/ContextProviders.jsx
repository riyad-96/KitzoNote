import React from 'react';
import IsLoggedInProvider from './isLoggedInContext/isLoggedInProvider';
import UserContextProvider from './userContext/userContextProvider';

function ContextProviders({ children }) {
  return (
    <IsLoggedInProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </IsLoggedInProvider>
  );
}

export default ContextProviders;
