'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import GlassCard from '@/components/fx/GlassCard';
import Reveal from '@/components/fx/Reveal';
import SplitText from '@/components/fx/SplitText';
import CopyButton from './CopyButton';
import { CONTACT_INFO, type ContactInfoItem } from './data';
import { emitSfx } from './emitSfx';

const COPIED_RESET_MS = 2200;

/** Clipboard API with a textarea fallback for insecure contexts / older browsers. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }
}

function InfoValue({ item }: { item: ContactInfoItem }) {
  const className =
    'block break-words text-[0.95rem] font-medium leading-snug text-cream-500 underline-offset-4 transition-colors hover:text-secondary-300 hover:underline sm:text-base';
  return (
    <a
      href={item.href}
      className={className}
      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {item.id === 'email' ? <SplitText text={item.value} variant="scramble" by="chars" /> : item.value}
    </a>
  );
}

/** Email / phone / location as shining glass cards, each with a copy micro-interaction. */
export default function InfoCards() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = useCallback(async (item: ContactInfoItem) => {
    const ok = await copyToClipboard(item.copyValue);
    window.clearTimeout(timer.current);
    if (!ok) {
      emitSfx('error');
      setAnnouncement(`Could not copy the ${item.copyLabel}.`);
      return;
    }
    emitSfx('success');
    setCopiedId(item.id);
    setAnnouncement(`Copied the ${item.copyLabel} to the clipboard.`);
    timer.current = window.setTimeout(() => {
      setCopiedId(null);
      setAnnouncement('');
    }, COPIED_RESET_MS);
  }, []);

  return (
    <div>
      <ul className="space-y-5">
        {CONTACT_INFO.map((item, index) => (
          <li key={item.id}>
            <Reveal delay={index * 0.08}>
              <GlassCard tilt glow className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-secondary-500/30 bg-secondary-500/10 text-secondary-400">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-dim)]">
                    {item.label}
                  </p>
                  <div className="ml-auto">
                    <CopyButton
                      label={item.copyLabel}
                      copied={copiedId === item.id}
                      onCopy={() => void handleCopy(item)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <InfoValue item={item} />
                </div>
              </GlassCard>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
