'use client';

import { useCallback, useEffect, useState } from 'react';
import GlassCard from '@/components/fx/GlassCard';
import OrbitSelector3D from '@/components/three/OrbitSelector3D';
import { scrollToId } from '@/lib/scroll';
import { SERVICES, type ServiceId } from './data';
import ServiceDetail from './ServiceDetail';

const ORBIT_ITEMS = SERVICES.map(({ id, label }) => ({ id, label }));
/** Length of the fade-out half of the crossfade, in ms. */
const SWAP_OUT_MS = 180;

/** Deep links look like `/#services-content-strategy` (the footer's Services column). */
const SERVICE_HASH_PREFIX = 'services-';
const SECTION_ID = 'services';

const isServiceId = (id: string): id is ServiceId => SERVICES.some((service) => service.id === id);

/** The service a location hash points at, or null when it is not a `#services-<id>` alias. */
function serviceFromHash(hash: string): ServiceId | null {
  const raw = hash.replace(/^#/, '');
  if (!raw.startsWith(SERVICE_HASH_PREFIX)) return null;
  const id = raw.slice(SERVICE_HASH_PREFIX.length);
  return isServiceId(id) ? id : null;
}

/**
 * Orbit selector (3D, loaded lazily near the viewport) + glass detail panel.
 * `activeId` is the selection (drives the orbit); `shownId` trails it by the
 * fade-out time so the panel crossfades instead of snapping.
 */
export default function ServicesExplorer() {
  const [activeId, setActiveId] = useState<ServiceId>(SERVICES[0].id);
  const [shownId, setShownId] = useState<ServiceId>(SERVICES[0].id);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (shownId === activeId) {
      // Selection returned to the shown service mid-fade (A -> B -> A): fade back in.
      setPhase('in');
      return undefined;
    }
    setPhase('out');
    const timer = window.setTimeout(() => {
      setShownId(activeId);
      setPhase('in');
    }, SWAP_OUT_MS);
    return () => window.clearTimeout(timer);
  }, [activeId, shownId]);

  // Deep links (#services-<id>): select that service on load and on every later hashchange,
  // then scroll to the section. The first apply skips the crossfade (nothing is on screen yet).
  useEffect(() => {
    const apply = (instant: boolean) => {
      const id = serviceFromHash(window.location.hash);
      if (!id) return;
      setActiveId(id);
      if (instant) setShownId(id);
      scrollToId(SECTION_ID);
    };
    apply(true);
    const onHashChange = () => apply(false);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const select = useCallback((id: string) => {
    if (isServiceId(id)) setActiveId(id);
  }, []);

  // Functional update: two quick Prev/Next presses compose instead of reading a stale activeId.
  const step = useCallback((delta: number) => {
    setActiveId((current) => {
      const index = SERVICES.findIndex((service) => service.id === current);
      return SERVICES[(index + delta + SERVICES.length) % SERVICES.length].id;
    });
  }, []);

  const stepPrev = useCallback(() => step(-1), [step]);
  const stepNext = useCallback(() => step(1), [step]);

  const activeIndex = SERVICES.findIndex((service) => service.id === activeId);
  const shownIndex = SERVICES.findIndex((service) => service.id === shownId);
  const active = SERVICES[activeIndex];

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
      <GlassCard className="relative min-w-0 overflow-hidden p-2 sm:p-3">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_52%,rgba(245,158,11,0.14),transparent_70%)]"
        />
        <OrbitSelector3D
          items={ORBIT_ITEMS}
          activeId={activeId}
          onSelect={select}
          label="Choose a service"
          className="h-[320px] sm:h-[420px] lg:h-[480px]"
        />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs font-medium uppercase tracking-[0.22em] text-cream-500/55"
        >
          Click an orb to explore
        </p>
      </GlassCard>

      <div className="min-w-0">
        <ServiceDetail
          service={SERVICES[shownIndex]}
          index={shownIndex}
          total={SERVICES.length}
          phase={phase}
          onPrev={stepPrev}
          onNext={stepNext}
        />
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {`Showing ${active.label}, ${activeIndex + 1} of ${SERVICES.length}`}
        </p>
      </div>
    </div>
  );
}
