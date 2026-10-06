'use client';

import { useId } from 'react';
import { Plus } from 'lucide-react';
import GlassCard from '@/components/fx/GlassCard';
import type { ValueItem } from './data';

interface ValueCardProps {
  value: ValueItem;
  open: boolean;
  onToggle: (id: string) => void;
}

/**
 * Expandable glass value card. The title is the real disclosure button; its
 * ::after stretches over the whole card so a click anywhere (or Enter/Space on
 * the focused title) toggles the detail. aria-expanded lives on the button.
 */
export default function ValueCard({ value, open, onToggle }: ValueCardProps) {
  const detailId = useId();
  const Icon = value.icon;

  return (
    <GlassCard tilt className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-secondary-400/25 bg-secondary-500/10 text-secondary-400">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <span
          aria-hidden="true"
          data-open={open}
          className="about-plus inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-cream-500/15 text-cream-500/70"
        >
          <Plus className="h-4 w-4" />
        </span>
      </div>
      <h4 className="mt-4 font-display text-lg font-semibold text-cream-500">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          data-sfx={open ? 'close' : 'open'}
          onClick={() => onToggle(value.id)}
          className="about-stretch text-left focus-visible:outline-none"
        >
          {value.title}
        </button>
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-cream-500/70">{value.description}</p>
      <div
        id={detailId}
        role="region"
        aria-label={`${value.title} in practice`}
        className="about-expand"
        data-open={open}
      >
        <div>
          <p className="mt-4 border-t border-cream-500/10 pt-4 text-sm leading-relaxed text-cream-500/90">
            {value.detail}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
