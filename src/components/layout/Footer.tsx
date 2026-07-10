import { MOBILE_LINKS } from '@/components/brand/data';

/**
 * Footer — shimmering wordmark, cities line, copyright and quick links.
 */
export default function Footer() {
  return (
    <footer className="lum-footer">
      <div className="lum-footer-head" data-reveal="up">
        <div className="lum-footer-wordmark">LUMINA</div>
        <div className="lum-footer-tag">By private appointment — Paris · Genève · New York</div>
      </div>

      <div className="lum-footer-bar">
        <div className="lum-footer-copy">
          © {new Date().getFullYear()} Maison LUMINA — Haute Joaillerie
        </div>
        <div className="lum-footer-links">
          {MOBILE_LINKS.map(link => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
