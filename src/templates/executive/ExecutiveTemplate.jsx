import { formatPeriod } from "../../utils/date";

const ExecutiveTemplate = ({ resume }) => {
  const candidate = resume?.candidate || {};
  const contact = candidate.contact || {};
  const others = Array.isArray(contact.others)
    ? contact.others.filter(Boolean)
    : typeof contact.others === "string" && contact.others.trim()
      ? [contact.others.trim()]
      : [];

  return (
    <article className="resume-template executive-template">
      <header className="executive-header">
        <div>
          <h1>{candidate.name || "Nome do candidato"}</h1>
          <p>{candidate.title || "Cargo desejado"}</p>
        </div>
        <div className="executive-contact">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>GitHub: {contact.github}</span>}
          {contact.portfolio && <span>Portfolio: {contact.portfolio}</span>}
          {others.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </header>

      {resume.summary && (
        <section className="resume-block">
          <h2>Perfil</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.skills?.length > 0 && (
        <section className="resume-block">
          <h2>Competências</h2>
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
          <h2>Experiência</h2>
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
                  )}
                </p>
              ) : null}
              <p>{experience.description}</p>
            </div>
          ))}
        </section>
      )}
    </article>
  );
};

export default ExecutiveTemplate;
