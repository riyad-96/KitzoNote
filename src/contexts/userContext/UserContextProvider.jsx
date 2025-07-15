import { useState } from 'react';
import { userContext } from './userContext';

import React from 'react';

function UserContextProvider({ children }) {
  const [user, setUser] = useState({});
  const { Provider } = userContext;

  return <Provider value={{ user, setUser }}>{children}</Provider>;
}

export default UserContextProvider;
