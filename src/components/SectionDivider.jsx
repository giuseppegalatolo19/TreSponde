export default function SectionDivider({ light = false }) {
  return (
    <div className={`section-divider${light ? " section-divider--light" : ""}`} aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  );
}

