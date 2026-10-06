import { NextResponse, type NextRequest } from 'next/server';
import {
  trimValues,
  validateContact,
  type ContactApiResponse,
  type ContactValues,
} from '@/components/contact/rules';

/*
 * POST /api/contact
 *
 * Validates a contact-form submission and relays it by email through the
 * Resend REST API. Configuration (all server-side env vars, see .env.example):
 *   RESEND_API_KEY      required, never sent to the browser
 *   CONTACT_TO_EMAIL    required, inbox that receives inquiries (comma separated allowed)
 *   CONTACT_FROM_EMAIL  optional, verified sender, e.g. "Kreativ Nomads <hello@kreativnomads.com.ph>"
 *
 * When RESEND_API_KEY / CONTACT_TO_EMAIL are missing the route answers 503
 * { ok: false, code: 'not_configured' } and never pretends to have sent anything;
 * the form then falls back to a prefilled mailto: link.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 10 * 1024;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_KEYS = 5000;
const SEND_TIMEOUT_MS = 10_000;
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Kreativ Nomads Website <onboarding@resend.dev>';
const SUBJECT_MAX = 120;

/*
 * Rate limiting is an in-memory sliding window per client IP.
 * Serverless caveat: each warm instance keeps its own Map and cold starts reset it,
 * so this only blunts casual abuse. For hard guarantees use a shared store
 * (Upstash Redis, Vercel KV, ...) or the platform's WAF / rate-limit rules.
 */
const hits = new Map<string, number[]>();

function respond(status: number, body: ContactApiResponse, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Records a hit; returns the seconds to wait when the key is over its limit, else 0. */
function consumeRateLimit(key: string, now: number): number {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    const oldest = recent[0] ?? now;
    return Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
  }
  hits.set(key, [...recent, now]);

  if (hits.size > RATE_LIMIT_MAX_KEYS) {
    hits.forEach((times, k) => {
      const last = times[times.length - 1] ?? 0;
      if (now - last >= RATE_LIMIT_WINDOW_MS) hits.delete(k);
    });
  }
  return 0;
}

/** Reads at most MAX_BODY_BYTES from the request; null when the limit is exceeded. */
async function readLimitedBody(request: NextRequest): Promise<string | null> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;
  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const decoder = new TextDecoder('utf-8', { fatal: false });
  return chunks.map((chunk) => decoder.decode(chunk, { stream: true })).join('') + decoder.decode();
}

// Strip C0/C1 control characters (keeping \n and \t for the message) and unicode line separators.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u2028\u2029]/g;

function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARS, '');
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

interface ParsedSubmission {
  values: ContactValues;
  honeypot: string;
}

function parseSubmission(raw: unknown): ParsedSubmission | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const name = clean(record.name);
  const email = clean(record.email);
  const company = record.company === undefined ? '' : clean(record.company);
  const message = clean(record.message);
  if (name === null || email === null || company === null || message === null) return null;

  const honeypot = typeof record.website === 'string' ? record.website.trim() : '';
  const values = trimValues({
    name: singleLine(name),
    email: email.trim(),
    company: singleLine(company),
    message,
  });
  return { values, honeypot };
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

function buildEmail(values: ContactValues) {
  const company = values.company || 'Not provided';
  const subject = `New website inquiry from ${values.name}`.slice(0, SUBJECT_MAX);
  const text = [
    'New inquiry from the Kreativ Nomads website',
    '',
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Company: ${company}`,
    '',
    values.message,
  ].join('\n');
  const html = [
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a">',
    '<h2 style="margin:0 0 12px;font-size:18px">New inquiry from the Kreativ Nomads website</h2>',
    `<p style="margin:0"><strong>Name:</strong> ${escapeHtml(values.name)}</p>`,
    `<p style="margin:0"><strong>Email:</strong> ${escapeHtml(values.email)}</p>`,
    `<p style="margin:0 0 12px"><strong>Company:</strong> ${escapeHtml(company)}</p>`,
    `<div style="white-space:pre-wrap;padding:12px 14px;background:#f5f0dc;border-radius:8px">${escapeHtml(values.message)}</div>`,
    '</div>',
  ].join('');
  return { subject, text, html };
}

function recipients(raw: string): string[] {
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function sendViaResend(
  apiKey: string,
  to: string[],
  values: ContactValues,
): Promise<'sent' | 'failed'> {
  const { subject, text, html } = buildEmail(values);
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
        to,
        reply_to: values.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!response.ok) {
      // Status only: never log the submission or the provider's echo of it.
      console.error(`[contact] email provider responded with HTTP ${response.status}`);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error(`[contact] email request failed (${error instanceof Error ? error.name : 'unknown'})`);
    return 'failed';
  }
}

export async function POST(request: NextRequest) {
  const retryAfter = consumeRateLimit(clientKey(request), Date.now());
  if (retryAfter > 0) {
    return respond(
      429,
      { ok: false, code: 'rate_limited', error: 'Too many messages. Please try again in a few minutes.' },
      { 'Retry-After': String(retryAfter) },
    );
  }

  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    return respond(415, { ok: false, code: 'unsupported_media_type', error: 'Send the form as JSON.' });
  }

  const body = await readLimitedBody(request);
  if (body === null) {
    return respond(413, { ok: false, code: 'too_large', error: 'That message is too large (10 KB maximum).' });
  }

  let parsed: ParsedSubmission | null;
  try {
    parsed = parseSubmission(JSON.parse(body));
  } catch {
    parsed = null;
  }
  if (!parsed) {
    return respond(400, { ok: false, code: 'invalid', error: 'We could not read that submission.' });
  }

  // Honeypot: real visitors never see this field. Look successful, send nothing.
  if (parsed.honeypot) return respond(200, { ok: true });

  const fields = validateContact(parsed.values);
  if (Object.keys(fields).length > 0) {
    return respond(400, { ok: false, code: 'invalid', error: 'Please check the highlighted fields.', fields });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = recipients(process.env.CONTACT_TO_EMAIL ?? '');
  if (!apiKey || to.length === 0) {
    return respond(503, {
      ok: false,
      code: 'not_configured',
      error: 'Online messages are not available right now. Please email us directly.',
    });
  }

  const result = await sendViaResend(apiKey, to, parsed.values);
  if (result === 'failed') {
    return respond(502, {
      ok: false,
      code: 'send_failed',
      error: 'We could not deliver your message. Please try again or email us directly.',
    });
  }
  return respond(200, { ok: true });
}
