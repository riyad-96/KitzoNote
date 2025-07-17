import React from 'react';
import IsLoggedInProvider from './isLoggedInContext/IsLoggedInProvider';
import UserContextProvider from './userContext/userContextProvider';
import NotesContextProvider from './notesContext/NotesContextProvider';

function ContextProviders({ children }) {
  return (
    <IsLoggedInProvider>
      <UserContextProvider>
        <NotesContextProvider>
          {children}
        </NotesContextProvider>
      </UserContextProvider>
    </IsLoggedInProvider>
  );
}

export default ContextProviders;
