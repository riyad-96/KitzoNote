import { motion } from 'motion/react';
import { useUser } from '../contexts/contexts';
import { CloseSvg, EditProfileSvg, PencilSvg, ProfileSvg, SignOutSvg } from './Svgs';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Profile({ coords, className, func }) {
  const { user, profileData } = useUser();
  const { setProfileModalCoord, setIsProfileEditing } = func;

  //! Sign out
  async function userSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <motion.div
      initial={{
        scale: 0.9,
        y: '-10px',
        x: '10px',
        opacity: 0,
      }}
      animate={{
        scale: 1,
        y: 0,
        x: 0,
        opacity: 1,
      }}
      exit={{
        scale: 0.9,
        y: '-10px',
        x: '10px',
        opacity: 0,
      }}
      transition={{
        duration: 0.1,
      }}
      style={{
        top: coords.bottom + 12,
        right: coords.right,
      }}
      className={`profile-card fixed z-20 w-[310px] rounded-2xl border-1 border-zinc-300 bg-zinc-100 px-4 py-6 shadow-md transition-[width,color,background-color,border-color] duration-150 md:w-[350px] md:px-6 dark:border-zinc-700 dark:bg-zinc-800 ${className}`}
    >
      <button onClick={() => setProfileModalCoord(null)} className="absolute top-2 right-2 grid size-[34px] cursor-pointer place-items-center rounded-full [@media(pointer:fine)]:hover:bg-zinc-300 dark:[@media(pointer:fine)]:hover:bg-zinc-700">
        <CloseSvg />
        <span className="absolute -inset-1 z-5 [@media(pointer:fine)]:hidden"></span>
      </button>

      <div className="space-y-4">
        <p className="text-center text-sm font-light tracking-wide">{user.email}</p>

        <div className="grid justify-center">
          <div
            onClick={() => {
              setIsProfileEditing(true);
              setProfileModalCoord(null);
            }}
            className="group relative size-[70px] cursor-pointer rounded-full transition-[width,height] duration-150 md:size-[90px]"
          >
            {profileData?.imgUrl ? (
              <div className="size-full overflow-hidden rounded-full">
                <img className="size-full object-cover object-center" src={profileData.imgUrl} alt="Profile picture" />
              </div>
            ) : (
              <ProfileSvg className="size-full fill-zinc-800 transition-colors duration-150 dark:fill-zinc-200" />
            )}

            <button className="absolute right-0 bottom-0 grid size-[24px] cursor-pointer place-items-center rounded-full bg-white shadow-md transition-colors duration-150 group-hover:text-blue-500 dark:bg-zinc-700">
              <EditProfileSvg />
            </button>
          </div>
        </div>

        <h2 className="text-center text-lg font-light  transition-[font-size] duration-150 md:text-xl">Hi, {profileData.name} !</h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setIsProfileEditing(true);
              setProfileModalCoord(null);
            }}
            className="relative h-[40px] cursor-pointer overflow-hidden rounded-full border border-zinc-300 bg-zinc-200 text-sm font-light tracking-wide shadow-black/40 transition-[color,background-color,border-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-300 [@media(pointer:fine)]:hover:shadow dark:[@media(pointer:fine)]:hover:bg-zinc-700"
          >
            <span className="absolute inset-0 z-5 flex items-center justify-center gap-2 dark:bg-zinc-700/40">
              <PencilSvg />
              <span>Edit profile</span>
            </span>
          </button>

          <button
            onClick={() => {
              userSignOut();
            }}
            className="relative h-[40px] cursor-pointer overflow-hidden rounded-full border border-zinc-300 bg-zinc-200 text-sm font-light tracking-wide shadow-black/40 transition-[color,background-color,border-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-300 [@media(pointer:fine)]:hover:shadow dark:[@media(pointer:fine)]:hover:bg-zinc-700"
          >
            <span className="absolute inset-0 z-5 flex items-center justify-center gap-2 dark:bg-zinc-700/40">
              <SignOutSvg />
              <span>Sign out</span>
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
