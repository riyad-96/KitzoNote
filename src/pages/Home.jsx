import { useCallback, useContext, useEffect, useState } from 'react';
import { userContext } from '../contexts/contexts';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CheckedSvg, LoaderSvg, NoteSvg, TrashSvg, ZeroSvg } from '../components/Svgs';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';

function Home() {
  const { user } = useContext(userContext);
  const uid = user?.uid;

  async function signout() {
    await signOut(auth);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-screen max-w-[1200px]">
        <aside className="h-full w-[250px] border-x-1 border-zinc-200 bg-zinc-50">
          <div className="flex items-center justify-between p-3">
            <span className="text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)]">ZeroNote</span>
            <button className="md:hidden">
              <ZeroSvg width="30" height="30" />
            </button>
          </div>

          <div className="grid gap-1 bg-zinc-100 p-3">
            <NavLink to="/notes" className={({ isActive }) => `flex h-[40px] items-center gap-2 rounded-md border-1 border-transparent px-3 transition-colors hover:bg-zinc-200 hover:border-zinc-300 ${isActive && 'border-zinc-300 bg-zinc-200'}`}>
              <NoteSvg width="18" height="18" />
              <span>Notes</span>
            </NavLink>
            <NavLink to="/trash" className={({ isActive }) => `flex h-[40px] items-center gap-2 rounded-md border-1 border-transparent px-3 transition-colors hover:bg-zinc-200 hover:border-zinc-300 ${isActive && 'border-zinc-300 bg-zinc-200'}`}>
              <TrashSvg width="20" height="20" />
              <span>Trash</span>
            </NavLink>
          </div>
        </aside>

        <main className="flex-1 bg-zinc-50 border-r-1 border-zinc-200">
          <Header />
          <div className="p-3">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
