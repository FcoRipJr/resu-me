import { useMemo, useState } from 'react';
import AtsTemplate from '../templates/ats/AtsTemplate';
import ModernTemplate from '../templates/modern/ModernTemplate';
import ExecutiveTemplate from '../templates/executive/ExecutiveTemplate';

const templateMap = {
  ats: AtsTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
};

const defaultResume = {
  language: 'pt-BR',
  candidate: {
    name: 'Maria Souza',
    title: 'Desenvolvedora Front-end',
    contact: {
      email: 'maria@email.com',
      phone: '+55 11 99999-9999',
      location: 'São Paulo, SP',
      linkedin: 'linkedin.com/in/maria-souza',
      github: 'github.com/mariasouza',
      portfolio: 'mariasouza.dev',
      others: ['Behance: behance.net/mariasouza', 'Medium: medium.com/@mariasouza'],
    },
  },
  objective: 'Desenvolvedora front-end com foco em interfaces acessíveis e experiências digitais.',
  summary: 'Especialista em React, JavaScript e design de interfaces centradas no usuário.',
  skills: ['React', 'JavaScript', 'CSS', 'Acessibilidade', 'UI/UX'],
  experiences: [
    {
      company: 'Nova Tech',
      position: 'Desenvolvedora Front-end',
      start: { month: 1, year: 2022 },
      end: null,
      current: true,
      description: 'Desenvolvimento e manutenção de produtos digitais para clientes corporativos.',
    },
  ],
  education: [
    {
      institution: 'Universidade de São Paulo',
      degree: 'Bacharel em Sistemas de Informação',
      start: { month: 3, year: 2017 },
      end: { month: 12, year: 2021 },
      current: false,
    },
  ],
  certifications: ['AWS Cloud Practitioner'],
  languages: ['Português', 'Inglês'],
  projects: [{ name: 'Portal de clientes', description: 'Aplicação de autoatendimento em React.' }],
};

const readJsonFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch {
        reject(new Error('Arquivo JSON inválido.'));
      }
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsText(file);
  });

const Generate = ({ t }) => {
  const [resumeJson, setResumeJson] = useState(JSON.stringify(defaultResume, null, 2));
  const [template, setTemplate] = useState('ats');
  const [error, setError] = useState('');

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
      setError('');
    } catch (uploadError) {
      setError(uploadError.message || 'Erro ao carregar JSON.');
    }
  };

  return (
    <section className="page-grid generate-page">
      <div className="panel">
        <h2>{t.generate.title}</h2>

        <div className="field-group">
          <label htmlFor="resume-json">{t.generate.resumeJson}</label>
          <textarea id="resume-json" rows={18} value={resumeJson} onChange={(event) => setResumeJson(event.target.value)} />
          <input type="file" accept="application/json" onChange={handleFileUpload} />
        </div>

        <div className="field-group">
          <label htmlFor="template-select">{t.generate.template}</label>
          <select id="template-select" value={template} onChange={(event) => setTemplate(event.target.value)}>
            <option value="ats">{t.generate.ats}</option>
            <option value="modern">{t.generate.modern}</option>
            <option value="executive">{t.generate.executive}</option>
          </select>
        </div>

        {error && <div className="message error">{error}</div>}

        {resume && (
          <button type="button" onClick={() => window.print()} className="print-button">
            {t.generate.print}
          </button>
        )}
      </div>

      <div className="panel template-panel">
        {resume ? <SelectedTemplate resume={resume} /> : <p>{t.generate.invalidResume}</p>}
      </div>
    </section>
  );
};

export default Generate;
