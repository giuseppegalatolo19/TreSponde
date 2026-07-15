import SectionDivider from "./SectionDivider";

const highlights = [
  "Pop-up privato a Palermo",
  "Esperienza chef a domicilio",
  "Menu degustazione su prenotazione",
];

export default function ConceptSection() {
  return (
    <section className="concept-section" id="concept" aria-labelledby="concept-title">
      <div className="section__inner">
        <div className="concept-grid">
          <div className="section-heading reveal reveal--delay-1">
            <p className="eyebrow">Il concept</p>
            <h2 id="concept-title">Un pop-up privato, un'esperienza su misura</h2>
          </div>

          <div className="concept-copy reveal reveal--delay-2">
            <p>
              Tre Sponde: un’esperienza privata tra Giappone, Corea e Sicilia, dove tecnica,
              intensità e memoria mediterranea si incontrano in quattro portate.
            </p>
          </div>
        </div>

        <div className="concept-points" aria-label="Caratteristiche dell'esperienza">
          {highlights.map((highlight, index) => (
            <article className="concept-point" key={highlight}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{highlight}</h3>
            </article>
          ))}
        </div>

        <SectionDivider />
      </div>
    </section>
  );
}

