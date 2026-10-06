'use client';

import type { ChangeEvent, FocusEvent, HTMLInputTypeAttribute } from 'react';
import { cn } from '@/lib/utils';

interface FloatingFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  type?: HTMLInputTypeAttribute;
  multiline?: boolean;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
  /** Shows a live "n / max" counter (multiline fields). */
  showCount?: boolean;
  rows?: number;
  className?: string;
}

const NEAR_LIMIT_RATIO = 0.9;

/**
 * Glass input with a floating label, an animated focus line, an inline error
 * wired through aria-describedby and an optional character counter.
 */
export default function FloatingField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  multiline = false,
  required = false,
  maxLength,
  autoComplete,
  inputMode,
  showCount = false,
  rows = 5,
  className,
}: FloatingFieldProps) {
  const errorId = `${id}-error`;
  const countId = `${id}-count`;
  const describedBy = [error ? errorId : null, showCount ? countId : null].filter(Boolean).join(' ');
  const nearLimit = maxLength !== undefined && value.length >= maxLength * NEAR_LIMIT_RATIO;

  const shared = {
    id,
    name,
    value,
    placeholder: ' ',
    required: false,
    maxLength,
    autoComplete,
    className: 'kn-field__control',
    'aria-invalid': error ? true : undefined,
    'aria-required': required || undefined,
    'aria-describedby': describedBy || undefined,
    onBlur: (_event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => onBlur(),
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange(event.target.value);

  return (
    <div className={className}>
      <div className="kn-field" data-invalid={error ? 'true' : 'false'}>
        {multiline ? (
          <textarea {...shared} rows={rows} onChange={handleChange} />
        ) : (
          <input {...shared} type={type} inputMode={inputMode} onChange={handleChange} />
        )}
        <label className="kn-field__label" htmlFor={id}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        <span className="kn-field__line" aria-hidden="true" />
      </div>
      <div className="kn-field__meta">
        {error ? (
          <p id={errorId} className="kn-field__error">
            {error}
          </p>
        ) : null}
        {showCount && maxLength !== undefined ? (
          <p
            id={countId}
            className={cn('kn-field__count')}
            data-near={nearLimit ? 'true' : 'false'}
          >
            <span className="sr-only">Characters used: </span>
            {value.length} / {maxLength}
          </p>
        ) : null}
      </div>
    </div>
  );
}
