import IsLoggedInContextProvider from './IsLoggedInContextProvider'
import UserContextProvider from './UserContextProvider'
import NotesContextProvider from './NotesContextProvider'
import HelperContextProvider from './HelperContextProvider'

function ContextProviders({ children }) {
  return (
    <IsLoggedInContextProvider>
      <UserContextProvider>
        <NotesContextProvider>
          <HelperContextProvider>
           {children}
          </HelperContextProvider>
        </NotesContextProvider>
      </UserContextProvider>
    </IsLoggedInContextProvider>
  )
}

export default ContextProviders;