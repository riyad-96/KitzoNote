import { format, formatDistanceToNow, isThisYear } from 'date-fns';
import { motion } from 'motion/react';
import { ArrowLeftSvg, LoaderSvg, NoteAddedSvg, NoteUpdatedSvg } from './Svgs';

function EditSpace({ func, state }) {
  const { currentEditingNote, isCurrentEditingNoteUpdating } = state;
  const { setCurrentEditingNote, setIsCurrentNoteEditing, setIsCurrentEditingNoteUpdating, fetchUserNotes, updateEditedNote } = func;

  return (
    <motion.div
      initial={{
        translateX: '100%',
      }}
      animate={{
        translateX: 0,
        transition: { duration: 0.3 },
      }}
      exit={{
        translateX: '100%',
        transition: { duration: 0.3 },
      }}
      className="absolute inset-0 top-0 left-0 z-5 grid grid-rows-[auto_1fr] rounded-lg bg-zinc-50"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setCurrentEditingNote(null);
            setIsCurrentNoteEditing(false);
            setIsCurrentEditingNoteUpdating(false);
            fetchUserNotes();
          }}
          className="relative grid size-[25px] cursor-pointer place-items-center rounded-sm bg-zinc-200 active:translate-y-[1px]"
        >
          <ArrowLeftSvg width="22" height="22" />
          <span className="absolute -inset-2 [@media(pointer:fine)]:hidden"></span>
        </button>

        <div className="flex h-[60px] flex-1 items-center justify-between">
          <div className="grid">
            <span title="Created at" className="flex cursor-default items-center gap-1 text-xs">
              <NoteAddedSvg width="14" height="14" />
              <span>{currentEditingNote.createdDate}</span>
            </span>
            <span title={`Updated at ${format(currentEditingNote.updatedDate, 'h:mm a')}, ${isThisYear(currentEditingNote.updatedDate, new Date()) ? format(currentEditingNote.updatedDate, 'dd MMM') : format(currentEditingNote.updatedDate, 'dd MMM yy')}`} className="flex cursor-default items-center gap-1 text-xs">
              {isCurrentEditingNoteUpdating ? <LoaderSvg className="animate-spin" width="14" height="14" /> : <NoteUpdatedSvg width="14" height="14" />}
              <span>{formatDistanceToNow(currentEditingNote.updatedDate, { addSuffix: true })}</span>
            </span>
          </div>

          <div className="flex gap-4">
            <button onClick={updateEditedNote} className="cursor-pointer active:opacity-50">
              update
            </button>
            <button className="cursor-pointer active:opacity-50">refresh</button>
          </div>
        </div>
      </div>

      <div className="grid grid-rows-[auto_1fr] rounded-lg border-1 border-zinc-300">
        <input type="text" value={currentEditingNote.title} onChange={(e) => setCurrentEditingNote((prev) => ({ ...prev, title: e.target.value }))} className="px-3 pt-2 text-lg font-medium outline-none" />
        <textarea value={currentEditingNote.text} onChange={(e) => setCurrentEditingNote((prev) => ({ ...prev, text: e.target.value }))} className="resize-none px-3 pt-1 pb-8 outline-none"></textarea>
      </div>
    </motion.div>
  );
}

export default EditSpace;
