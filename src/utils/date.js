const monthNames = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mai",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const normalizeDateValue = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    const month = value.month ?? value.start_month ?? value.end_month;
    const year = value.year ?? value.start_year ?? value.end_year;

    if (!year && !month) return "";
    const label = month ? monthNames[Number(month) - 1] || String(month) : "";
    return [label, year ? String(year) : ""].filter(Boolean).join(" ");
  }

  return String(value);
};

export const formatPeriod = (start, end, current = false) => {
  const startLabel = normalizeDateValue(start);
  const endLabel = current ? "Current" : normalizeDateValue(end);

  if (!startLabel && !endLabel) return "";
  if (!startLabel) return endLabel;
  if (!endLabel) return `${startLabel} — Current`;

  return `${startLabel} — ${endLabel}`;
};
