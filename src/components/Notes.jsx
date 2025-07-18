import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';

import { db } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { LoaderSvg } from './Svgs';
import EachNote from './EachNote';
import { AnimatePresence, motion } from 'motion/react';

function Notes() {
  const { user } = useUser();
  const { notes, setNotes } = useNotes();
  const [noteIsLoading, setNoteIsLoading] = useState(true);

  //! FetchNotes
  const fetchUserNotes = useCallback(async () => {
    const noteCollectionRef = collection(db, 'users', user.uid, 'notes');

    try {
      const notesQuery = query(noteCollectionRef, orderBy('createdAt', 'desc'));
      const dbNote = await getDocs(notesQuery);

      const notesArray = [];

      dbNote.forEach((doc) => {
        notesArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(notesArray);
      setNotes(notesArray);
      setNoteIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [user.uid, setNotes]);

  useEffect(() => {
    if (user.uid) {
      fetchUserNotes();
    }
  }, [user.uid, fetchUserNotes]);

  //! Modal and custom context menu
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    id: '',
  });
  const contextRef = useRef(null);

  function openContextMenu({ clientX, clientY, id }) {
    console.log(clientX, clientY, id);
    setContextMenu({
      visible: true,
      x: clientX,
      y: clientY,
      id,
    });
  }

  useEffect(() => {
    function handleOutsideClick() {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [contextMenu.visible]);

  //! add notes
  const quickNoteTitleRef = useRef(null);
  const quickNoteBodyRef = useRef(null);

  useEffect(() => {
    if (noteModalOpen && quickNoteTitleRef.current) {
      quickNoteTitleRef.current.focus();
    }
  }, [noteModalOpen]);

  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteBody, setQuickNoteBody] = useState('');

  async function handleAddNoteModal() {
    const notesCollectionRef = collection(db, 'users', user.uid, 'notes');

    const databaseNote = {
      title: quickNoteTitle.trim(),
      text: quickNoteBody,
      createdAt: serverTimestamp(),
    };

    try {
      const addedNote = await addDoc(notesCollectionRef, databaseNote);
      const newNoteId = addedNote.id;

      const localNote = {
        id: newNoteId,
        title: quickNoteTitle.trim(),
        text: quickNoteBody,
      };
      setNotes((prev) => [localNote, ...prev]);
      setQuickNoteTitle('');
      setQuickNoteBody('');
      setNoteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  //! Add to trash
  async function handleTrash() {
    const noteRef = doc(db, 'users', user.uid, 'notes', contextMenu.id);

    try {
      const selectedNote = await getDoc(noteRef);
      const localObj = {
        ...selectedNote.data(),
      };
      console.log({ id: selectedNote.id, ...localObj });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="">
      <div className="flex h-[60px] items-center justify-between">
        <h1 className="text-3xl font-medium">Notes</h1>
        <div className="flex items-center justify-end gap-2">
          <button className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">New Note</button>
          <button
            onClick={() => {
              setNoteModalOpen(true);
              console.log(quickNoteTitleRef.current);
            }}
            className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]"
          >
            Quick Note
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh_-_120px)] overflow-y-auto rounded-lg border border-zinc-200 p-2">
        {noteIsLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <LoaderSvg className="animate-spin" width="30" height="30" />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
            {notes.map((note) => (
              <EachNote key={note.id} note={note} func={{ openContextMenu }} />
            ))}
          </div>
        )}
      </div>

      {contextMenu.visible && (
        <div onContextMenu={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()} style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed top-0 left-0 z-10 rounded-lg bg-white p-1 shadow-md">
          <div className="grid overflow-hidden rounded-md whitespace-nowrap">
            <button onClick={() => console.log(contextMenu.id)} className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:border-zinc-200 hover:bg-zinc-200">
              Edit Note
            </button>
            <button onClick={handleTrash} className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:border-zinc-200 hover:bg-zinc-200">
              Move to trash
            </button>
            <button className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:border-zinc-200 hover:bg-zinc-200">Delete note</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {noteModalOpen && (
          <motion.div
            onMouseDown={() => setNoteModalOpen(false)}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4"
          >
            <div onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-[700px] space-y-4 rounded-xl bg-zinc-50 p-5">
              <div className="grid rounded-lg border border-zinc-200 transition-colors focus-within:border-zinc-300">
                <input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      quickNoteBodyRef.current.focus();
                    }
                  }}
                  ref={quickNoteTitleRef}
                  value={quickNoteTitle}
                  onChange={(e) => setQuickNoteTitle(e.target.value)}
                  type="text"
                  placeholder="Title"
                  className="px-4 py-2 text-lg font-medium outline-none"
                />
                <textarea
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.shiftKey) {
                      e.preventDefault();
                      handleAddNoteModal();
                    }
                  }}
                  ref={quickNoteBodyRef}
                  value={quickNoteBody}
                  onChange={(e) => setQuickNoteBody(e.target.value)}
                  placeholder="Take a note..."
                  className="max-h-[calc(100vh_-_300px)] min-h-[200px] px-4 py-2 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setNoteModalOpen(false)} className="cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-4 py-1 text-sm transition-colors hover:bg-zinc-300">
                  Cancel
                </button>
                <button onClick={handleAddNoteModal} className="cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-4 py-1 text-sm transition-colors hover:bg-zinc-300">
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Notes;
