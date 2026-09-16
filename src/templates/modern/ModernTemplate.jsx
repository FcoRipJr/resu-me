import { formatPeriod } from "../../utils/date";

const ModernTemplate = ({ resume }) => {
  const candidate = resume?.candidate || {};
  const contact = candidate.contact || {};
  const others = Array.isArray(contact.others)
    ? contact.others.filter(Boolean)
    : typeof contact.others === "string" && contact.others.trim()
      ? [contact.others.trim()]
      : [];

  return (
    <article className="resume-template modern-template">
      <aside className="sidebar">
        <h1>{candidate.name || "Candidate name"}</h1>
        <p className="role">{candidate.title || "Desired role"}</p>

        <div className="sidebar-block">
          <h3>Contact</h3>
          <ul>
            {contact.email && <li>{contact.email}</li>}
            {contact.phone && <li>{contact.phone}</li>}
            {contact.location && <li>{contact.location}</li>}
            {contact.linkedin && <li>{contact.linkedin}</li>}
            {contact.github && <li>GitHub: {contact.github}</li>}
            {contact.portfolio && <li>Portfolio: {contact.portfolio}</li>}
            {others.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        {resume.skills?.length > 0 && (
          <div className="sidebar-block">
            <h3>Skills</h3>
            <ul>
              {resume.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <section className="main-column">
        {resume.summary && (
          <div className="resume-block">
            <h2>Summary</h2>
            <p>{resume.summary}</p>
          </div>
        )}

        {resume.experiences?.length > 0 && (
          <div className="resume-block">
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
                    )}
                  </p>
                ) : null}
                <p>{experience.description}</p>
              </div>
            ))}
          </div>
        )}

        {resume.education?.length > 0 && (
          <div className="resume-block">
            <h2>Education</h2>
            {resume.education.map((item, index) => (
              <div key={`${item.institution}-${index}`}>
                <strong>{item.degree}</strong>
                <p>{item.institution}</p>
                {(item.start || item.end) && (
                  <p className="experience-period">
                    {formatPeriod(item.start, item.end, item.current)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
};

export default ModernTemplate;
