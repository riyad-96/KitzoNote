import { createContext, useContext, useState } from 'react';
const userContext = createContext();

function UserContextProvider({children}) {
  const [user, setUser] = useState({});
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  return (
    <userContext.Provider value={{user, setUser, isTouchDevice}}>
      {children}
    </userContext.Provider>
  )
}

export default UserContextProvider;

export function useUser() {
  return useContext(userContext);
}