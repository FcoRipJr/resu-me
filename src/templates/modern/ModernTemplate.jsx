import { formatPeriod } from "../../utils/date";

const ModernTemplate = ({ resume, dateFormat = "month-year", sectionOrder, hiddenSections = [], customSections = [], visualSettings = {} }) => {
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
      className="resume-template modern-template"
      style={{
        "--resume-font-scale": visualSettings.fontScale || 1,
        "--resume-spacing-scale": visualSettings.spacing || 1,
        "--resume-margin-scale": visualSettings.margin || 1,
      }}
    >
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

        {resume.skills?.length > 0 && isVisible("skills") && (
          <div className="sidebar-block resume-section" style={sectionStyle("skills")}>
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
        {resume.objective && isVisible("objective") && (
          <div className="resume-block resume-section" style={sectionStyle("objective")}>
            <h2>Objective</h2>
            <p>{resume.objective}</p>
          </div>
        )}

        {resume.summary && isVisible("summary") && (
          <div className="resume-block resume-section" style={sectionStyle("summary")}>
            <h2>Summary</h2>
            <p>{resume.summary}</p>
          </div>
        )}

        {resume.experiences?.length > 0 && isVisible("experience") && (
          <div className="resume-block resume-section" style={sectionStyle("experience")}>
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
                <p>{experience.description}</p>
              </div>
            ))}
          </div>
        )}

        {resume.education?.length > 0 && isVisible("education") && (
          <div className="resume-block resume-section" style={sectionStyle("education")}>
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
          </div>
        )}
        {resume.projects?.length > 0 && isVisible("projects") && (
          <div className="resume-block resume-section" style={sectionStyle("projects")}>
            <h2>Projects</h2>
            {resume.projects.map((project, index) => (
              <div key={`${project.name}-${index}`}><strong>{project.name}</strong><p>{project.description}</p></div>
            ))}
          </div>
        )}
        {customSections.map((section) => !hiddenSections.includes(section.id) && (
          <div className="resume-block resume-section" style={sectionStyle(section.id)} key={section.id}>
            <h2>{section.title}</h2><p>{section.content}</p>
          </div>
        ))}
      </section>
    </article>
  );
};

export default ModernTemplate;
