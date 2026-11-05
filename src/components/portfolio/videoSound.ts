import { useSyncExternalStore } from 'react';

/**
 * Session-wide sound preference for stage videos. `muted` is what the viewer wants; `explicit` is true
 * once they used the mute toggle (a tap on play may unmute only while the choice is still implicit).
 * Kept in memory and mirrored to sessionStorage, so it survives slide and tab changes and reloads
 * within the session. Every storage access is guarded: private modes and blocked storage fall back to
 * memory only.
 */
export interface VideoSound {
  readonly muted: boolean;
  readonly explicit: boolean;
}

const STORAGE_KEY = 'kn:video-sound';
const SERVER_SNAPSHOT: VideoSound = Object.freeze({ muted: true, explicit: false });
const listeners = new Set<() => void>();

function readStored(): VideoSound {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return SERVER_SNAPSHOT;
    const parsed = JSON.parse(raw) as { m?: unknown; e?: unknown };
    return Object.freeze({ muted: parsed.m !== 0, explicit: parsed.e === 1 });
  } catch {
    return SERVER_SNAPSHOT;
  }
}

function writeStored(sound: VideoSound): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ m: sound.muted ? 1 : 0, e: sound.explicit ? 1 : 0 }));
  } catch {
    // Storage unavailable: the in-memory snapshot still holds the choice for this page.
  }
}

let snapshot: VideoSound = readStored();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = (): VideoSound => snapshot;
const getServerSnapshot = (): VideoSound => SERVER_SNAPSHOT;

/** Records the viewer's sound choice and notifies every subscribed slide / control. */
export function setVideoMuted(muted: boolean, explicit: boolean): void {
  if (snapshot.muted === muted && snapshot.explicit === explicit) return;
  snapshot = Object.freeze({ muted, explicit });
  writeStored(snapshot);
  listeners.forEach((listener) => listener());
}

export function useVideoSound(): VideoSound {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
