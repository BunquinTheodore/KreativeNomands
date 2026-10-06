import { redirect } from 'next/navigation';

/** Render per request so Next answers with a real 3xx + Location header (a prerendered redirect has none). */
export const dynamic = 'force-dynamic';

/** /portfolio has no category of its own: send visitors to the Work section on the home page. */
export default function PortfolioIndexPage(): never {
  redirect('/#portfolio');
}
