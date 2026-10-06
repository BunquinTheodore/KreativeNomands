'use client';

import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  label: string;
  copied: boolean;
  onCopy: () => void;
}

/** Icon button that swaps to a drawn tick (and a short "Copied" label) after copying. */
export default function CopyButton({ label, copied, onCopy }: CopyButtonProps) {
  return (
    <button
      type="button"
      className="kn-copy"
      data-copied={copied ? 'true' : 'false'}
      onClick={onCopy}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="kn-copy__tick h-4 w-4" strokeWidth={3} aria-hidden="true" />
          <span aria-hidden="true">Copied</span>
        </>
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
