'use client';

import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import FloatingField from './FloatingField';
import FormFeedback from './FormFeedback';
import SuccessPanel from './SuccessPanel';
import { CONTACT_LIMITS } from './rules';
import { useContactForm } from './useContactForm';

/**
 * The working contact form: floating-label glass fields, inline validation,
 * honeypot, POST /api/contact with timeout and a mailto fallback (see
 * useContactForm). The card keeps a continuous shine like every glass surface.
 */
export default function ContactForm() {
  const form = useContactForm();
  const successRef = useRef<HTMLDivElement>(null);
  const sending = form.phase === 'sending';
  const done = form.phase === 'success';

  const wasDone = useRef(false);

  useEffect(() => {
    if (done) successRef.current?.focus();
    // Returning from the confirmation: the focused button is gone, so land on the first field.
    else if (wasDone.current) document.getElementById('contact-name')?.focus();
    wasDone.current = done;
  }, [done]);

  return (
    <div className="glass-strong shine relative rounded-3xl p-6 sm:p-8" data-sfx-hover="">
      {done ? (
        <SuccessPanel ref={successRef} onReset={form.reset} />
      ) : (
        <form onSubmit={form.submit} noValidate aria-label="Contact form" aria-busy={sending}>
          <div className="grid gap-x-5 sm:grid-cols-2">
            <FloatingField
              id="contact-name"
              name="name"
              label="Full Name"
              required
              autoComplete="name"
              maxLength={CONTACT_LIMITS.nameMax}
              value={form.values.name}
              error={form.errors.name}
              onChange={(v) => form.setField('name', v)}
              onBlur={() => form.blurField('name')}
            />
            <FloatingField
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              label="Email Address"
              required
              autoComplete="email"
              maxLength={CONTACT_LIMITS.emailMax}
              value={form.values.email}
              error={form.errors.email}
              onChange={(v) => form.setField('email', v)}
              onBlur={() => form.blurField('email')}
            />
          </div>
          <FloatingField
            id="contact-company"
            name="company"
            label="Company / Brand (optional)"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.companyMax}
            value={form.values.company}
            error={form.errors.company}
            onChange={(v) => form.setField('company', v)}
            onBlur={() => form.blurField('company')}
          />
          <FloatingField
            id="contact-message"
            name="message"
            label="Tell us about your project"
            multiline
            required
            showCount
            maxLength={CONTACT_LIMITS.messageMax}
            value={form.values.message}
            error={form.errors.message}
            onChange={(v) => form.setField('message', v)}
            onBlur={() => form.blurField('message')}
          />

          {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
          <div className="kn-hp" aria-hidden="true">
            <label htmlFor="contact-website">Website (leave this empty)</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(event) => form.setHoneypot(event.target.value)}
            />
          </div>

          <FormFeedback phase={form.phase} message={form.message} mailtoHref={form.mailtoHref} />

          <Button
            type="submit"
            magnetic
            disabled={sending}
            className="mt-4 w-full py-4 text-base"
            icon={
              sending ? (
                <span className="kn-spin" aria-hidden="true" />
              ) : (
                <Send className="h-5 w-5" aria-hidden="true" />
              )
            }
          >
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  );
}
