import { useMemo, useState } from "react";
import {
  availabilityConfig,
  getAvailabilityStatus,
  getMinimumBookableDate,
} from "../data/availability";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  date: "",
  service: "",
  guests: "",
  location: "",
  notes: "",
};

const successMessage =
  "Richiesta preparata. Ti risponderò per confermare disponibilità e dettagli.";

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date + "T12:00:00"));
}

function buildRequestText(payload) {
  const serviceLabel = availabilityConfig.services[payload.service].label;

  return [
    "Nuova richiesta Tre Sponde",
    "",
    "Nome e cognome: " + payload.fullName,
    "Email: " + payload.email,
    "Telefono: " + payload.phone,
    "Data desiderata: " + formatDisplayDate(payload.date),
    "Fascia oraria: " + serviceLabel,
    "Numero di ospiti: " + payload.guests,
    "Luogo dell'evento / città: " + payload.location,
    "Note, allergie o preferenze: " + (payload.notes || "Nessuna indicazione"),
  ].join("\n");
}

function buildFallbackLinks(payload) {
  const requestText = buildRequestText(payload);
  const serviceLabel = availabilityConfig.services[payload.service].label;
  const subject =
    "Richiesta disponibilità Tre Sponde - " + payload.date + " - " + serviceLabel;

  return {
    email:
      "mailto:trespondeinfo@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(requestText),
    whatsapp: "https://wa.me/393317865305?text=" + encodeURIComponent(requestText),
  };
}

export default function BookingForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [minimumDate] = useState(() => getMinimumBookableDate());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [fallbackLinks, setFallbackLinks] = useState(null);

  const slotStatus = useMemo(
    () => getAvailabilityStatus(formData.date, formData.service),
    [formData.date, formData.service],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setSubmission(null);
    setFallbackLinks(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setSubmission({
        type: "error",
        message: "Completa i campi obbligatori prima di inviare la richiesta.",
      });
      return;
    }

    const currentSlotStatus = getAvailabilityStatus(formData.date, formData.service);

    if (!currentSlotStatus.available) {
      setSubmission({ type: "error", message: currentSlotStatus.message });
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      service: formData.service,
      guests: Number(formData.guests),
      location: formData.location.trim(),
      notes: formData.notes.trim(),
      submittedAt: new Date().toISOString(),
      source: "tresponde-website",
    };
    const links = buildFallbackLinks(payload);
    const bookingEndpoint = import.meta.env.VITE_BOOKING_ENDPOINT?.trim();

    setFallbackLinks(null);

    if (!bookingEndpoint) {
      setSubmission({ type: "success", message: successMessage });
      setFallbackLinks(links);
      window.setTimeout(() => {
        window.location.href = links.email;
      }, 180);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(bookingEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Booking endpoint returned " + response.status);
      }

      setSubmission({ type: "success", message: successMessage });
      setFormData(initialFormData);
    } catch {
      setSubmission({
        type: "warning",
        message: successMessage,
        detail:
          "L'invio automatico non è disponibile. Completa la richiesta via email o WhatsApp.",
      });
      setFallbackLinks(links);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field form-field--full">
          <label htmlFor="booking-name">Nome e cognome</label>
          <input
            id="booking-name"
            name="fullName"
            type="text"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="booking-email">Email</label>
          <input
            id="booking-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="booking-phone">Numero di telefono</label>
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="booking-date">Data desiderata</label>
          <input
            id="booking-date"
            name="date"
            type="date"
            min={minimumDate}
            value={formData.date}
            onChange={handleChange}
            aria-describedby="booking-date-help booking-slot-status"
            aria-invalid={slotStatus.available === false}
            required
          />
          <small id="booking-date-help">Almeno 24 ore di preavviso.</small>
        </div>

        <div className="form-field">
          <label htmlFor="booking-guests">Numero di ospiti</label>
          <input
            id="booking-guests"
            name="guests"
            type="number"
            min="1"
            max="12"
            inputMode="numeric"
            value={formData.guests}
            onChange={handleChange}
            required
          />
        </div>

        <fieldset className="form-field form-field--full service-field">
          <legend>Fascia oraria</legend>
          <div className="service-options">
            {Object.entries(availabilityConfig.services).map(([value, service]) => (
              <label className="service-option" key={value}>
                <input
                  type="radio"
                  name="service"
                  value={value}
                  checked={formData.service === value}
                  onChange={handleChange}
                  required
                />
                <span>{service.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p
          className={
            "slot-status " +
            (slotStatus.available === false
              ? "slot-status--error"
              : slotStatus.available
                ? "slot-status--available"
                : "")
          }
          id="booking-slot-status"
          role={slotStatus.available === false ? "alert" : "status"}
          aria-live="polite"
        >
          {slotStatus.message}
        </p>

        <div className="form-field form-field--full">
          <label htmlFor="booking-location">Luogo dell'evento / città</label>
          <input
            id="booking-location"
            name="location"
            type="text"
            autoComplete="address-level2"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="booking-notes">Note, allergie o preferenze alimentari</label>
          <textarea
            id="booking-notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        className="button button--light booking-form__submit"
        type="submit"
        disabled={isSubmitting || slotStatus.available === false}
      >
        {isSubmitting ? "Invio in corso..." : "Invia richiesta"}
      </button>

      {submission && (
        <div
          className={"form-feedback form-feedback--" + submission.type}
          role={submission.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <p>{submission.message}</p>
          {submission.detail && <small>{submission.detail}</small>}
          {fallbackLinks && (
            <div className="fallback-actions">
              <a href={fallbackLinks.email}>Apri email precompilata</a>
              <a href={fallbackLinks.whatsapp} target="_blank" rel="noreferrer">
                Invia via WhatsApp
              </a>
            </div>
          )}
        </div>
      )}

      <p className="booking-form__microcopy">
        La richiesta non conferma automaticamente la prenotazione. Riceverai una risposta con
        disponibilità, dettagli e conferma finale.
      </p>
    </form>
  );
}

