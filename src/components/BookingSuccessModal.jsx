import { useEffect, useRef } from "react";

export default function BookingSuccessModal({ onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="booking-modal-backdrop" onMouseDown={handleBackdropClick}>
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        aria-describedby="booking-modal-description"
      >
        <span className="booking-modal__mark" aria-hidden="true" />
        <p className="eyebrow">Richiesta inviata</p>
        <h3 id="booking-modal-title">Grazie per aver inviato la tua richiesta.</h3>
        <p id="booking-modal-description">
          Ti contatteremo al più presto per confermare la prenotazione o, se necessario, proporre
          una modifica in base alla disponibilità.
        </p>
        <p className="booking-modal__signature">Tre Sponde</p>
        <button
          className="button button--primary booking-modal__close"
          type="button"
          onClick={onClose}
          ref={closeButtonRef}
        >
          Chiudi
        </button>
      </section>
    </div>
  );
}
