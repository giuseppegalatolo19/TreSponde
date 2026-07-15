import BookingForm from "./BookingForm";

export default function ContactSection() {
  return (
    <section className="contact-section" id="contatti" aria-labelledby="contact-title">
      <div className="section__inner contact-grid">
        <div className="contact-intro">
          <p className="eyebrow eyebrow--light">Prenotazioni</p>
          <h2 id="contact-title">Richiedi disponibilità</h2>
          <p>
            Tre Sponde è pensato per piccoli gruppi e richiede preparazione dedicata. Le richieste
            possono essere inviate per pranzo o cena, con almeno 24 ore di preavviso.
          </p>
          <div className="contact-actions">
            <a
              className="button button--outline-light"
              href="https://wa.me/393317865305"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a className="button button--outline-light" href="mailto:trespondeinfo@gmail.com">
              Email
            </a>
          </div>
        </div>

        <BookingForm />
      </div>
    </section>
  );
}
