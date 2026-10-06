'use client';

import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import GlassCard from '@/components/fx/GlassCard';
import SplitText from '@/components/fx/SplitText';
import { sfx } from '@/lib/sfx';
import { cn } from '@/lib/utils';
import { DIRECTION_TABS, STATEMENTS, VALUES, type DirectionId } from './data';
import ValueCard from './ValueCard';

const tabId = (id: DirectionId) => `about-tab-${id}`;
const panelId = (id: DirectionId) => `about-panel-${id}`;

/**
 * Vision / Mission / Values. WAI-ARIA tabs (roving tabindex, arrows, Home/End)
 * on a sliding glass segmented control. Statements swap with a per-word blur
 * reveal; the Values tab holds the four expandable value cards.
 * Inactive panels stay in the DOM (hidden) so the copy is always crawlable.
 */
export default function DirectionTabs() {
  const [active, setActive] = useState<DirectionId>('vision');
  const [openValue, setOpenValue] = useState<string | null>(null);
  const tabRefs = useRef<Partial<Record<DirectionId, HTMLButtonElement | null>>>({});
  const activeIndex = DIRECTION_TABS.findIndex((tab) => tab.id === active);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = DIRECTION_TABS.length - 1;
    let next = activeIndex;
    if (event.key === 'ArrowRight') next = activeIndex === last ? 0 : activeIndex + 1;
    else if (event.key === 'ArrowLeft') next = activeIndex === 0 ? last : activeIndex - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;
    event.preventDefault();
    if (next === activeIndex) return;
    const target = DIRECTION_TABS[next].id;
    sfx.play(next > activeIndex ? 'next' : 'prev');
    setActive(target);
    tabRefs.current[target]?.focus();
  };

  const toggleValue = useCallback((id: string) => {
    setOpenValue((current) => (current === id ? null : id));
  }, []);

  const tabsStyle = { '--active': activeIndex } as CSSProperties;

  return (
    <GlassCard className="p-4 sm:p-7 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Vision, mission and values"
          onKeyDown={onKeyDown}
          style={tabsStyle}
          className="glass relative grid w-full max-w-md grid-cols-3 rounded-full p-1"
        >
          <span
            aria-hidden="true"
            className="about-tab-thumb absolute inset-y-1 left-1 rounded-full bg-gradient-to-b from-secondary-400 to-secondary-500 shadow-[0_8px_24px_-8px_rgba(245,158,11,0.7)]"
          />
          {DIRECTION_TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                type="button"
                role="tab"
                id={tabId(tab.id)}
                aria-selected={selected}
                aria-controls={panelId(tab.id)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={cn(
                  'relative z-10 rounded-full px-3 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 sm:px-5',
                  selected ? 'text-dark-950' : 'text-cream-500/80 hover:text-cream-500',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p
          aria-hidden="true"
          className="font-display text-sm tabular-nums tracking-[0.3em] text-cream-500/50"
        >
          {String(activeIndex + 1).padStart(2, '0')} / {String(DIRECTION_TABS.length).padStart(2, '0')}
        </p>
      </div>

      <div className="mt-8 sm:mt-10">
        {STATEMENTS.map((statement) => {
          const Icon = statement.icon;
          return (
            <div
              key={statement.id}
              role="tabpanel"
              id={panelId(statement.id)}
              aria-labelledby={tabId(statement.id)}
              hidden={active !== statement.id}
              tabIndex={0}
              className="about-panel grid items-center gap-6 rounded-xl md:grid-cols-[auto_1fr] md:gap-10"
            >
              <div className="relative hidden h-28 w-28 items-center justify-center md:flex lg:h-36 lg:w-36">
                <span
                  className="about-ring absolute inset-0 rounded-full border border-secondary-400/40"
                  aria-hidden="true"
                />
                <span className="absolute inset-3 rounded-full border border-cream-500/10" aria-hidden="true" />
                <Icon className="h-10 w-10 text-secondary-400 lg:h-12 lg:w-12" aria-hidden="true" />
              </div>
              <div>
                <p className="eyebrow">{statement.label}</p>
                <SplitText
                  as="p"
                  text={statement.text}
                  variant="blur"
                  by="words"
                  stagger={0.07}
                  once={false}
                  className="mt-4 block max-w-[40ch] font-display text-[1.4rem] font-medium leading-snug text-balance text-cream-500 sm:text-3xl lg:text-[2.1rem]"
                />
              </div>
            </div>
          );
        })}

        <div
          role="tabpanel"
          id={panelId('values')}
          aria-labelledby={tabId('values')}
          hidden={active !== 'values'}
          className="about-panel rounded-xl"
        >
          <h3 className="whitespace-nowrap font-display text-xl font-semibold text-cream-500 sm:text-2xl">
            What Sets Us <span className="text-secondary-400">Apart</span>
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <ValueCard
                key={value.id}
                value={value}
                open={openValue === value.id}
                onToggle={toggleValue}
              />
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
