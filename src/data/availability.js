export const availabilityConfig = {
  minimumNoticeHours: 24,
  services: {
    lunch: {
      label: "Pranzo",
      time: "13:00",
    },
    dinner: {
      label: "Cena",
      time: "20:00",
    },
  },
};

export const unavailableSlots = [
  { date: "2026-08-10", service: "lunch" },
  { date: "2026-08-10", service: "dinner" },
];

const noticeMilliseconds = availabilityConfig.minimumNoticeHours * 60 * 60 * 1000;

export function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return [year, month, day].join("-");
}

export function getSlotDate(date, service) {
  const serviceConfig = availabilityConfig.services[service];

  if (!date || !serviceConfig) {
    return null;
  }

  return new Date(date + "T" + serviceConfig.time + ":00");
}

export function getMinimumBookableDate(now = new Date()) {
  const cutoff = new Date(now.getTime() + noticeMilliseconds);
  const candidate = new Date(cutoff);
  candidate.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < 14; offset += 1) {
    const dateValue = formatDateValue(candidate);
    const hasBookableService = Object.keys(availabilityConfig.services).some((service) => {
      const slotDate = getSlotDate(dateValue, service);
      const isUnavailable = unavailableSlots.some(
        (slot) => slot.date === dateValue && slot.service === service,
      );

      return slotDate >= cutoff && !isUnavailable;
    });

    if (hasBookableService) {
      return dateValue;
    }

    candidate.setDate(candidate.getDate() + 1);
  }

  return formatDateValue(candidate);
}

export function getAvailabilityStatus(date, service, now = new Date()) {
  if (!date || !availabilityConfig.services[service]) {
    return { available: null, message: "" };
  }

  const slotDate = getSlotDate(date, service);

  if (!slotDate || Number.isNaN(slotDate.getTime())) {
    return {
      available: false,
      message: "La data selezionata non è valida. Scegli un altro momento.",
    };
  }

  const cutoff = new Date(now.getTime() + noticeMilliseconds);

  if (slotDate < cutoff) {
    return {
      available: false,
      message:
        "Per questa fascia non sono disponibili le 24 ore di preavviso richieste. Scegli un altro momento.",
    };
  }

  const isUnavailable = unavailableSlots.some(
    (slot) => slot.date === date && slot.service === service,
  );

  if (isUnavailable) {
    return {
      available: false,
      message:
        "Questa data non è disponibile per la fascia selezionata. Scegli un altro momento.",
    };
  }

  return {
    available: true,
    message: "La fascia selezionata è disponibile per la richiesta.",
  };
}

