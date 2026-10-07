import { AlertCircle, MailOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { ContactPhase } from './useContactForm';

interface FormFeedbackProps {
  phase: ContactPhase;
  message: string;
  mailtoHref: string;
  /** The email draft had to cut the message to fit the mailto length limit. */
  mailtoTruncated?: boolean;
}

/**
 * Always-mounted live regions so assistive tech announces changes:
 * polite status for progress / fallback, assertive alert for errors.
 */
export default function FormFeedback({ phase, message, mailtoHref, mailtoTruncated = false }: FormFeedbackProps) {
  return (
    <div className="mt-2 space-y-3">
      <div role="status" aria-live="polite" aria-atomic="true">
        {phase === 'sending' && <p className="sr-only">Sending your message.</p>}
        {phase === 'fallback' && (
          <div className="rounded-2xl border border-secondary-500/30 bg-secondary-500/10 p-4">
            <p className="text-sm leading-relaxed text-cream-500">
              Online sending isn&apos;t available right now, but your message is safe in the form.
              Open a ready-made email instead and just press send.
            </p>
            {mailtoTruncated && (
              <p className="mt-2 text-sm leading-relaxed text-cream-500">
                Message shortened for the email draft &mdash; please paste the rest.
              </p>
            )}
            <div className="mt-3">
              <Button
                variant="glass"
                href={mailtoHref}
                icon={<MailOpen className="h-4 w-4" aria-hidden="true" />}
              >
                Open email draft
              </Button>
            </div>
          </div>
        )}
      </div>
      <div role="alert" aria-atomic="true">
        {phase === 'error' && message && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-300/30 bg-red-400/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-red-200">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
