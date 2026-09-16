const monthNames = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  "pt-BR": [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  es: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
};

const fullMonthNames = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  "pt-BR": [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  es: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
};

const currentLabels = {
  en: "Current",
  "pt-BR": "Atual",
  es: "Actual",
};

const normalizeYear = (year) => {
  if (year === undefined || year === null || year === "") return "";
  const numericYear = Number(year);
  return numericYear >= 0 && numericYear <= 99
    ? String(2000 + numericYear).padStart(4, "0")
    : String(year);
};

const normalizeDateValue = (
  value,
  { locale = "en", format = "month-year" } = {},
) => {
  if (!value) return "";

  if (typeof value === "object") {
    const month = value.month ?? value.start_month ?? value.end_month;
    const year = value.year ?? value.start_year ?? value.end_year;

    if (!year && !month) return "";
    const normalizedYear = normalizeYear(year);
    if (format === "year" || !month) return normalizedYear;
    const names = format === "full" ? fullMonthNames : monthNames;
    const label = month
      ? names[locale]?.[Number(month) - 1] || names.en[Number(month) - 1]
      : "";
    return [label, normalizedYear].filter(Boolean).join(" ");
  }

  return String(value);
};

export const formatPeriod = (start, end, current = false, options = {}) => {
  const startLabel = normalizeDateValue(start, options);
  const currentLabel = currentLabels[options.locale] || currentLabels.en;
  const endLabel = current ? currentLabel : normalizeDateValue(end, options);

  if (!startLabel && !endLabel) return "";
  if (!startLabel) return endLabel;
  if (!endLabel) return `${startLabel} — ${currentLabel}`;

  return `${startLabel} — ${endLabel}`;
};
