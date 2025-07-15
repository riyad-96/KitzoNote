import { useContext } from 'react';
import { isLoggedInContext, userContext } from '../contexts/contexts';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

function Home() {
  const { setIsLoggedIn } = useContext(isLoggedInContext);
  const { user } = useContext(userContext);

  async function signout() {
    await signOut(auth);
  }
  console.log(user);

  return (
    <div>
      <div>
        <p>Email: {user?.email}</p>
        <p>UID: {user?.uid}</p>
        <p>pass: fakepass</p>

        <button onClick={signout} className="mt-8 cursor-pointer rounded-full bg-zinc-800 px-4 py-1 text-white hover:bg-zinc-700">
          Sign out
        </button>
      </div>

      <div className="m-4 grid max-w-[300px] gap-2">
        <label htmlFor="note"> Type notes here</label>
        <textarea id="note" className="border-1 border-zinc-600 p-4"></textarea>
        <button className="w-fit border px-4">Add</button>
      </div>

      <div></div>
    </div>
  );
}

export default Home;
