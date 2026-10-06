'use client';

import { useCallback, useEffect, useState } from 'react';
import GlassCard from '@/components/fx/GlassCard';
import OrbitSelector3D from '@/components/three/OrbitSelector3D';
import { SERVICES, type ServiceId } from './data';
import ServiceDetail from './ServiceDetail';

const ORBIT_ITEMS = SERVICES.map(({ id, label }) => ({ id, label }));
/** Length of the fade-out half of the crossfade, in ms. */
const SWAP_OUT_MS = 180;

const isServiceId = (id: string): id is ServiceId => SERVICES.some((service) => service.id === id);

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

  const select = useCallback((id: string) => {
    if (isServiceId(id)) setActiveId(id);
  }, []);

  const step = useCallback(
    (delta: number) => {
      const current = SERVICES.findIndex((service) => service.id === activeId);
      setActiveId(SERVICES[(current + delta + SERVICES.length) % SERVICES.length].id);
    },
    [activeId],
  );

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
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {`Showing ${active.label}, ${activeIndex + 1} of ${SERVICES.length}`}
        </p>
      </div>
    </div>
  );
}
