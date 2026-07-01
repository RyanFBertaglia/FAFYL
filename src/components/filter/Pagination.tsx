import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(0, Math.min(current - 2, total - 5));
  const end = Math.min(total, start + 5);
  for (let i = start; i < end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 0}
        className="h-8 w-8 flex items-center justify-center rounded-lg border border-input bg-white text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
      >
        <IoChevronBack size={14} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors border ${
            p === current
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-input bg-white text-muted-foreground hover:bg-primary/5'
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= total - 1}
        className="h-8 w-8 flex items-center justify-center rounded-lg border border-input bg-white text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors"
      >
        <IoChevronForward size={14} />
      </button>
    </div>
  );
}