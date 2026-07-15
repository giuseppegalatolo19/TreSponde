export default function ContactSection() {
  return (
    <section className="contact-section" id="contatti" aria-labelledby="contact-title">
      <div className="section__inner contact-grid">
        <div>
          <p className="eyebrow eyebrow--light">Prenotazioni</p>
          <h2 id="contact-title">Richiedi disponibilità</h2>
        </div>

        <div className="contact-copy">
          <p>
            Per richieste, date disponibili o cene private, scrivi indicando numero di persone,
            data indicativa e luogo.
          </p>
          <div className="contact-actions">
            <a
              className="button button--light"
              href="https://wa.me/390000000000"
              target="_blank"
              rel="noreferrer"
            >
              Scrivi su WhatsApp
            </a>
            <a className="button button--outline-light" href="mailto:info@tresponde.it">
              Invia una email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

