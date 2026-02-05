
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LeaderboardEntry } from '../types.ts';
import { PyramidItem } from './PyramidItem.tsx';

interface PyramidLayoutProps {
  entries: LeaderboardEntry[];
  onSelectItem: (id: string) => void;
}

export const PyramidLayout: React.FC<PyramidLayoutProps> = ({ entries, onSelectItem }) => {
  const sorted = [...entries].sort((a, b) => b.amount - a.amount);

  const rows: { entry: LeaderboardEntry, rank: number }[][] = [];
  let currentIndex = 0;
  let rowSize = 1;

  while (currentIndex < sorted.length) {
    const row = sorted.slice(currentIndex, currentIndex + rowSize).map((entry, idx) => ({
      entry,
      rank: currentIndex + idx
    }));
    rows.push(row);
    currentIndex += rowSize;
    // Cap the row growth or keep it consistent? 
    // For 1000 items, standard pyramid rows work well.
    rowSize++;
  }

  return (
    <div className="flex flex-col items-center gap-[1px] md:gap-[2px] pb-56 w-full">
      <AnimatePresence mode="popLayout">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={`row-${rowIndex}`}
            layout
            className="flex flex-nowrap justify-center gap-[1px] md:gap-[2px] px-1"
          >
            {row.map((item) => (
              <PyramidItem
                key={item.entry.id}
                entry={item.entry}
                tier={rowIndex}
                rank={item.rank}
                onClick={onSelectItem}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
