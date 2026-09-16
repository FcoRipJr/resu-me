import { useMemo, useState } from "react";
import { Copy, Eye, Trash2 } from "lucide-react";
import { generatePrompt } from "../services/promptGenerator";
import { languageOptions } from "../i18n/translations";
import { getStoredPreference, setStoredPreference } from "../utils/storage";

const RESUME_LANGUAGE_KEY = "resu-me.resume-language";
const languageValues = languageOptions.map((option) => option.value);

const exampleCandidate = {
  candidate: {
    name: "Maria Souza",
    title: "Desenvolvedora Front-end",
    contact: {
      email: "maria@email.com",
      phone: "+55 11 99999-9999",
      location: "São Paulo, SP",
      linkedin: "linkedin.com/in/maria-souza",
      github: "github.com/mariasouza",
      portfolio: "mariasouza.dev",
      others: [
        "Behance: behance.net/mariasouza",
        "Medium: medium.com/@mariasouza",
      ],
    },
  },
  objective:
    "Buscar oportunidades em desenvolvimento web com foco em experiência do usuário.",
  summary: "Desenvolvedora front-end com 4 anos de experiência.",
  skills: ["React", "JavaScript", "CSS", "UX", "Accessibility"],
  experiences: [
    {
      company: "Nova Tech",
      position: "Desenvolvedora Front-end",
      start: { month: 1, year: 2022 },
      end: null,
      current: true,
      duration_months: 24,
      description: "Desenvolvimento de interfaces para produtos digitais.",
      skills: ["React", "TypeScript", "CSS"],
    },
  ],
  education: [
    {
      institution: "Universidade de São Paulo",
      degree: "Bacharel em Sistemas de Informação",
    },
  ],
  certifications: ["AWS Cloud Practitioner"],
  languages: ["Português", "Inglês"],
  projects: [
    {
      name: "Portal de Clientes",
      description: "Plataforma de autoatendimento em React.",
    },
  ],
};

const readJsonFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch (error) {
        reject(new Error("Arquivo JSON inválido."));
      }
    };
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsText(file);
  });

const Optimize = ({ language, t }) => {
  const [candidateJson, setCandidateJson] = useState(
    JSON.stringify(exampleCandidate, null, 2),
  );
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    getStoredPreference(RESUME_LANGUAGE_KEY, language || "en", languageValues),
  );
  const [jobMode, setJobMode] = useState("text");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");

  const promptPreview = useMemo(() => {
    try {
      const parsed = JSON.parse(candidateJson);
      const result = generatePrompt(
        parsed,
        {
          text: jobText,
          url: jobUrl,
          language: selectedLanguage,
        },
        jobMode,
      );
      return result;
    } catch {
      return "";
    }
  }, [candidateJson, jobText, jobUrl, selectedLanguage, jobMode]);

  const handleJsonUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await readJsonFile(file);
      setCandidateJson(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (uploadError) {
      setError(uploadError.message || "Erro ao processar o arquivo JSON.");
    }
  };

  const handleGeneratePrompt = () => {
    try {
      const parsed = JSON.parse(candidateJson);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("JSON do candidato deve ser um objeto válido.");
      }

      if (!selectedLanguage) {
        throw new Error("Selecione o idioma do currículo.");
      }

      if (!jobText.trim() && !jobUrl.trim()) {
        throw new Error("Informe a vaga por texto ou URL.");
      }

      setPrompt(
        generatePrompt(
          parsed,
          { text: jobText, url: jobUrl, language: selectedLanguage },
          jobMode,
        ),
      );
      setError("");
    } catch (generateError) {
      setError(generateError.message || "Não foi possível gerar o prompt.");
    }
  };

  const copyPrompt = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setError("Prompt copiado para a área de transferência.");
    } catch {
      setError(
        "Não foi possível copiar automaticamente. Copie o texto manualmente.",
      );
    }
  };

  const copyContent = async (content) => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setError(t.optimize.contentCopied);
    } catch {
      setError(t.optimize.copyFailed);
    }
  };

  return (
    <section className="page-grid">
      <div className="panel">
        <h2>{t.optimize.title}</h2>

        <div className="field-group">
          <label htmlFor="language-select">{t.optimize.language}</label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={(event) => {
              const nextLanguage = event.target.value;
              setSelectedLanguage(nextLanguage);
              setStoredPreference(RESUME_LANGUAGE_KEY, nextLanguage);
            }}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="candidate-json">{t.optimize.candidateJson}</label>
          <input
            type="file"
            accept="application/json"
            onChange={handleJsonUpload}
          />
          <div className="input-actions">
            <button
              type="button"
              className="secondary icon-button"
              title={t.optimize.showExample}
              aria-label={t.optimize.showExample}
              onClick={() =>
                setCandidateJson(JSON.stringify(exampleCandidate, null, 2))
              }
            >
              <Eye aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              className="secondary icon-button"
              title={t.optimize.copyContent}
              aria-label={t.optimize.copyContent}
              onClick={() => copyContent(candidateJson)}
            >
              <Copy aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              className="secondary icon-button"
              title={t.optimize.clearContent}
              aria-label={t.optimize.clearContent}
              onClick={() => setCandidateJson("")}
            >
              <Trash2 aria-hidden="true" size={18} />
            </button>
          </div>
          <textarea
            id="candidate-json"
            value={candidateJson}
            onChange={(event) => setCandidateJson(event.target.value)}
            rows={16}
          />
        </div>

        <div className="field-group">
          <label>{t.optimize.jobType}</label>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                checked={jobMode === "text"}
                onChange={() => setJobMode("text")}
              />
              {t.optimize.text}
            </label>
            <label>
              <input
                type="radio"
                checked={jobMode === "url"}
                onChange={() => setJobMode("url")}
              />
              {t.optimize.url}
            </label>
          </div>
        </div>

        {jobMode === "text" ? (
          <div className="field-group">
            <label htmlFor="job-text">{t.optimize.jobText}</label>
            <div className="input-actions">
              <button
                type="button"
                className="secondary icon-button"
                title={t.optimize.copyContent}
                aria-label={t.optimize.copyContent}
                onClick={() => copyContent(jobText)}
              >
                <Copy aria-hidden="true" size={18} />
              </button>
              <button
                type="button"
                className="secondary icon-button"
                title={t.optimize.clearContent}
                aria-label={t.optimize.clearContent}
                onClick={() => setJobText("")}
              >
                <Trash2 aria-hidden="true" size={18} />
              </button>
            </div>
            <textarea
              id="job-text"
              value={jobText}
              onChange={(event) => setJobText(event.target.value)}
              rows={8}
            />
          </div>
        ) : (
          <div className="field-group">
            <label htmlFor="job-url">{t.optimize.jobUrl}</label>
            <input
              id="job-url"
              type="url"
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
            />
          </div>
        )}

        <div className="action-row">
          <button type="button" onClick={handleGeneratePrompt}>
            {t.optimize.generatePrompt}
          </button>
        </div>

        {error && <div className="message error">{error}</div>}
      </div>

      <div className="panel preview-panel">
        <h3>{t.optimize.preview}</h3>
        <button
          type="button"
          className="secondary icon-button preview-action"
          title={t.optimize.copyPrompt}
          aria-label={t.optimize.copyPrompt}
          onClick={copyPrompt}
        >
          <Copy aria-hidden="true" size={18} />
        </button>
        <pre>{prompt || promptPreview || t.optimize.empty}</pre>
      </div>
    </section>
  );
};

export default Optimize;
