'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { emitSfx } from './emitSfx';
import { buildMailto } from './mailto';
import {
  EMPTY_CONTACT,
  trimValues,
  validateContact,
  type ContactApiResponse,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from './rules';

export type ContactPhase = 'idle' | 'sending' | 'success' | 'error' | 'fallback';

const REQUEST_TIMEOUT_MS = 15_000;
const FIELD_ORDER: readonly ContactField[] = ['name', 'email', 'company', 'message'];

type Touched = Readonly<Partial<Record<ContactField, boolean>>>;

interface RequestOutcome {
  phase: ContactPhase;
  message?: string;
  fieldErrors?: ContactErrors;
}

async function postContact(values: ContactValues, honeypot: string): Promise<RequestOutcome> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, website: honeypot }),
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => null)) as ContactApiResponse | null;

    if (response.ok && data?.ok) return { phase: 'success' };
    if (response.status === 503 && data?.code === 'not_configured') {
      return { phase: 'fallback', message: data.error };
    }
    if (response.status === 400 && data?.fields) {
      return { phase: 'error', message: data.error, fieldErrors: data.fields };
    }
    return {
      phase: 'error',
      message: data?.error ?? 'Something went wrong. Please try again.',
    };
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'AbortError';
    return {
      phase: 'error',
      message: timedOut
        ? 'The request took too long. Please check your connection and try again.'
        : 'We could not reach the server. Please check your connection and try again.',
    };
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Form state machine for the contact section: values, inline validation
 * (shown after blur or a submit attempt), submit lifecycle and mailto fallback.
 * The message is kept on every failure; only a real success clears it.
 */
export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY_CONTACT);
  const [honeypot, setHoneypot] = useState('');
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<ContactErrors>({});
  const [phase, setPhase] = useState<ContactPhase>('idle');
  const [message, setMessage] = useState('');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const trimmed = useMemo(() => trimValues(values), [values]);
  const rawErrors = useMemo(() => validateContact(trimmed), [trimmed]);
  const mailtoHref = useMemo(() => buildMailto(trimmed), [trimmed]);

  const errors = useMemo<ContactErrors>(() => {
    const visible: { -readonly [K in ContactField]?: string } = {};
    for (const field of FIELD_ORDER) {
      const shown = touched[field] || submitted;
      const text = serverErrors[field] ?? (shown ? rawErrors[field] : undefined);
      if (text) visible[field] = text;
    }
    return visible;
  }, [rawErrors, serverErrors, submitted, touched]);

  const setField = useCallback((field: ContactField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
    setPhase((prev) => (prev === 'error' ? 'idle' : prev));
  }, []);

  const blurField = useCallback((field: ContactField) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setMessage('');
  }, []);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (phase === 'sending') return;
      setSubmitted(true);

      const invalid = FIELD_ORDER.filter((field) => rawErrors[field]);
      if (invalid.length > 0) {
        setPhase('error');
        setMessage(
          invalid.length === 1
            ? 'Please fix the highlighted field and try again.'
            : `Please fix the ${invalid.length} highlighted fields and try again.`,
        );
        emitSfx('error');
        const form = event.currentTarget;
        window.requestAnimationFrame(() => {
          form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
        });
        return;
      }

      setPhase('sending');
      setMessage('');
      const outcome = await postContact(trimmed, honeypot);
      if (!mounted.current) return;

      if (outcome.fieldErrors) setServerErrors(outcome.fieldErrors);
      setMessage(outcome.message ?? '');
      setPhase(outcome.phase);

      if (outcome.phase === 'success') {
        setValues(EMPTY_CONTACT);
        setTouched({});
        setSubmitted(false);
        setServerErrors({});
        emitSfx('success');
      } else if (outcome.phase === 'error') {
        emitSfx('error');
      }
    },
    [honeypot, phase, rawErrors, trimmed],
  );

  return {
    values,
    errors,
    phase,
    message,
    mailtoHref,
    setField,
    blurField,
    setHoneypot,
    honeypot,
    submit,
    reset,
  };
}
