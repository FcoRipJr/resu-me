import { formatPeriod } from "../../utils/date";

const defaultOrder = [
  "objective",
  "summary",
  "skills",
  "experience",
  "education",
  "projects",
];

const AdditionalTemplate = ({
  resume,
  variant,
  dateFormat = "month-year",
  sectionOrder = defaultOrder,
  hiddenSections = [],
  customSections = [],
  visualSettings = {},
}) => {
  const candidate = resume?.candidate || {};
  const contact = candidate.contact || {};
  const others = Array.isArray(contact.others)
    ? contact.others.filter(Boolean)
    : typeof contact.others === "string" && contact.others.trim()
      ? [contact.others.trim()]
      : [];
  const isVisible = (id) => !hiddenSections.includes(id);
  const sectionStyle = (id) => ({ order: sectionOrder.indexOf(id) + 1 });
  const periodOptions = { locale: resume.language || "en", format: dateFormat };

  const renderSection = (sectionId) => {
    if (!isVisible(sectionId)) return null;

    if (sectionId === "objective" && resume.objective) {
      return (
        <section
          className="resume-block resume-section"
          style={sectionStyle(sectionId)}
          key={sectionId}
        >
          <h2>Objective</h2>
          <p>{resume.objective}</p>
        </section>
      );
    }
    if (sectionId === "summary" && resume.summary) {
      return (
        <section
          className="resume-block resume-section"
          style={sectionStyle(sectionId)}
          key={sectionId}
        >
          <h2>Summary</h2>
          <p>{resume.summary}</p>
        </section>
      );
    }
    if (sectionId === "skills" && resume.skills?.length > 0) {
      return (
        <section
          className="resume-block resume-section"
          style={sectionStyle(sectionId)}
          key={sectionId}
        >
          <h2>Skills</h2>
          <div className="chip-list">
            {resume.skills.map((skill) => (
              <span className="chip" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      );
    }
    if (sectionId === "experience" && resume.experiences?.length > 0) {
      return (
        <section
          className="resume-block resume-section"
          style={sectionStyle(sectionId)}
          key={sectionId}
        >
          <h2>Experience</h2>
          {resume.experiences.map((experience, index) => (
            <div
              className="experience-item"
              key={`${experience.company}-${index}`}
            >
              <strong>{experience.position}</strong>
              {experience.company && (
                <div className="experience-company">{experience.company}</div>
              )}
              {(experience.start || experience.end || experience.current) && (
                <p className="experience-period">
                  {formatPeriod(
                    experience.start,
                    experience.end,
                    experience.current,
                    periodOptions,
                  )}
                </p>
              )}
              <p>{experience.description}</p>
            </div>
          ))}
        </section>
      );
    }
    if (sectionId === "education" && resume.education?.length > 0) {
      return (
        <section
          className="resume-block resume-section"
          style={sectionStyle(sectionId)}
          key={sectionId}
        >
          <h2>Education</h2>
          {resume.education.map((item, index) => (
            <div key={`${item.institution}-${index}`}>
              <strong>{item.degree}</strong>
              <p>{item.institution}</p>
              {(item.start || item.end) && (
                <p className="experience-period">
                  {formatPeriod(
                    item.start,
                    item.end,
                    item.current,
                    periodOptions,
                  )}
                </p>
              )}
            </div>
          ))}
        </section>
      );
    }
    if (sectionId === "projects" && resume.projects?.length > 0) {
      return (
        <section
          className="resume-block resume-section"
          style={sectionStyle(sectionId)}
          key={sectionId}
        >
          <h2>Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={`${project.name}-${index}`}>
              <strong>{project.name}</strong>
              <p>{project.description}</p>
            </div>
          ))}
        </section>
      );
    }
    const customSection = customSections.find(
      (section) => section.id === sectionId,
    );
    if (customSection) {
      return (
        <section
          className="resume-block resume-section"
          style={sectionStyle(sectionId)}
          key={sectionId}
        >
          <h2>{customSection.title}</h2>
          <p>{customSection.content}</p>
        </section>
      );
    }
    return null;
  };

  return (
    <article
      className={`resume-template additional-template additional-${variant}`}
      style={{
        "--resume-font-scale": visualSettings.fontScale || 1,
        "--resume-spacing-scale": visualSettings.spacing || 1,
        "--resume-margin-scale": visualSettings.margin || 1,
      }}
    >
      <header className="additional-header">
        <div>
          <h1>{candidate.name || "Candidate name"}</h1>
          <p>{candidate.title || "Desired role"}</p>
        </div>
        <div className="additional-contact">
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
      <div className="additional-body">{sectionOrder.map(renderSection)}</div>
    </article>
  );
};

export default AdditionalTemplate;
