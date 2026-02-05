
import React from 'react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '../types.ts';

interface PyramidItemProps {
  entry: LeaderboardEntry;
  tier: number;
  rank: number; // 0-based absolute rank
  onClick: (id: string) => void;
}

export const PyramidItem: React.FC<PyramidItemProps> = ({ entry, tier, rank, onClick }) => {
  const isAnonymous = rank >= 28;

  // Box sizes - get progressively smaller at the base for a true "grid" feel
  const sizeClass = rank === 0 
    ? "w-28 h-28 md:w-36 md:h-36" 
    : rank < 3 
      ? "w-24 h-24 md:w-32 md:h-32"
      : rank < 28
        ? "w-20 h-20 md:w-28 md:h-28"
        : "w-12 h-12 md:w-20 md:h-20"; // Anonymous boxes are smaller

  const getRankStyles = () => {
    if (rank === 0) return { 
      border: 'border-yellow-500', 
      bg: 'bg-yellow-500/5', 
      text: 'text-yellow-500', 
      label: 'text-yellow-500/50' 
    };
    if (rank === 1) return { 
      border: 'border-zinc-300', 
      bg: 'bg-zinc-300/5', 
      text: 'text-zinc-300', 
      label: 'text-zinc-300/50' 
    };
    if (rank === 2) return { 
      border: 'border-orange-800', 
      bg: 'bg-orange-800/5', 
      text: 'text-orange-700', 
      label: 'text-orange-700/50' 
    };
    // Default style
    return { 
      border: isAnonymous ? 'border-white/5' : 'border-white/20', 
      bg: 'bg-zinc-950', 
      text: isAnonymous ? 'text-zinc-700' : 'text-white', 
      label: 'text-zinc-800' 
    };
  };

  const styles = getRankStyles();

  // Font sizing
  const nameFontSize = rank === 0 
    ? "text-[10px] md:text-base" 
    : rank < 3
      ? "text-[9px] md:text-sm"
      : rank < 28
        ? "text-[8px] md:text-[11px]"
        : "text-[10px] md:text-xs"; // For P### display

  return (
    <motion.div
      layoutId={`box-${entry.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      onClick={() => onClick(entry.id)}
      className={`relative cursor-pointer transition-all ${sizeClass}`}
    >
      <div className={`h-full w-full border ${styles.border} ${styles.bg} flex flex-col items-center justify-center text-center p-1 overflow-hidden`}>
        {!isAnonymous && (
          <span className={`text-[7px] md:text-[8px] uppercase tracking-widest mb-0.5 font-bold ${styles.label}`}>
            P{(rank + 1).toString().padStart(3, '0')}
          </span>
        )}
        
        <h3 className={`font-black leading-tight break-words line-clamp-2 w-full px-0.5 tracking-tighter uppercase ${nameFontSize} ${styles.text}`}>
          {isAnonymous ? `P${(rank + 1).toString().padStart(3, '0')}` : entry.name}
        </h3>

        {!isAnonymous && (
          <div className="mt-0.5 flex flex-col items-center">
            <span className={`font-medium ${
              rank === 0 ? "text-[9px] md:text-xs" : "text-[8px] md:text-[10px]"
            } ${rank < 3 ? styles.text : 'text-zinc-500'}`}>
              £{entry.amount.toFixed(2)}
            </span>
            {entry.message && (
               <div className="w-1 h-1 bg-current mt-1 rounded-full opacity-50" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
