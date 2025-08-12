import { AnimatePresence, motion } from 'motion/react';
import { ChangeFileSvg, CloseSvg, CloudUploadSvg, LoaderSvg, PencilSvg, ProfileSvg, TrashSvg } from './Svgs';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../contexts/contexts';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ProfileEditModal({ func }) {
  const { setIsProfileEditing } = func;
  const { user, profileData, setProfileData } = useUser();
  const [name, setName] = useState('');

  useEffect(() => {
    setName(profileData.name);
  }, []);

  //! Profile picture change
  const [newImgUrl, setNewImgUrl] = useState('');
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

  function readSetNewImg(e) {
    const file = e.target.files[0];
    const size = Math.floor(file.size / 1024);
    if (size > 650) {
      setIsLimitExceeded(true);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result;
      setNewImgUrl(url);
    };
    reader.readAsDataURL(file);
  }

  //! Save Profile data
  const [isSaving, setIsSaving] = useState(false);

  async function saveNewProfilePhoto() {
    setIsSaving(true);
    const docRef = doc(db, 'users', user.uid, 'profile', 'info');
    try {
      const data = await getDoc(docRef);
      await setDoc(docRef, {
        ...data.data(),
        imgUrl: newImgUrl,
      });

      setProfileData((prev) => ({ ...prev, imgUrl: newImgUrl }));
      setNewImgUrl('');
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  }

  //! Update name
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const nameDebounce = useRef(null);

  function handleNameInput(e) {
    const inputValue = e.target.value;
    setName(inputValue);
    debounceNameUpdate(inputValue.trim());
  }

  async function debounceNameUpdate(newName) {
    setIsNameUpdating(true);
    clearTimeout(nameDebounce.current);
    const docRef = doc(db, 'users', user.uid, 'profile', 'info');

    nameDebounce.current = setTimeout(async () => {
      try {
        await updateDoc(docRef, {
          ...profileData,
          name: newName,
        });
        setProfileData((prev) => ({ ...prev, name: newName }));
      } catch (error) {
        console.error(error);
      }
      setIsNameUpdating(false);
    }, 500);
  }

  //! Profile photo delete
  const [wantToDelete, setWantToDelete] = useState(false);
  const [isPhotoDeleting, setIsPhotoDeleting] = useState(false);

  async function removeProfilePicture() {
    setIsPhotoDeleting(true);
    const docRef = doc(db, 'users', user.uid, 'profile', 'info');

    try {
      await updateDoc(docRef, { ...profileData, imgUrl: '' });
      setProfileData((prev) => ({ ...prev, imgUrl: '' }));
      setIsPhotoDeleting(false);
      setWantToDelete(false);
    } catch (error) {
      setIsPhotoDeleting(false);
      console.error(error);
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{ duration: 0.2 }}
      onMouseDown={() => {
        if (!isNameUpdating) {
          setIsProfileEditing(false);
        }
      }}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/30 px-4 py-8 dark:bg-white/10 [@media(pointer:fine)]:backdrop-blur-[3px]"
    >
      {(isSaving || isPhotoDeleting) && <div onMouseDown={(e) => e.stopPropagation()} className="absolute inset-0 z-[1000]"></div>}
      <div onMouseDown={(e) => e.stopPropagation()} className="relative w-full max-w-[350px] overflow-hidden rounded-2xl bg-zinc-50 p-6 shadow-lg transition-[max-width] duration-200 md:max-w-[400px] dark:bg-zinc-900">
        <button
          onMouseDown={() => {
            if (!isNameUpdating) {
              setIsProfileEditing(false);
            }
          }}
          className="absolute top-2 right-2 grid size-[36px] cursor-pointer place-items-center rounded-full [@media(pointer:fine)]:hover:bg-zinc-300 dark:[@media(pointer:fine)]:hover:bg-zinc-700"
        >
          <CloseSvg width="20" height="20" />
          <span className="absolute -inset-1 z-5 [@media(pointer:fine)]:hidden"></span>
        </button>

        <p className="mb-4 text-xl font-medium">Profile</p>

        <div className="space-y-2">
          <label htmlFor="profile-name-input" className="block w-fit select-none">
            Profile name
          </label>

          <div className="flex rounded-full border border-zinc-300 transition-colors duration-150 focus-within:border-zinc-500 dark:border-zinc-700">
            <div className="flex-1">
              <input id="profile-name-input" type="text" value={name} onChange={handleNameInput} maxLength="40" className="w-full px-4 py-2 outline-none" autoComplete="off" />
            </div>
            <AnimatePresence>
              {isNameUpdating && (
                <div className="pointer-events-none grid place-items-center pr-2 text-zinc-600 dark:text-zinc-400">
                  <LoaderSvg width="30" height="30" className="animate-spin" />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <p>Profile picture</p>

          <div className="relative mx-auto size-[220px] rounded-full transition-[width,height] duration-200 md:size-[250px]">
            {isSaving && (
              <div className="absolute inset-0 z-5 rounded-full bg-[hsl(0,0%,50%,0.3)]">
                <div className="flex size-full items-center justify-center gap-1">
                  <div className="size-2 animate-[ping_1200ms_infinite] rounded-full bg-white"></div>
                  <div className="size-2 animate-[ping_1200ms_100ms_infinite] rounded-full bg-white"></div>
                  <div className="size-2 animate-[ping_1200ms_200ms_infinite] rounded-full bg-white"></div>
                  <div className="size-2 animate-[ping_1200ms_300ms_infinite] rounded-full bg-white"></div>
                </div>
              </div>
            )}
            {newImgUrl && (
              <div className="relative size-full overflow-hidden rounded-full">
                <img src={newImgUrl} className="size-full object-cover object-center select-none" alt="New profile picture" />
                <span className="absolute inset-0 z-5"></span>
              </div>
            )}
            {newImgUrl && (
              <label onClick={() => setIsLimitExceeded(false)} htmlFor="another-img-input" className="absolute right-0 bottom-0 z-50 grid size-[28px] cursor-pointer place-items-center rounded-full border border-zinc-300 bg-zinc-200 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                <input onChange={readSetNewImg} id="another-img-input" type="file" accept="image/*" className="hidden" />
                <ChangeFileSvg width="18" height="18" />
                <span className="absolute -inset-2 z-5 rounded-full [@media(pointer:fine)]:hidden"></span>
              </label>
            )}
            {!newImgUrl && (
              <div className="relative size-full overflow-hidden rounded-full">
                {profileData?.imgUrl ? <img className="size-full object-cover object-center select-none" src={profileData.imgUrl} alt="Profile picture" /> : <ProfileSvg className="size-full fill-zinc-800 transition-colors duration-150 dark:fill-zinc-200" />}
                <span className="absolute inset-0 z-0"></span>
              </div>
            )}
          </div>

          <p className={`text-center text-xs font-light transition-[color,font-size] duration-150 md:text-sm ${isLimitExceeded && 'text-red-500 dark:text-red-400'}`}>Please choose an image under 650 KB.</p>

          <div className="grid min-w-full grid-cols-2 gap-3">
            {!newImgUrl ? (
              <label onClick={() => setIsLimitExceeded(false)} htmlFor="profile-image-input" className="grid h-[40px] cursor-pointer place-items-center rounded-full border border-zinc-300 bg-zinc-200 text-sm font-light tracking-wide shadow-black/40 transition-[color,background-color,border-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-300 [@media(pointer:fine)]:hover:shadow dark:[@media(pointer:fine)]:hover:bg-zinc-700">
                <input onChange={readSetNewImg} id="profile-image-input" type="file" accept="image/*" className="hidden" />
                <span className="flex items-center gap-2">
                  <PencilSvg width="18" height="18" />
                  <span>Change</span>
                </span>
              </label>
            ) : (
              <button onClick={saveNewProfilePhoto} className="grid h-[40px] cursor-pointer place-items-center gap-2 rounded-full border border-zinc-300 bg-zinc-200 text-sm font-light tracking-wide shadow-black/40 transition-[color,background-color,border-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-300 [@media(pointer:fine)]:hover:shadow dark:[@media(pointer:fine)]:hover:bg-zinc-700">
                <span className="flex items-center justify-center gap-2">
                  <CloudUploadSvg />
                  <span>Save</span>
                </span>
              </button>
            )}

            <button
              onClick={() => {
                if (newImgUrl) {
                  setNewImgUrl('');
                  return;
                }
                if (profileData.imgUrl) {
                  setWantToDelete(true);
                }
              }}
              className="grid h-[40px] cursor-pointer place-items-center gap-2 rounded-full border border-zinc-300 bg-zinc-200 text-sm font-light tracking-wide shadow-black/40 transition-[color,background-color,border-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-300 [@media(pointer:fine)]:hover:shadow dark:[@media(pointer:fine)]:hover:bg-zinc-700"
            >
              {!newImgUrl ? (
                <span className="flex items-center justify-center">
                  <TrashSvg />
                  <span>Remove</span>
                </span>
              ) : (
                <span className="flex items-center justify-center">Cancel</span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {wantToDelete && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                opacity: { duration: 0.2 },
              }}
              onClick={() => setWantToDelete(false)}
              className="absolute inset-0 overflow-hidden bg-black/20 dark:bg-white/5"
            >
              <motion.div
                initial={{
                  y: '100%',
                }}
                animate={{
                  y: 0,
                }}
                exit={{
                  y: '100%',
                }}
                transition={{
                  y: { duration: 0.2 },
                }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-0 grid w-full p-3"
              >
                <div className="space-y-4 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900">
                  <p className="text-center">Remove profile photo?</p>

                  <div className="relative mx-auto size-[150px] overflow-hidden rounded-full">
                    <img className="size-full object-cover object-center select-none" src={profileData.imgUrl} alt="Profile picture" />
                    {isPhotoDeleting && (
                      <div className="absolute inset-0 z-5 rounded-full bg-[hsl(0,0%,50%,0.3)]">
                        <div className="flex size-full items-center justify-center gap-1">
                          <div className="size-2 animate-[ping_1200ms_infinite] rounded-full bg-white"></div>
                          <div className="size-2 animate-[ping_1200ms_100ms_infinite] rounded-full bg-white"></div>
                          <div className="size-2 animate-[ping_1200ms_200ms_infinite] rounded-full bg-white"></div>
                          <div className="size-2 animate-[ping_1200ms_300ms_infinite] rounded-full bg-white"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setWantToDelete(false)} className="h-[40px] cursor-pointer rounded-full border border-zinc-300 bg-zinc-200 text-sm font-light tracking-wide shadow-black/40 transition-[color,background-color,border-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-300 [@media(pointer:fine)]:hover:shadow dark:[@media(pointer:fine)]:hover:bg-zinc-700">
                      Cancel
                    </button>
                    <button onClick={removeProfilePicture} className="h-[40px] cursor-pointer rounded-full border border-zinc-300 bg-zinc-200 text-sm font-light tracking-wide shadow-black/40 transition-[color,background-color,border-color,box-shadow] dark:border-zinc-700 dark:bg-zinc-800 [@media(pointer:fine)]:hover:bg-zinc-300 [@media(pointer:fine)]:hover:shadow dark:[@media(pointer:fine)]:hover:bg-zinc-700">
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
