import React from 'react'
import { motion } from 'motion/react'

function EachNote({note}) {
  const { id, title, text } = note;
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1,
        transition: {duration: 1}
      }}
    >
      <p>{title}</p>
      <div>{text}</div>
    </motion.div>
  )
}

export default EachNote;