import { Outlet } from 'react-router-dom';
import { auth, googleAuth } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth'

function Auth() {

  async function handleGoogleAuth() {
    try {
      await signInWithPopup(auth, googleAuth)
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <div className="h-screen min-h-screen">
      <div className="grid min-h-full content-center justify-items-center overflow-y-auto py-16">
        <span className="block text-2xl font-semibold md:fixed md:top-4 md:left-4">ZeroNote</span>
        <div className="box-content w-full max-w-[340px] px-6 py-8">
          <Outlet />

          <div className="flex items-center justify-between">
            <div className="h-[1px] w-[calc(50%_-_25px)] bg-zinc-200"></div>
            <span className="text-sm font-medium">OR</span>
            <div className="h-[1px] w-[calc(50%_-_25px)] bg-zinc-200"></div>
          </div>

          <div className="mt-8">
            <button onClick={handleGoogleAuth} className="flex h-[50px] w-full cursor-pointer items-center gap-4 rounded-full border-1 border-zinc-300 px-6 text-zinc-600 hover:bg-zinc-100 active:opacity-80">
              {gIcon()}
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

function gIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path>
    </svg>
  );
}
