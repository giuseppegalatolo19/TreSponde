function BotanicalMark() {
  return (
    <svg
      className="botanical-mark"
      viewBox="0 0 180 230"
      focusable="false"
    >
      <path d="M35 210C52 151 82 102 143 33" />
      <path d="M62 157C35 151 20 134 18 110C44 109 61 126 62 157Z" />
      <path d="M88 116C111 112 130 94 135 70C108 71 91 88 88 116Z" />
      <path d="M111 77C92 64 84 44 88 22C111 30 121 49 111 77Z" />
      <ellipse cx="57" cy="180" rx="25" ry="34" transform="rotate(29 57 180)" />
      <path d="M50 153C51 142 58 135 69 132" />
    </svg>
  );
}

export default function Hero() {
  return (
    <div className="hero-shell" id="top">
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>

      <div className="hero-frame" aria-hidden="true">
        <span className="hero-frame__corner hero-frame__corner--tl" />
        <span className="hero-frame__corner hero-frame__corner--tr" />
        <span className="hero-frame__corner hero-frame__corner--bl" />
        <span className="hero-frame__corner hero-frame__corner--br" />
      </div>

      <header className="site-header" aria-label="Navigazione principale">
        <a className="site-brand" href="#top" aria-label="Tre Sponde, torna all'inizio">
          Tre Sponde
        </a>
        <nav className="site-nav" aria-label="Sezioni della pagina">
          <a href="#concept">Concept</a>
          <a href="#menu">Menu</a>
          <a href="#contatti">Contatti</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content reveal">
          <p className="eyebrow">Palermo · Cene private</p>
          <p className="hero__kicker">Pop Up Experience</p>
          <h1 id="hero-title">
            <span>Tre</span>
            <span>Sponde</span>
          </h1>
          <p className="hero__summary">
            Tre sponde, un solo brodo: Giappone, Corea e Sicilia si incontrano in un percorso
            intimo e contemporaneo.
          </p>
          <div className="hero__actions" aria-label="Azioni principali">
            <a className="button button--primary" href="#contatti">
              Richiedi disponibilità
            </a>
            <a className="button button--text" href="#menu">
              Scopri il menu
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <span className="hero__sun" />
          <span className="hero__number">三</span>
          <span className="hero__places">Giappone · Corea · Sicilia</span>
          <BotanicalMark />
        </div>
      </section>
    </div>
  );
}
