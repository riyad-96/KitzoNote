import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { LoaderSvg } from './components/Svgs';
import { useHelper, useIsLoggedIn, useUser } from './contexts/contexts';

function App() {
  const { isActivityDisabled } = useHelper();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/log-in', { replace: true });
    }
    if (isLoggedIn) {
      navigate('/notes', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const { setUser } = useUser();

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
    <div className="bg-zinc-50 font-[Poppins]">
      {isActivityDisabled && <div className="fixed inset-0 z-[10000] cursor-not-allowed bg-white/30"></div>}
      <div className={`fixed inset-0 z-[999] grid place-items-center bg-white ${isLoaded && 'site-loaded'}`}>
        <LoaderSvg className="animate-spin sm:size-[50px]" width="35" height="35" />
      </div>
      {isLoaded && <Outlet />}
    </div>
  );
}

export default App;
