import { APPOINTMENT_FEATURES } from '@/components/brand/data';
import EnquiryForm from '@/features/appointments/components/EnquiryForm';
import type { Boutique } from '@/server/dal/boutiques';

/**
 * Appointment — "The Salon Awaits You": private-audience pitch, feature
 * bullets, and the reservation form.
 *
 * The CTA here was `<a href="#appointment">` — a link to the section it was
 * already inside. It did nothing, which meant every customer who tried to book a
 * private viewing got a page-jump and no appointment. It is a real form now
 * (@/features/appointments).
 *
 * `boutiques` arrives as a prop rather than being queried here: this renders
 * inside LuminaPage, which is a client component, so anything that touches the
 * database has to be fetched by the server page above it and threaded down —
 * the same way every other piece of homepage data already is.
 */
export default function Appointment({ boutiques }: { boutiques: Boutique[] }) {
  return (
    <section id="appointment" className="lum-appt">
      {/* Drifting glow blobs */}
      <div className="lum-drift-blob" style={{ top: '-12%', left: '-8%', width: 500, height: 500, animationDuration: '15s' }} />
      <div className="lum-drift-blob" style={{ bottom: '-16%', right: '-6%', width: 420, height: 420, animationDuration: '12s', animationDirection: 'reverse' }} />

      <div className="lum-appt-inner" data-reveal="stagger">
        <div className="lum-breathe-diamond" style={{ width: 26, height: 26, animationDuration: '5.5s' }} />
        <div className="lum-eyebrow-label">A Private Audience</div>
        <h2 className="lum-h2">The Salon Awaits You</h2>
        <p className="lum-body-text" style={{ maxWidth: 560 }}>
          A personal consultation with our diamond curators. Select stones by hand, commission
          a bespoke design, or simply experience the collection in complete privacy — with
          champagne, naturally.
        </p>
        <div className="lum-appt-features">
          {APPOINTMENT_FEATURES.map(feature => (
            <div key={feature} className="lum-appt-feature">
              <span className="lum-gem-dot" />
              {feature}
            </div>
          ))}
        </div>
        <EnquiryForm boutiques={boutiques} />
      </div>
    </section>
  );
}
