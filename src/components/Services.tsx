import ServicesIsland from './services/ServicesIsland';
import './services/services.css';

/**
 * Services (#services). The section's markup is server-rendered inside ServicesIsland; its JavaScript
 * loads after the first paint. The CSS is imported here (not in the island) so it stays part of the page
 * stylesheet.
 */
export default function Services() {
  return <ServicesIsland />;
}
