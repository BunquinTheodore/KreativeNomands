'use client'

import { useEffect, useMemo, useRef, type KeyboardEvent } from 'react'
import { createOrbitFactory, type OrbitItem, type OrbitState } from './orbitScene'
import { useThreeStage } from './ThreeCanvas'

export interface OrbitSelector3DProps {
  items: { id: string; label: string }[]
  activeId: string
  onSelect: (id: string) => void
  className?: string
  /** Accessible name of the radiogroup. Defaults to "Choose an option". */
  label?: string
}

const STAGE_OPTIONS = {
  start: 'visible',
  // Reached by scrolling, i.e. the visitor is already interacting: no extra delay.
  minStartMs: 0,
  maxFps: { high: 60, mid: 45 },
  camera: { fov: 38, near: 0.1, far: 60, position: [0, 0.8, 6.2] },
} as const

const DEFAULT_HEIGHT_CLASS = 'h-[320px] sm:h-[380px]'
const HAS_HEIGHT_CLASS = /(^|\s)(?:[a-z0-9-]+:)*(?:min-|max-)?h-/

const PILL_BASE =
  'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400'
const PILL_ACTIVE = 'border-accent-400/60 bg-accent-500/15 text-accent-300'
const PILL_IDLE = 'border-cream-500/15 bg-cream-500/5 text-cream-500/80 hover:bg-cream-500/10'

interface OptionListProps {
  items: readonly OrbitItem[]
  activeId: string
  onSelect: (id: string) => void
  label: string
  /** 'pills' = visible fallback; 'hidden' = visually hidden radiogroup for AT / keyboard. */
  variant: 'pills' | 'hidden'
}

/** Radiogroup of buttons with roving tabindex and arrow-key selection. */
function OptionList({ items, activeId, onSelect, label, variant }: OptionListProps) {
  const groupRef = useRef<HTMLDivElement>(null)
  const hasActive = items.some((item) => item.id === activeId)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if ((!forward && !backward) || items.length === 0) return
    event.preventDefault()
    const current = items.findIndex((item) => item.id === activeId)
    const next = (Math.max(0, current) + (forward ? 1 : -1) + items.length) % items.length
    onSelect(items[next].id)
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('button')
    buttons?.[next]?.focus()
  }

  const hidden = variant === 'hidden'
  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={hidden ? 'sr-only' : 'relative z-10 flex flex-wrap items-center justify-center gap-2'}
    >
      {items.map((item, index) => {
        const active = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active || (!hasActive && index === 0) ? 0 : -1}
            onClick={() => onSelect(item.id)}
            className={hidden ? undefined : `${PILL_BASE} ${active ? PILL_ACTIVE : PILL_IDLE}`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Items as glowing orbs on a tilted orbit ring; the active one rotates to the front.
 * Falls back to a plain pill list on low-end / reduced-motion / Save-Data / no WebGL,
 * and while the 3D scene is still loading.
 */
export default function OrbitSelector3D({
  items,
  activeId,
  onSelect,
  className,
  label = 'Choose an option',
}: OrbitSelector3DProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<OrbitState>({ items, activeId, onSelect })

  useEffect(() => {
    stateRef.current = { items, activeId, onSelect }
  })

  const factory = useMemo(() => createOrbitFactory(stateRef, tooltipRef), [])
  const status = useThreeStage(stageRef, factory, STAGE_OPTIONS)

  const ready = status === 'ready'
  const fallback = status === 'unavailable'
  const userClass = className ?? ''
  const sizing = fallback ? '' : HAS_HEIGHT_CLASS.test(userClass) ? '' : DEFAULT_HEIGHT_CLASS

  return (
    <div
      className={`relative w-full rounded-3xl ${sizing} ${userClass} ${
        ready ? 'focus-within:ring-2 focus-within:ring-accent-400/60' : ''
      }`}
    >
      <div ref={stageRef} className="absolute inset-0" />
      <div
        ref={tooltipRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap rounded-full border border-cream-500/20 bg-primary-950/80 px-3 py-1 text-xs font-medium text-cream-500 opacity-0 transition-opacity duration-200"
      />
      {ready ? (
        <OptionList items={items} activeId={activeId} onSelect={onSelect} label={label} variant="hidden" />
      ) : (
        <div className={fallback ? '' : 'absolute inset-0 z-10 flex items-center justify-center p-2'}>
          <OptionList items={items} activeId={activeId} onSelect={onSelect} label={label} variant="pills" />
        </div>
      )}
    </div>
  )
}
