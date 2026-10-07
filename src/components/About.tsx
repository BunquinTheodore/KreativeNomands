import AboutIsland from './about/AboutIsland';
import './about/about.css';

/**
 * About (#about). The section's markup is server-rendered inside AboutIsland; its JavaScript loads after
 * the first paint. The CSS is imported here (not in the island) so it stays part of the page stylesheet.
 */
export default function About() {
  return <AboutIsland />;
}
