import SectionDivider from "./SectionDivider";

const steps = [
  "Scegli data e numero di ospiti",
  "Definiamo eventuali allergie o preferenze",
  "Il percorso viene preparato e servito in forma privata",
];

export default function ExperienceSection() {
  return (
    <section className="experience-section" id="esperienza" aria-labelledby="experience-title">
      <div className="section__inner">
        <div className="experience-heading">
          <p className="eyebrow">L'esperienza</p>
          <h2 id="experience-title">Come funziona</h2>
        </div>

        <ol className="experience-steps">
          {steps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <p className="experience-note">
          Disponibilità limitata. Esperienza pensata per piccoli gruppi.
        </p>
        <SectionDivider />
      </div>
    </section>
  );
}

