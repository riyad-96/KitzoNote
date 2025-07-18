import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

function EachNote({ note, func }) {
  const { id, title, text, createdAt } = note;
  const { openContextMenu } = func;
  const readableDate = createdAt?.toDate?.() || new Date();
  const relativeTime = formatDistanceToNow(readableDate, { addSuffix: true });

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 1 },
      }}
      className="space-y-3 group relative rounded-lg border border-zinc-200 p-3 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
    >
      <span className="font-medium leading-tight line-clamp-1 text-lg">{title}</span>
      <div className="line-clamp-4 min-h-[40px] whitespace-pre-wrap leading-snug">{text}</div>

      <span
        onContextMenu={(e) => {
          e.preventDefault();
          const minRight = window.innerWidth - e.clientX;
          openContextMenu({ clientX: minRight < 145 ? e.clientX - 128 : e.clientX, clientY: e.clientY, id });
        }}
        className="absolute inset-0 z-1 cursor-pointer"
      ></span>
    </motion.div>
  );
}

export default EachNote;
