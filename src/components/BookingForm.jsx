import emailjs from "@emailjs/browser";
import { useCallback, useMemo, useState } from "react";
import {
  availabilityConfig,
  getAvailabilityStatus,
  getMinimumBookableDate,
} from "../data/availability";
import BookingSuccessModal from "./BookingSuccessModal";

const recipientEmail = "trespondeinfo@gmail.com";
const errorMessage =
  "Non è stato possibile inviare la richiesta. Riprova tra poco o contattaci via WhatsApp.";

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

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date + "T12:00:00"));
}

function buildEmailSubject(payload) {
  return (
    "Nuova richiesta Tre Sponde - " +
    payload.fullName +
    " - " +
    payload.date +
    " " +
    payload.serviceLabel
  );
}

function buildRequestBody(payload) {
  return [
    "Hai ricevuto una nuova richiesta per Tre Sponde.",
    "",
    "Nome:",
    payload.fullName,
    "",
    "Email:",
    payload.email,
    "",
    "Telefono:",
    payload.phone,
    "",
    "Data desiderata:",
    formatDisplayDate(payload.date),
    "",
    "Fascia:",
    payload.serviceLabel,
    "",
    "Numero ospiti:",
    String(payload.guests),
    "",
    "Luogo:",
    payload.location,
    "",
    "Note / allergie / preferenze:",
    payload.notes || "Nessuna indicazione",
  ].join("\n");
}

function buildTemplateParams(payload) {
  return {
    to_email: recipientEmail,
    subject: buildEmailSubject(payload),
    full_name: payload.fullName,
    from_name: payload.fullName,
    email: payload.email,
    user_email: payload.email,
    reply_to: payload.email,
    phone: payload.phone,
    desired_date: formatDisplayDate(payload.date),
    service: payload.serviceLabel,
    guests: String(payload.guests),
    location: payload.location,
    notes: payload.notes || "Nessuna indicazione",
    message: buildRequestBody(payload),
  };
}

function buildWhatsappLink(payload) {
  const message = [
    "Ciao, vorrei richiedere disponibilità per Tre Sponde.",
    "",
    "Nome: " + payload.fullName,
    "Email: " + payload.email,
    "Telefono: " + payload.phone,
    "Data desiderata: " + formatDisplayDate(payload.date),
    "Fascia: " + payload.serviceLabel,
    "Numero ospiti: " + payload.guests,
    "Luogo: " + payload.location,
    "Note / allergie / preferenze: " + (payload.notes || "Nessuna indicazione"),
  ].join("\n");

  return "https://wa.me/393317865305?text=" + encodeURIComponent(message);
}

async function sendToEndpoint(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      toEmail: recipientEmail,
      subject: buildEmailSubject(payload),
      message: buildRequestBody(payload),
    }),
  });

  if (!response.ok) {
    throw new Error("Booking endpoint returned " + response.status);
  }
}

async function sendBookingRequest(payload) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();
  const bookingEndpoint = import.meta.env.VITE_BOOKING_ENDPOINT?.trim();
  const hasEmailJsConfig = Boolean(serviceId && templateId && publicKey);

  if (hasEmailJsConfig) {
    try {
      await emailjs.send(serviceId, templateId, buildTemplateParams(payload), { publicKey });
      return;
    } catch (error) {
      if (!bookingEndpoint) {
        throw error;
      }
    }
  }

  if (bookingEndpoint) {
    await sendToEndpoint(bookingEndpoint, payload);
    return;
  }

  throw new Error("Email delivery is not configured");
}

export default function BookingForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [minimumDate] = useState(() => getMinimumBookableDate());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [whatsappFallback, setWhatsappFallback] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const slotStatus = useMemo(
    () => getAvailabilityStatus(formData.date, formData.service),
    [formData.date, formData.service],
  );

  const closeSuccessModal = useCallback(() => {
    setIsSuccessModalOpen(false);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setSubmission(null);
    setWhatsappFallback("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setSubmission({
        type: "error",
        message: "Completa correttamente i campi obbligatori prima di inviare la richiesta.",
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
      serviceLabel: availabilityConfig.services[formData.service].label,
      guests: Number(formData.guests),
      location: formData.location.trim(),
      notes: formData.notes.trim(),
      submittedAt: new Date().toISOString(),
      source: "tresponde-website",
    };

    setIsSubmitting(true);
    setSubmission(null);
    setWhatsappFallback("");

    try {
      await sendBookingRequest(payload);
      setFormData(initialFormData);
      setIsSuccessModalOpen(true);
    } catch {
      setSubmission({ type: "error", message: errorMessage });
      setWhatsappFallback(buildWhatsappLink(payload));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="booking-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
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
              inputMode="email"
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
          <div className="form-feedback form-feedback--error" role="alert" aria-live="polite">
            <p>{submission.message}</p>
            {whatsappFallback && (
              <a
                className="button form-feedback__whatsapp"
                href={whatsappFallback}
                target="_blank"
                rel="noreferrer"
              >
                Continua su WhatsApp
              </a>
            )}
          </div>
        )}

        <p className="booking-form__microcopy">
          La richiesta non conferma automaticamente la prenotazione. Riceverai una risposta con
          disponibilità, dettagli e conferma finale.
        </p>
      </form>

      {isSuccessModalOpen && <BookingSuccessModal onClose={closeSuccessModal} />}
    </>
  );
}
