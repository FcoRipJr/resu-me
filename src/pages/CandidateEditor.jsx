import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, Eye, FileUp, Trash2 } from "lucide-react";
import { validateCandidateJson } from "../utils/validation";

const emptyCandidate = {
  candidate: {
    name: "",
    title: "",
    contact: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      others: [],
    },
  },
  objective: "",
  summary: "",
  skills: [],
  experiences: [],
  education: [],
  certifications: [],
  languages: [],
  projects: [],
};

const exampleCandidate = {
  candidate: {
    name: "Maria Souza",
    title: "Front-end Developer",
    contact: {
      email: "maria@email.com",
      phone: "+55 11 99999-9999",
      location: "Sao Paulo, Brazil",
      linkedin: "linkedin.com/in/maria-souza",
      github: "github.com/mariasouza",
      portfolio: "mariasouza.dev",
      others: ["Behance: behance.net/mariasouza"],
    },
  },
  objective:
    "Seeking web development opportunities focused on user experience.",
  summary: "Front-end developer with 4 years of experience.",
  skills: ["React", "JavaScript", "CSS", "Accessibility"],
  experiences: [
    {
      company: "Nova Tech",
      position: "Front-end Developer",
      start: { month: 1, year: 2022 },
      end: null,
      current: true,
      description: "Developing interfaces for digital products.",
      skills: ["React", "TypeScript"],
    },
  ],
  education: [
    {
      institution: "University of Sao Paulo",
      degree: "Bachelor of Information Systems",
      start: { month: 3, year: 2017 },
      end: { month: 12, year: 2021 },
      current: false,
    },
  ],
  certifications: ["AWS Cloud Practitioner"],
  languages: ["Portuguese", "English"],
  projects: [
    { name: "Customer Portal", description: "React self-service platform." },
  ],
};

const readJsonFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error("Invalid JSON file."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsText(file);
  });

const asList = (value) => (Array.isArray(value) ? value.join(", ") : "");
const fromList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const CommaListInput = ({ value, onChange, ...props }) => {
  const [draft, setDraft] = useState(asList(value));
  const lastCommittedValue = useRef(asList(value));

  useEffect(() => {
    const nextValue = asList(value);
    if (nextValue !== lastCommittedValue.current) {
      setDraft(nextValue);
      lastCommittedValue.current = nextValue;
    }
  }, [value]);

  return (
    <input
      {...props}
      value={draft}
      onChange={(event) => {
        setDraft(event.target.value);
        const nextValue = fromList(event.target.value);
        lastCommittedValue.current = asList(nextValue);
        onChange(nextValue);
      }}
      onBlur={() => setDraft(asList(fromList(draft)))}
    />
  );
};

