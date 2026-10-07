import FooterIsland from './footer/FooterIsland';
import './footer/footer.css';

/**
 * Site footer. The markup is server-rendered inside FooterIsland; its JavaScript loads after the first
 * paint. The year is computed here, on the server, so the hydrated text can never differ from the HTML.
 */
export default function Footer() {
  return <FooterIsland year={new Date().getFullYear()} />;
}
