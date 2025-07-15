import { useState } from 'react';
import { isLoggedInContext } from './isLogggedInContext';

import React from 'react';

function IsLoggedInProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { Provider } = isLoggedInContext;
  return <Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</Provider>;
}

export default IsLoggedInProvider;
