import ContactIsland from './contact/ContactIsland';
import './contact/contact.css';

/**
 * Contact section (id="contact"). The section's markup is server-rendered inside ContactIsland; its
 * JavaScript loads after the first paint. The CSS is imported here (not in the island) so it stays part
 * of the page stylesheet.
 */
export default function Contact() {
  return <ContactIsland />;
}
