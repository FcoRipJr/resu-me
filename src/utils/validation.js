const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isDateValue = (value) => {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value === "string") return value.trim().length > 0;
  if (!isObject(value)) return false;

  const month = value.month;
  const year = value.year;
  return (
    (month === undefined ||
      (Number.isInteger(month) && month >= 1 && month <= 12)) &&
    (year === undefined ||
      (Number.isInteger(year) && year >= 1900 && year <= 2200)) &&
    (month !== undefined || year !== undefined)
  );
};

const validateContact = (contact, errors) => {
  if (contact === undefined) return;
  if (!isObject(contact)) {
    errors.push("candidate.contact must be an object.");
    return;
  }

  ["email", "phone", "location", "linkedin", "github", "portfolio"].forEach(
    (field) => {
      if (contact[field] !== undefined && typeof contact[field] !== "string") {
        errors.push(`candidate.contact.${field} must be a string.`);
      }
    },
  );

  if (
    contact.others !== undefined &&
    contact.others !== null &&
    typeof contact.others !== "string" &&
    !(
      Array.isArray(contact.others) &&
      contact.others.every((item) => typeof item === "string")
    )
  ) {
    errors.push(
      "candidate.contact.others must be null, a string, or an array of strings.",
    );
  }
};

const validateCandidate = (data) => {
  const errors = [];
  if (!isObject(data)) return ["Candidate JSON must be an object."];
  if (!isObject(data.candidate)) errors.push("candidate must be an object.");
  else {
    if (
      data.candidate.name !== undefined &&
      typeof data.candidate.name !== "string"
    ) {
      errors.push("candidate.name must be a string.");
    }
    if (
      data.candidate.title !== undefined &&
      typeof data.candidate.title !== "string"
    ) {
      errors.push("candidate.title must be a string.");
    }
    validateContact(data.candidate.contact, errors);
  }

  ["skills", "certifications", "languages", "projects"].forEach((field) => {
    if (data[field] !== undefined && !Array.isArray(data[field])) {
      errors.push(`${field} must be an array.`);
    }
  });

  ["experiences", "education"].forEach((field) => {
    if (data[field] !== undefined && !Array.isArray(data[field])) {
      errors.push(`${field} must be an array.`);
    }
  });

  (data.experiences || []).forEach((item, index) => {
    if (!isObject(item))
      errors.push(`experiences[${index}] must be an object.`);
    else {
      if (!isDateValue(item.start) || !isDateValue(item.end)) {
        errors.push(`experiences[${index}] has an invalid date.`);
      }
      if (item.current !== undefined && typeof item.current !== "boolean") {
        errors.push(`experiences[${index}].current must be boolean.`);
      }
    }
  });

  (data.education || []).forEach((item, index) => {
    if (!isObject(item)) errors.push(`education[${index}] must be an object.`);
    else {
      if (!isDateValue(item.start) || !isDateValue(item.end)) {
        errors.push(`education[${index}] has an invalid date.`);
      }
      if (item.current !== undefined && typeof item.current !== "boolean") {
        errors.push(`education[${index}].current must be boolean.`);
      }
    }
  });

  return errors;
};

export const validateCandidateJson = (data) => validateCandidate(data);

export const validateOptimizedResumeJson = (data) => {
  const errors = validateCandidate(data);
  if (!isObject(data)) return errors;
  if (typeof data.language !== "string" || !data.language.trim()) {
    errors.push("language must be a non-empty string.");
  }
  return errors;
};
