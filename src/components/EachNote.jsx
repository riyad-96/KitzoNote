import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

function EachNote({ note, func }) {
  const { id, title, text } = note;
  const { openContextMenu } = func;

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3 },
      }}
      exit={{
        opacity: 0,
      }}
      className="group relative grid max-w-[461px] grid-rows-[23px_1fr] gap-2 overflow-hidden rounded-lg border border-zinc-200 p-4 text-zinc-700 transition-[box-shadow,color,background-color,border-color] duration-150 select-none hover:text-zinc-950 hover:shadow-md hover:shadow-zinc-200 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:shadow-zinc-800"
    >
      <span className="line-clamp-1 text-lg leading-tight font-medium">{title}</span>
      <div className="line-clamp-5 min-h-[50px] leading-snug whitespace-pre-wrap">{text}</div>

      <span
        onClick={() => navigate(`/home/notes/${id}`)}
        onContextMenu={(e) => {
          e.preventDefault();
          const minRight = window.innerWidth - e.clientX;
          const minTop = window.innerHeight - e.clientY;
          openContextMenu({ clientX: minRight < 145 ? e.clientX - 128 : e.clientX, clientY: minTop < 120 ? e.clientY - 116 : e.clientY, id });
        }}
        className="absolute inset-0 z-1 cursor-pointer active:bg-white/30 dark:active:bg-white/1"
      ></span>
    </motion.div>
  );
}

export default EachNote;
