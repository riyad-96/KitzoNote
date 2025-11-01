import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from './Input';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleAuth } from '../config/firebase';
import { CloseEyeSvg, ErrorSvg, GoogleIcon, LoaderSvg, OpenEyeSvg } from './Svgs';

function Login() {
  const [visited, setVisited] = useState(() => {
    return localStorage.getItem('visited') === 'Yes';
  });

  useEffect(() => {
    if (!visited) localStorage.setItem('visited', 'Yes');
  }, [visited]);

  const loginEmailInputRef = useRef(null);
  const loginPassInputRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    loginEmailInputRef.current.focus();
  }, [loginEmailInputRef]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (emailError) {
      loginEmailInputRef.current.classList.add('error-state');
    } else {
      loginEmailInputRef.current.classList.remove('error-state');
    }
    if (passError) {
      loginPassInputRef.current.classList.add('error-state');
    } else {
      loginPassInputRef.current.classList.remove('error-state');
    }
  }, [emailError, passError]);

  //! input validator function
  function isAbleToLogin() {
    let ableToLogin = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    function checkEmail() {
      if (!loginEmail) {
        setEmailError('Email is required');
        ableToLogin = false;
        return;
      } else if (!emailRegex.test(loginEmail)) {
        setEmailError('Insert a valid email');
        ableToLogin = false;
        return;
      } else {
        setEmailError('');
      }
    }
    checkEmail();

    const minPassLength = 6;
    function checkPass() {
      if (!loginPass) {
        setPassError('Password is required');
        ableToLogin = false;
        return;
      } else if (loginPass.length < minPassLength) {
        setPassError(`Password must be minimum ${minPassLength} chars.`);
        ableToLogin = false;
        return;
      } else {
        setPassError('');
      }
    }
    checkPass();
    return ableToLogin;
  }

  //! Actual login program
  const [loginError, setLoginError] = useState('');
  const [tryingToLogin, setTryingToLogin] = useState(false);

  async function handleLoginBtn() {
    const ableToLogin = isAbleToLogin();
    setLoginError('');
    if (!ableToLogin) return;

    setTryingToLogin(true);

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
    } catch (error) {
      console.error(error.code);
      if (error.code === 'auth/too-many-requests') {
        setLoginError('Too many attempts. Try again later.');
      } else {
        setLoginError('Incorrect email or password.');
      }
    } finally {
      setTryingToLogin(false);
    }
  }

  // Login with google
  const [tryingGoogleLogin, setTryingGoogleLogin] = useState(false);

  async function handleGoogleAuth() {
    setTryingGoogleLogin(true);
    try {
      await signInWithPopup(auth, googleAuth);
    } catch (err) {
      console.error(err);
    } finally {
      setTryingGoogleLogin(false);
    }
  }

  return (
    <div>
      {(tryingToLogin || tryingGoogleLogin) && <div className="fixed inset-0 z-999 cursor-not-allowed bg-white/30 dark:bg-white/10"></div>}
      <h2 className="mb-8 text-center text-[1.625rem] font-medium">{visited ? 'Welcome back' : 'Welcome'}</h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <Input
            ref={loginEmailInputRef}
            value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value);
              setEmailError('');
              setLoginError('');
            }}
            type="email"
            placeholder="Email address"
            autoComplete="off"
          />
          <span className={`flex items-center gap-2 overflow-hidden text-xs tracking-wide text-red-500 transition-[height] duration-100 select-none dark:text-red-400 ${emailError ? 'h-[20px]' : 'h-0'}`}>
            <ErrorSvg />
            <span>{emailError}</span>
          </span>
        </div>

        <div className="relative">
          <Input
            ref={loginPassInputRef}
            value={loginPass}
            onChange={(e) => {
              setLoginPass(e.target.value);
              setPassError('');
              setLoginError('');
            }}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="off"
          />
          <span className={`flex items-center gap-2 overflow-hidden text-xs tracking-wide text-red-500 transition-[height] duration-100 select-none dark:text-red-400 ${passError ? 'h-[20px]' : 'h-0'}`}>
            <ErrorSvg />
            <span>{passError}</span>
          </span>

          <button onClick={() => setIsPasswordVisible((prev) => !prev)} className={`absolute top-[1.5rem] right-2 grid size-[35px] translate-y-[-50%] cursor-pointer place-items-center rounded-full text-zinc-500 transition-[opacity_background-color] hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 ${loginPass.trim() ? '' : 'pointer-events-none opacity-0'}`}>
            {isPasswordVisible ? <OpenEyeSvg /> : <CloseEyeSvg />}
            <span className="absolute -inset-2 rounded-full [@media(pointer:fine)]:hidden"></span>
          </button>
        </div>

        <button onClick={handleLoginBtn} className="grid h-[50px] w-full cursor-pointer place-items-center rounded-full bg-zinc-950 text-sm font-medium tracking-wide text-white hover:bg-zinc-800 active:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 dark:active:bg-zinc-300">
          {tryingToLogin ? <LoaderSvg className="animate-spin" width="24" height="24" /> : <span>Continue</span>}
        </button>
      </form>
      <span className={`block overflow-hidden text-center text-sm text-red-500 transition-[height_margin-top] duration-100 dark:text-red-400 ${loginError ? 'mt-4 h-[20px]' : 'mt-0 h-0'}`}>{loginError}</span>

      <div className="my-5 flex justify-center gap-1 text-center text-sm">
        <span>Don't have an account?</span>
        <Link to="/auth/create-account" className="text-[#3e68fe] hover:underline dark:text-[#577cff]">
          Sign up
        </Link>
      </div>

      <div>
        <button onClick={handleGoogleAuth} className="flex h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-950 text-sm font-medium tracking-wide text-white hover:bg-zinc-800 active:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 dark:active:bg-zinc-300">
          <GoogleIcon size="20" />
          <span>Continue with google</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
