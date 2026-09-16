import { formatPeriod } from "../../utils/date";

const AtsTemplate = ({ resume, dateFormat = "month-year" }) => {
  const candidate = resume?.candidate || {};
  const contact = candidate.contact || {};
  const others = Array.isArray(contact.others)
    ? contact.others.filter(Boolean)
    : typeof contact.others === "string" && contact.others.trim()
      ? [contact.others.trim()]
      : [];

  return (
    <article className="resume-template ats-template">
      <header className="resume-header">
        <h1>{candidate.name || "Candidate name"}</h1>
        <p>{candidate.title || "Desired role"}</p>
      </header>

      <section className="resume-block">
        <h2>Contact</h2>
        <ul>
          {contact.email && <li>Email: {contact.email}</li>}
          {contact.phone && <li>Phone: {contact.phone}</li>}
          {contact.location && <li>Location: {contact.location}</li>}
          {contact.linkedin && <li>LinkedIn: {contact.linkedin}</li>}
          {contact.github && <li>GitHub: {contact.github}</li>}
          {contact.portfolio && <li>Portfolio: {contact.portfolio}</li>}
          {others.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      {resume.objective && (
        <section className="resume-block">
          <h2>Objective</h2>
          <p>{resume.objective}</p>
        </section>
      )}

      {resume.summary && (
        <section className="resume-block">
          <h2>Summary</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.skills?.length > 0 && (
        <section className="resume-block">
          <h2>Skills</h2>
          <div className="chip-list">
            {resume.skills.map((skill) => (
              <span key={skill} className="chip">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.experiences?.length > 0 && (
        <section className="resume-block">
          <h2>Experience</h2>
          {resume.experiences.map((experience, index) => (
            <div
              key={`${experience.company}-${index}`}
              className="experience-item"
            >
              <div className="experience-header">
                <strong>{experience.position}</strong>
              </div>
              {experience.company && (
                <div className="experience-company">{experience.company}</div>
              )}
              {experience.start || experience.end || experience.current ? (
                <p className="experience-period">
                  {formatPeriod(
                    experience.start,
                    experience.end,
                    experience.current,
                    {
                      locale: resume.language || "en",
                      format: dateFormat,
                    },
                  )}
                </p>
              ) : null}
              {experience.description && <p>{experience.description}</p>}
            </div>
          ))}
        </section>
      )}

      {resume.education?.length > 0 && (
        <section className="resume-block">
          <h2>Education</h2>
          {resume.education.map((item, index) => (
            <div key={`${item.institution}-${index}`}>
              <strong>{item.degree}</strong>
              <p>{item.institution}</p>
              {(item.start || item.end) && (
                <p className="experience-period">
                  {formatPeriod(item.start, item.end, item.current, {
                    locale: resume.language || "en",
                    format: dateFormat,
                  })}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </article>
  );
};

export default AtsTemplate;
