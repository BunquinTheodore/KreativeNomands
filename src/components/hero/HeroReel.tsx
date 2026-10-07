import DrawLine from '@/components/fx/DrawLine';
import { getReelRows } from './heroData';
import ReelRows from './ReelRows';

/**
 * Work reel: two glass-framed thumbnail rails drifting in opposite directions.
 * Built from the portfolio data on the server (only the few fields each frame needs cross over);
 * each frame links to its category page.
 */
export default function HeroReel() {
  const { top, bottom } = getReelRows();
  return (
    <div className="hero-reel relative" role="region" aria-label="Selected work">
      <ReelRows top={top} bottom={bottom} />
      <div className="container-x mt-5">
        <DrawLine axis="x" />
      </div>
    </div>
  );
}
