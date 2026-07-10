import { APPOINTMENT_FEATURES } from './data';

/**
 * Appointment — "The Salon Awaits You": private-audience pitch, feature
 * bullets, and the gold reservation CTA.
 */
export default function Appointment() {
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
        <a href="#appointment" className="lum-cta-gold" data-magnetic="">
          Reserve Your Appointment
        </a>
      </div>
    </section>
  );
}