const CandidateEditor = ({ t }) => {
  const [candidate, setCandidate] = useState(emptyCandidate);
  const [json, setJson] = useState(JSON.stringify(emptyCandidate, null, 2));
  const [error, setError] = useState("");

  const updateCandidate = (updater) => {
    setCandidate((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      setJson(JSON.stringify(next, null, 2));
      setError("");
      return next;
    });
  };

  const updateField = (path, value) => {
    updateCandidate((current) => {
      const next = structuredClone(current);
      let target = next;
      path.slice(0, -1).forEach((key) => {
        target = target[key];
      });
      target[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleJsonChange = (value) => {
    setJson(value);
    try {
      const parsed = JSON.parse(value);
      const validationErrors = validateCandidateJson(parsed);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(" "));
        return;
      }
      setCandidate(parsed);
      setError("");
    } catch {
      setError(t.candidateEditor.invalidJson);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readJsonFile(file);
      const validationErrors = validateCandidateJson(parsed);
      if (validationErrors.length > 0)
        throw new Error(validationErrors.join(" "));
      updateCandidate(parsed);
    } catch (uploadError) {
      setError(uploadError.message || t.candidateEditor.fileError);
    }
  };

  const clearAll = () => updateCandidate(structuredClone(emptyCandidate));
  const showExample = () => updateCandidate(structuredClone(exampleCandidate));

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setError(t.candidateEditor.copied);
    } catch {
      setError(t.candidateEditor.copyFailed);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "candidate.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const addExperience = () =>
    updateCandidate((current) => ({
      ...current,
      experiences: [
        ...current.experiences,
        {
          company: "",
          position: "",
          start: null,
          end: null,
          current: false,
          description: "",
          skills: [],
        },
      ],
    }));
  const addEducation = () =>
    updateCandidate((current) => ({
      ...current,
      education: [
        ...current.education,
        { institution: "", degree: "", start: null, end: null, current: false },
      ],
    }));
  const addProject = () =>
    updateCandidate((current) => ({
      ...current,
      projects: [...current.projects, { name: "", description: "" }],
    }));

  const removeItem = (field, index) =>
    updateCandidate((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  const updateItem = (field, index, key, value) =>
    updateCandidate((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  const updateItemDate = (field, index, dateKey, part, value) =>
    updateCandidate((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [dateKey]: (() => {
                const nextDate = { ...(item[dateKey] || {}) };
                if (value) nextDate[part] = Number(value);
                else delete nextDate[part];
                return nextDate.month || nextDate.year ? nextDate : null;
              })(),
            }
          : item,
      ),
    }));

  const jsonIsValid = useMemo(() => {
    try {
      return validateCandidateJson(JSON.parse(json)).length === 0;
    } catch {
      return false;
    }
  }, [json]);

  return (
    <section className="candidate-editor page-grid">
      <div className="panel candidate-form-panel">
        <h2>{t.candidateEditor.title}</h2>
        <div className="editor-toolbar">
          <button
            type="button"
            className="secondary icon-button"
            title={t.candidateEditor.example}
            aria-label={t.candidateEditor.example}
            onClick={showExample}
          >
            <Eye size={18} />
          </button>
          <label
            className="secondary icon-button file-button"
            title={t.candidateEditor.load}
            aria-label={t.candidateEditor.load}
          >
            <FileUp size={18} />
            <input
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
            />
          </label>
          <button
            type="button"
            className="secondary icon-button"
            title={t.candidateEditor.clear}
            aria-label={t.candidateEditor.clear}
            onClick={clearAll}
          >
            <Trash2 size={18} />
          </button>
        </div>

        <fieldset className="editor-fieldset">
          <legend>{t.candidateEditor.identity}</legend>
          <label>
            {t.candidateEditor.name}
            <input
              value={candidate.candidate.name}
              onChange={(event) =>
                updateField(["candidate", "name"], event.target.value)
              }
            />
          </label>
          <label>
            {t.candidateEditor.titleField}
            <input
              value={candidate.candidate.title}
              onChange={(event) =>
                updateField(["candidate", "title"], event.target.value)
              }
            />
          </label>
        </fieldset>

        <fieldset className="editor-fieldset">
          <legend>{t.candidateEditor.contact}</legend>
          {[
            ["email", "email"],
            ["phone", "phone"],
            ["location", "location"],
            ["linkedin", "linkedin"],
            ["github", "github"],
            ["portfolio", "portfolio"],
          ].map(([key, label]) => (
            <label key={key}>
              {t.candidateEditor[label]}
              <input
                value={candidate.candidate.contact[key]}
                onChange={(event) =>
                  updateField(["candidate", "contact", key], event.target.value)
                }
              />
            </label>
          ))}
          <label>
            {t.candidateEditor.others}
            <CommaListInput
              value={candidate.candidate.contact.others}
              onChange={(value) =>
                updateField(["candidate", "contact", "others"], value)
              }
            />
          </label>
        </fieldset>

        <label>
          {t.candidateEditor.objective}
          <textarea
            rows={3}
            value={candidate.objective}
            onChange={(event) => updateField(["objective"], event.target.value)}
          />
        </label>
        <label>
          {t.candidateEditor.summary}
          <textarea
            rows={4}
            value={candidate.summary}
            onChange={(event) => updateField(["summary"], event.target.value)}
          />
        </label>
        <label>
          {t.candidateEditor.skills}
          <CommaListInput
            value={candidate.skills}
            onChange={(value) => updateField(["skills"], value)}
          />
        </label>

        <fieldset className="editor-fieldset">
          <legend>{t.candidateEditor.experience}</legend>
          {candidate.experiences.map((item, index) => (
            <div className="repeatable-editor" key={`experience-${index}`}>
              <input
                placeholder={t.candidateEditor.company}
                value={item.company}
                onChange={(event) =>
                  updateItem(
                    "experiences",
                    index,
                    "company",
                    event.target.value,
                  )
                }
              />
              <input
                placeholder={t.candidateEditor.position}
                value={item.position || ""}
                onChange={(event) =>
                  updateItem(
                    "experiences",
                    index,
                    "position",
                    event.target.value,
                  )
                }
              />
              <div className="date-input-row">
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder={t.candidateEditor.month}
                  value={item.start?.month || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "experiences",
                      index,
                      "start",
                      "month",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="number"
                  min="0"
                  max="2200"
                  placeholder={t.candidateEditor.startYear}
                  value={item.start?.year || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "experiences",
                      index,
                      "start",
                      "year",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder={t.candidateEditor.month}
                  value={item.end?.month || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "experiences",
                      index,
                      "end",
                      "month",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="number"
                  min="0"
                  max="2200"
                  placeholder={t.candidateEditor.endYear}
                  value={item.end?.year || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "experiences",
                      index,
                      "end",
                      "year",
                      event.target.value,
                    )
                  }
                />
              </div>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(item.current)}
                  onChange={(event) =>
                    updateItem(
                      "experiences",
                      index,
                      "current",
                      event.target.checked,
                    )
                  }
                />
                {t.candidateEditor.current}
              </label>
              <textarea
                placeholder={t.candidateEditor.description}
                value={item.description}
                onChange={(event) =>
                  updateItem(
                    "experiences",
                    index,
                    "description",
                    event.target.value,
                  )
                }
                rows={3}
              />
              <CommaListInput
                placeholder={t.candidateEditor.experienceSkills}
                value={item.skills || []}
                onChange={(value) =>
                  updateItem("experiences", index, "skills", value)
                }
              />
              <button
                type="button"
                className="secondary"
                onClick={() => removeItem("experiences", index)}
              >
                {t.candidateEditor.remove}
              </button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={addExperience}>
            {t.candidateEditor.addExperience}
          </button>
        </fieldset>

        <fieldset className="editor-fieldset">
          <legend>{t.candidateEditor.education}</legend>
          {candidate.education.map((item, index) => (
            <div className="repeatable-editor" key={`education-${index}`}>
              <input
                placeholder={t.candidateEditor.institution}
                value={item.institution}
                onChange={(event) =>
                  updateItem(
                    "education",
                    index,
                    "institution",
                    event.target.value,
                  )
                }
              />
              <input
                placeholder={t.candidateEditor.degree}
                value={item.degree || ""}
                onChange={(event) =>
                  updateItem("education", index, "degree", event.target.value)
                }
              />
              <div className="date-input-row">
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder={t.candidateEditor.month}
                  value={item.start?.month || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "education",
                      index,
                      "start",
                      "month",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="number"
                  min="0"
                  max="2200"
                  placeholder={t.candidateEditor.startYear}
                  value={item.start?.year || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "education",
                      index,
                      "start",
                      "year",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder={t.candidateEditor.month}
                  value={item.end?.month || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "education",
                      index,
                      "end",
                      "month",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="number"
                  min="0"
                  max="2200"
                  placeholder={t.candidateEditor.endYear}
                  value={item.end?.year || ""}
                  onChange={(event) =>
                    updateItemDate(
                      "education",
                      index,
                      "end",
                      "year",
                      event.target.value,
                    )
                  }
                />
              </div>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(item.current)}
                  onChange={(event) =>
                    updateItem(
                      "education",
                      index,
                      "current",
                      event.target.checked,
                    )
                  }
                />
                {t.candidateEditor.current}
              </label>
              <button
                type="button"
                className="secondary"
                onClick={() => removeItem("education", index)}
              >
                {t.candidateEditor.remove}
              </button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={addEducation}>
            {t.candidateEditor.addEducation}
          </button>
        </fieldset>

        <label>
          {t.candidateEditor.certifications}
          <CommaListInput
            value={candidate.certifications}
            onChange={(value) => updateField(["certifications"], value)}
          />
        </label>
        <label>
          {t.candidateEditor.languages}
          <CommaListInput
            value={candidate.languages}
            onChange={(value) => updateField(["languages"], value)}
          />
        </label>

        <fieldset className="editor-fieldset">
          <legend>{t.candidateEditor.projects}</legend>
          {candidate.projects.map((item, index) => (
            <div className="repeatable-editor" key={`project-${index}`}>
              <input
                placeholder={t.candidateEditor.projectName}
                value={item.name}
                onChange={(event) =>
                  updateItem("projects", index, "name", event.target.value)
                }
              />
              <textarea
                placeholder={t.candidateEditor.description}
                value={item.description}
                onChange={(event) =>
                  updateItem(
                    "projects",
                    index,
                    "description",
                    event.target.value,
                  )
                }
                rows={2}
              />
              <button
                type="button"
                className="secondary"
                onClick={() => removeItem("projects", index)}
              >
                {t.candidateEditor.remove}
              </button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={addProject}>
            {t.candidateEditor.addProject}
          </button>
        </fieldset>
      </div>

      <div className="panel candidate-json-panel">
        <h3>{t.candidateEditor.jsonTitle}</h3>
        <div className="editor-toolbar">
          <button
            type="button"
            className="secondary icon-button"
            title={t.candidateEditor.copy}
            aria-label={t.candidateEditor.copy}
            onClick={copyJson}
          >
            <Copy size={18} />
          </button>
          <button
            type="button"
            className="secondary icon-button"
            title={t.candidateEditor.download}
            aria-label={t.candidateEditor.download}
            onClick={downloadJson}
            disabled={!jsonIsValid}
          >
            <Download size={18} />
          </button>
        </div>
        <textarea
          className="candidate-json-editor"
          value={json}
          onChange={(event) => handleJsonChange(event.target.value)}
          rows={34}
        />
        {error && <div className="message error">{error}</div>}
      </div>
    </section>
  );
};

export default CandidateEditor;
