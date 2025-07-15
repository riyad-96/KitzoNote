import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isLoggedInContext, userContext } from './contexts/contexts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(isLoggedInContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/log-in', {replace: true});
    }
    if (isLoggedIn) {
      navigate('/', {replace: true});
    }
  }, [isLoggedIn, navigate]);

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser({});
        setIsLoggedIn(false);
        setIsLoaded(true);
        return;
      }
      setUser(currentUser);
      setIsLoggedIn(true);
      setIsLoaded(true);
    });

    return () => subscribe();
  }, [setIsLoggedIn, setUser]);

  return (
    <div className="font-[Poppins]">
      <div className={`fixed inset-0 z-[999] grid place-items-center bg-white ${isLoaded && 'site-loaded'}`}>{loaderSvg()}</div>
      {isLoaded && <Outlet />}
    </div>
  );
}

export default App;

function loaderSvg() {
  return (
    <svg className="animate-spin sm:size-[40px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z"></path>
    </svg>
  );
}
