import { formatPeriod } from "../../utils/date";

const AtsTemplate = ({ resume, dateFormat = "month-year", sectionOrder, hiddenSections = [], customSections = [], visualSettings = {} }) => {
  const candidate = resume?.candidate || {};
  const contact = candidate.contact || {};
  const others = Array.isArray(contact.others)
    ? contact.others.filter(Boolean)
    : typeof contact.others === "string" && contact.others.trim()
      ? [contact.others.trim()]
      : [];
  sectionOrder = sectionOrder || ["objective", "summary", "skills", "experience", "education"];
  const sectionStyle = (id) => ({ order: sectionOrder.indexOf(id) + 1 });
  const isVisible = (id) => !hiddenSections.includes(id);

  return (
    <article
      className="resume-template ats-template"
      style={{
        "--resume-font-scale": visualSettings.fontScale || 1,
        "--resume-spacing-scale": visualSettings.spacing || 1,
        "--resume-margin-scale": visualSettings.margin || 1,
      }}
    >
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

      {resume.objective && isVisible("objective") && (
        <section className="resume-block resume-section" style={sectionStyle("objective")}>
          <h2>Objective</h2>
          <p>{resume.objective}</p>
        </section>
      )}

      {resume.summary && isVisible("summary") && (
        <section className="resume-block resume-section" style={sectionStyle("summary")}>
          <h2>Summary</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.skills?.length > 0 && isVisible("skills") && (
        <section className="resume-block resume-section" style={sectionStyle("skills")}>
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

      {resume.experiences?.length > 0 && isVisible("experience") && (
        <section className="resume-block resume-section" style={sectionStyle("experience")}>
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

      {resume.education?.length > 0 && isVisible("education") && (
        <section className="resume-block resume-section" style={sectionStyle("education")}>
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

      {resume.projects?.length > 0 && isVisible("projects") && (
        <section className="resume-block resume-section" style={sectionStyle("projects")}>
          <h2>Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={`${project.name}-${index}`}><strong>{project.name}</strong><p>{project.description}</p></div>
          ))}
        </section>
      )}

      {customSections.map((section) => !hiddenSections.includes(section.id) && (
        <section className="resume-block resume-section" style={sectionStyle(section.id)} key={section.id}>
          <h2>{section.title}</h2><p>{section.content}</p>
        </section>
      ))}
    </article>
  );
};

export default AtsTemplate;
