export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__inner">
        <p className="footer__copyright">© 2026 TreSponde · Giuseppe Galatolo</p>
        <p>Palermo · Pop-up privato · Chef a domicilio</p>
        <nav aria-label="Contatti nel footer">
          <a href="mailto:trespondeinfo@gmail.com">trespondeinfo@gmail.com</a>
          <a href="https://wa.me/393317865305" target="_blank" rel="noreferrer">
            WhatsApp 3317865305
          </a>
        </nav>
      </div>
    </footer>
  );
}
