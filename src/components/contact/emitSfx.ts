export type KnSfxName =
  | 'click'
  | 'hover'
  | 'whoosh'
  | 'open'
  | 'close'
  | 'success'
  | 'error'
  | 'next'
  | 'prev';

/** Fire-and-forget bridge to SfxProvider (listens for the `kn:sfx` event). */
export function emitSfx(name: KnSfxName): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('kn:sfx', { detail: name }));
}
