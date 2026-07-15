export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__inner">
        <a className="footer__brand" href="#top">
          Tre Sponde
        </a>
        <p>Palermo · Pop-up privato · Chef a domicilio</p>
        <nav aria-label="Contatti nel footer">
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="mailto:info@tresponde.it">Email</a>
        </nav>
      </div>
    </footer>
  );
}

