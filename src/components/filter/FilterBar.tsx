import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoFilter, IoClose } from 'react-icons/io5';
import { CourseCategory, CoursePeriod } from '@/types';

const CATEGORIES: { value: CourseCategory; label: string }[] = [
  { value: 'EXATAS', label: 'Exatas' },
  { value: 'SAUDE', label: 'Saúde' },
  { value: 'HUMANAS', label: 'Humanas' },
  { value: 'CRIATIVAS', label: 'Criativas' },
  { value: 'COMUNICACAO', label: 'Comunicação' },
];

const PERIODS: { value: CoursePeriod; label: string }[] = [
  { value: 'matutino', label: 'Matutino' },
  { value: 'vespertino', label: 'Vespertino' },
  { value: 'noturno', label: 'Noturno' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Nome' },
  { value: 'fees', label: 'Mensalidade' },
];

interface FilterBarProps {
  showCategory?: boolean;
  showPeriod?: boolean;
  showDistance?: boolean;
  showFees?: boolean;
  category?: string;
  onCategoryChange?: (v: string) => void;
  period?: string;
  onPeriodChange?: (v: string) => void;
  minFees?: number;
  maxFees?: number;
  onMinFeesChange?: (v: number) => void;
  onMaxFeesChange?: (v: number) => void;
  maxDistance?: number;
  onMaxDistanceChange?: (v: number) => void;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  onSortChange?: (by: string, dir: 'asc' | 'desc') => void;
}

export default function FilterBar({
  showCategory, showPeriod, showDistance, showFees,
  category, onCategoryChange,
  period, onPeriodChange,
  minFees, maxFees, onMinFeesChange, onMaxFeesChange,
  maxDistance, onMaxDistanceChange,
  sortBy, direction, onSortChange,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const hasActive = category || period || maxDistance || minFees || maxFees;

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 rounded-xl px-4 py-2 w-full cursor-pointer border-none"
      >
        <IoFilter size={16} />
        <span>Filtros</span>
        {hasActive && (
          <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-primary/3 rounded-xl p-4 mt-2 space-y-4">

              {showFees && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Mensalidade</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={50}
                      value={minFees ?? 0}
                      onChange={(e) => onMinFeesChange?.(Number(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                      R$ {minFees ?? 0} - R$ {maxFees ?? 2000}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={maxFees ?? 2000}
                    onChange={(e) => onMaxFeesChange?.(Number(e.target.value))}
                    className="flex-1 accent-primary w-full mt-1"
                  />
                </div>
              )}

              {showDistance && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">
                    Distância máxima: {maxDistance ? `${maxDistance / 1000} km` : 'Qualquer'}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={5000}
                    value={maxDistance ?? 0}
                    onChange={(e) => onMaxDistanceChange?.(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 km</span>
                    <span>200 km</span>
                  </div>
                </div>
              )}

              {showPeriod && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Turno</label>
                  <div className="flex gap-2 flex-wrap">
                    {PERIODS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => onPeriodChange?.(period === p.value ? '' : p.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                          period === p.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-white text-muted-foreground border-input hover:border-primary/30'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showCategory && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Área</label>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => onCategoryChange?.(category === c.value ? '' : c.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                          category === c.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-white text-muted-foreground border-input hover:border-primary/30'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {onSortChange && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-2">Ordenar por</label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy ?? 'name'}
                      onChange={(e) => onSortChange(e.target.value, direction ?? 'asc')}
                      className="flex-1 h-9 rounded-xl border border-input bg-white px-3 text-sm outline-none focus:border-primary/30"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => onSortChange(sortBy ?? 'name', direction === 'asc' ? 'desc' : 'asc')}
                      className="h-9 w-9 rounded-xl border border-input bg-white flex items-center justify-center cursor-pointer"
                    >
                      {direction === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              )}

              {hasActive && (
                <button
                  onClick={() => {
                    onCategoryChange?.('');
                    onPeriodChange?.('');
                    onMinFeesChange?.(0);
                    onMaxFeesChange?.(2000);
                    onMaxDistanceChange?.(0);
                    onSortChange?.('name', 'asc');
                  }}
                  className="w-full text-xs text-primary font-semibold py-2 cursor-pointer bg-transparent border-none"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}