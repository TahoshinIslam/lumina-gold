import Link from 'next/link';
import { MOBILE_LINKS } from '@/components/brand/data';
import { FOOTER_COLUMNS } from '@/config/navigation';

/**
 * Footer — shimmering wordmark, the maison columns (Our Heritage, Boutiques,
 * Client Services — the reference pages the nav bar no longer carries), cities
 * line, copyright and quick links.
 */
export default function Footer() {
  return (
    <footer className="lum-footer">
      <div className="lum-footer-head" data-reveal="up">
        <div className="lum-footer-wordmark">NAHAR JEWELLERS</div>
        <div className="lum-footer-tag">By private appointment — Paris · Genève · New York</div>
      </div>

      <nav className="lum-footer-cols" aria-label="Footer">
        {FOOTER_COLUMNS.map(column => (
          <div key={column.heading} className="lum-footer-col">
            <div className="lum-footer-col-head">{column.heading}</div>
            {column.links.map(link => (
              <Link key={link.label} href={link.href} className="lum-footer-col-link">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="lum-footer-bar">
        <div className="lum-footer-copy">
          © {new Date().getFullYear()} Nahar Jewellers — Haute Joaillerie
        </div>
        <div className="lum-footer-links">
          {MOBILE_LINKS.map(link => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
      </div>

      <div className="lum-footer-credit">
        Design and developed by <span>Leotech</span>
      </div>
    </footer>
  );
}
