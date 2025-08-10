import { AnimatePresence, motion } from 'motion/react';
import { useUser } from '../contexts/contexts';
import { CloseSvg, EditProfileSvg, ProfileSvg } from './Svgs';

export default function Profile({ coords, className, func }) {
  const { user, profileData } = useUser();
  const { setProfileModalCoord } = func;

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
      className={`profile-card fixed z-20 w-[300px] rounded-2xl border-1 border-zinc-300 bg-zinc-100 py-6 shadow-md transition-[width,color,background-color,border-color] duration-150 md:w-[350px] dark:border-zinc-700 dark:bg-zinc-800 ${className}`}
    >
      <button onClick={() => setProfileModalCoord(null)} className="absolute top-2 right-2 grid size-[35px] cursor-pointer place-items-center rounded-full [@media(pointer:fine)]:hover:bg-zinc-300 dark:[@media(pointer:fine)]:hover:bg-zinc-700">
        <CloseSvg />
        <span className="absolute -inset-1 z-5 [@media(pointer:fine)]:hidden"></span>
      </button>

      <div className="space-y-4">
        <p className="text-center font-light tracking-wide text-sm">{user.email}</p>

        <div className="grid justify-center">
          <div onClick={() => console.log('lal')} className="group relative size-[70px] cursor-pointer rounded-full">
            {profileData?.imgUrl ? <img src={profileData.imgUrl} alt="Profile picture" /> : <ProfileSvg className="size-full fill-zinc-800 transition-colors duration-150 dark:fill-zinc-200" />}

            <button className="absolute right-0 bottom-0 grid size-[24px] cursor-pointer place-items-center rounded-full bg-white shadow-md transition-colors duration-150 group-hover:text-blue-500 dark:bg-zinc-700">
              <EditProfileSvg />
            </button>
          </div>
        </div>

        <h2 className="text-center tracking-wide text-lg font-light md:text-xl">Hi, {profileData.name} !</h2>

        <button onClick={() => {
          setProfileModalCoord(null)
        }} className="mx-auto block cursor-pointer rounded-full border border-zinc-500/30 bg-zinc-200 [@media(pointer:fine)]:hover:border-zinc-500 dark:border-zinc-500/40 dark:bg-zinc-700 px-6 py-2 text-sm tracking-wide transition-colors dark:[@media(pointer:fine)]:hover:border-zinc-500 [@media(pointer:fine)]:active:translate-y-[1px]">Edit profile</button>
      </div>
    </motion.div>
  );
}
