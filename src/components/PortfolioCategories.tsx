import PortfolioIsland from './portfolio/PortfolioIsland';
import { CATEGORIES } from './portfolio/categories';
import { getCategoryStats, getStripThumbs } from './portfolio/data';
import './portfolio/portfolio.css';

const THUMBS_PER_CARD = 6;

/**
 * Home "Work" section. The portfolio data is read here, on the server, and only the few numbers and
 * thumbnail URLs each card needs are handed to the island. The section's markup is server-rendered inside
 * PortfolioIsland; its JavaScript loads after the first paint. The CSS is imported here (not in the island)
 * so it stays part of the page stylesheet.
 */
export default function PortfolioCategories() {
  const cards = CATEGORIES.map((category) => ({
    id: category.id,
    stats: getCategoryStats(category.id),
    thumbs: getStripThumbs(category.id, THUMBS_PER_CARD),
  }));
  return <PortfolioIsland cards={cards} />;
}
