import { createContext, useContext, useState } from 'react';
const isLoggedInContext = createContext();

function IsLoggedInContextProvider({children}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <isLoggedInContext.Provider value={{isLoggedIn, setIsLoggedIn, isLoaded, setIsLoaded}}>
      {children}
    </isLoggedInContext.Provider>
  )
}

export default IsLoggedInContextProvider;

export function useIsLoggedIn() {
  return useContext(isLoggedInContext);
}