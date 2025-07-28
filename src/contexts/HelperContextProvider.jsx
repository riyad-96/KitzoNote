import { createContext, useContext, useState } from 'react';
const helperContext = createContext();

function HelperContextProvider({children}) {
  const [isActivityDisabled, setIsActivityDisabled] = useState(false);
  return (
    <helperContext.Provider value={{isActivityDisabled, setIsActivityDisabled}}>
      {children}
    </helperContext.Provider>
  )
}

export default HelperContextProvider;

export function useHelper() {
  return useContext(helperContext);
}