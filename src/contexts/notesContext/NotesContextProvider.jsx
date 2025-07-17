import { notesContext } from './notesContext';
import { useState } from 'react';

function NotesContextProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const { Provider } = notesContext;
  return <Provider value={{notes, setNotes}}>{children}</Provider>;
}

export default NotesContextProvider;
