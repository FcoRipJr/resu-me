import { useMemo, useState } from "react";
import AtsTemplate from "../templates/ats/AtsTemplate";
import ModernTemplate from "../templates/modern/ModernTemplate";
import ExecutiveTemplate from "../templates/executive/ExecutiveTemplate";

const templateMap = {
  ats: AtsTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
};

const paletteOptions = [
  {
    value: "ocean",
    colors: ["#0f172a", "#1d4ed8", "#dbeafe", "#111827", "#374151"],
  },
  {
    value: "forest",
    colors: ["#17352f", "#18794e", "#d8f3e5", "#17221f", "#3d5149"],
  },
  {
    value: "terracotta",
    colors: ["#4a2420", "#b4533c", "#f8dfd5", "#2b211f", "#59433d"],
  },
  {
    value: "violet",
    colors: ["#2e2450", "#6941c6", "#e9ddff", "#211c32", "#514b62"],
  },
  {
    value: "slate",
    colors: ["#263746", "#38658a", "#dceaf4", "#1f2933", "#465463"],
  },
  {
    value: "mustard",
    colors: ["#3f3520", "#a66a00", "#f6e8b1", "#29251c", "#5b5548"],
  },
  {
    value: "ruby",
    colors: ["#451a24", "#b4233f", "#fbd5dd", "#2b1720", "#5a3b43"],
  },
  {
    value: "ember",
    colors: ["#472617", "#c2410c", "#ffdfc7", "#2d1b13", "#62473b"],
  },
  {
    value: "coral",
    colors: ["#49302d", "#d05d55", "#fbdad5", "#2d2423", "#654c49"],
  },
  {
    value: "rose",
    colors: ["#4b253b", "#c2467a", "#f8d8e7", "#2e1d27", "#604552"],
  },
  {
    value: "plum",
    colors: ["#38243d", "#8b4c9f", "#ead8ef", "#251b29", "#55465a"],
  },
  {
    value: "indigo",
    colors: ["#202a52", "#4f46a5", "#dfe1ff", "#1b2038", "#434a68"],
  },
  {
    value: "cobalt",
    colors: ["#102f4f", "#1671c5", "#d4ebff", "#142333", "#3e566b"],
  },
  {
    value: "teal",
    colors: ["#123c42", "#0f8b8d", "#d0f0ee", "#172c30", "#3e5d60"],
  },
  {
    value: "lagoon",
    colors: ["#123b4a", "#168aad", "#d4f1f9", "#172a35", "#42616b"],
  },
  {
    value: "mint",
    colors: ["#1d403b", "#299d83", "#d5f4e9", "#182b28", "#46645c"],
  },
  {
    value: "cyan",
    colors: ["#16404c", "#0891b2", "#cff5fb", "#172c34", "#42616a"],
  },
  {
    value: "amber",
    colors: ["#4a3515", "#d18b00", "#ffedb5", "#302616", "#66563a"],
  },
  {
    value: "olive",
    colors: ["#35401d", "#718c20", "#e8efc4", "#252b1b", "#566044"],
  },
  {
    value: "coffee",
    colors: ["#3e2b25", "#976044", "#f0ddd0", "#29201c", "#5d4940"],
  },
  {
    value: "graphite",
    colors: ["#20252b", "#59636e", "#e1e6eb", "#181b20", "#454d56"],
  },
];

const defaultResume = {
  language: "pt-BR",
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
    "Desenvolvedora front-end com foco em interfaces acessíveis e experiências digitais.",
  summary:
    "Especialista em React, JavaScript e design de interfaces centradas no usuário.",
  skills: ["React", "JavaScript", "CSS", "Acessibilidade", "UI/UX"],
  experiences: [
    {
      company: "Nova Tech",
      position: "Desenvolvedora Front-end",
      start: { month: 1, year: 2022 },
      end: null,
      current: true,
      description:
        "Desenvolvimento e manutenção de produtos digitais para clientes corporativos.",
    },
  ],
  education: [
    {
      institution: "Universidade de São Paulo",
      degree: "Bacharel em Sistemas de Informação",
      start: { month: 3, year: 2017 },
      end: { month: 12, year: 2021 },
      current: false,
    },
  ],
  certifications: ["AWS Cloud Practitioner"],
  languages: ["Português", "Inglês"],
  projects: [
    {
      name: "Portal de clientes",
      description: "Aplicação de autoatendimento em React.",
    },
  ],
};

const readJsonFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error("Arquivo JSON inválido."));
      }
    };
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsText(file);
  });

const Generate = ({ t }) => {
  const [resumeJson, setResumeJson] = useState(
    JSON.stringify(defaultResume, null, 2),
  );
  const [template, setTemplate] = useState("ats");
  const [palette, setPalette] = useState("ocean");
  const [error, setError] = useState("");

  const resume = useMemo(() => {
    try {
      return JSON.parse(resumeJson);
    } catch {
      return null;
    }
  }, [resumeJson]);

  const SelectedTemplate = templateMap[template];

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await readJsonFile(file);
      setResumeJson(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (uploadError) {
      setError(uploadError.message || "Erro ao carregar JSON.");
    }
  };

  return (
    <section className="page-grid generate-page">
      <div className="panel">
        <h2>{t.generate.title}</h2>

        <div className="field-group">
          <label htmlFor="resume-json">{t.generate.resumeJson}</label>
          <textarea
            id="resume-json"
            rows={18}
            value={resumeJson}
            onChange={(event) => setResumeJson(event.target.value)}
          />
          <input
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
          />
        </div>

        <div className="field-group">
          <label htmlFor="template-select">{t.generate.template}</label>
          <select
            id="template-select"
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
          >
            <option value="ats">{t.generate.ats}</option>
            <option value="modern">{t.generate.modern}</option>
            <option value="executive">{t.generate.executive}</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="palette-select">{t.generate.palette}</label>
          <select
            id="palette-select"
            value={palette}
            onChange={(event) => setPalette(event.target.value)}
          >
            {paletteOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t.generate.palettes[option.value]}
              </option>
            ))}
          </select>
          <div className="palette-swatches" aria-hidden="true">
            {paletteOptions
              .find((option) => option.value === palette)
              .colors.map((color) => (
                <span key={color} style={{ backgroundColor: color }} />
              ))}
          </div>
        </div>

        {error && <div className="message error">{error}</div>}

        {resume && (
          <button
            type="button"
            onClick={() => window.print()}
            className="print-button"
          >
            {t.generate.print}
          </button>
        )}
      </div>

      <div className="panel template-panel">
        {resume ? (
          <div className={`resume-palette palette-${palette}`}>
            <SelectedTemplate resume={resume} />
          </div>
        ) : (
          <p>{t.generate.invalidResume}</p>
        )}
      </div>
    </section>
  );
};

export default Generate;
