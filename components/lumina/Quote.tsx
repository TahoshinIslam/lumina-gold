/**
 * Quote — the founding creed, with a giant ghost quotation mark behind it
 * and a breathing gold diamond above.
 */
export default function Quote() {
  return (
    <section className="lum-quote">
      <div className="lum-quote-ghost">&ldquo;</div>

      <div
        className="lum-breathe-diamond"
        data-reveal="up"
        style={{ width: 28, height: 28, animationDuration: '6s' }}
      />

      <blockquote className="lum-quote-text" data-reveal="tracking">
        Jewelry is not made to be seen.
        <br />
        It is made to be remembered.
      </blockquote>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }} data-reveal="up">
        <div className="lum-rule lum-rule--l" style={{ width: 40 }} />
        <div className="lum-quote-cite">The Founding Creed, 1985</div>
        <div className="lum-rule lum-rule--r" style={{ width: 40 }} />
      </div>
    </section>
  );
}
