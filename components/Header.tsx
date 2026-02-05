
import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <header className="relative z-10 pt-12 pb-8 px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 text-white">
          ASCEND
        </h1>
      </motion.div>
    </header>
  );
};
