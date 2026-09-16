# Resu.Me

Resume editor and generator focused on building candidate data, tailoring resumes to job openings, and rendering them as print-ready documents.

The application runs entirely in the browser. It does not provide an AI backend: the optimization page prepares a structured prompt for an external AI service, and the generation page renders the JSON returned by that service.

## Features

- Bidirectional candidate editor: form fields update the candidate JSON and valid JSON edits update the form.
- Candidate editor with identity, contact details, objective, summary, skills, experience, education, certifications, languages, and projects.
- Candidate experience skills, dates, current status, and comma-separated list fields.
- Candidate JSON file upload, example, copy, clear, and download actions.
- Job description input by text or URL.
- Prompt generation for external AI tools.
- Resume JSON input with file upload, example, copy, and clear actions.
- JSON validation for candidate and optimized resume structures, including date validation and short-year normalization such as `21` to `2021`.
- 15 resume templates: ATS, Modern, Executive, Minimal, Creative, Academic, Split Executive, Editorial, Compact, Timeline, Monochrome, Geometric, Serif, Portfolio, and High Contrast.
- 21 predefined color palettes.
- Individual color editing for the five colors of the selected palette. Selecting another palette restores its default colors.
- Visual resume editor for font scale, spacing, margins, and date format.
- Section editor for visibility, ordering, projects, and custom sections.
- Reset controls for visual settings and default section order.
- A4 print layout and PDF export through the browser print dialog.
- English as the default interface and resume language, with Portuguese and Spanish translations available.
- Browser persistence for language, resume language, template, palette, date format, visual settings, and section settings.
- Optional candidate JSON cookie storage, enabled only after explicit user consent.
- Contact fields for email, phone, location, LinkedIn, GitHub, portfolio, and custom links.

## Technology Stack

- React 18
- React Router DOM 6
- Vite 5
- Lucide React for interface icons
- JavaScript with JSX
- CSS with responsive and print-specific styles

## Requirements

- Node.js 18 or newer
- npm

## Installation

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

Open `http://localhost:5173` in the browser.

## Production Build

Generate the production files:

```bash
npm run build
```

Vite writes the production output to `dist/`.

To test the production build locally:

```bash
npm run preview
```

The preview server runs at `http://localhost:4173`.

## Usage

### 1. Build the candidate profile

1. Open **Edit candidate**. This is the first step of the workflow.
2. Choose whether to authorize candidate JSON storage in browser cookies when the consent notice appears.
3. Fill in the form fields, or edit the candidate JSON directly.
4. Use comma-separated fields for skills, languages, certifications, and additional links.
5. Add experiences, experience skills, education, and projects as needed.
6. Load an existing candidate JSON file, copy the JSON, download it, or clear all fields.

The form and JSON editor are bidirectional: changing a valid JSON value updates the corresponding form field, and changing a form field updates the JSON.

### 2. Optimize a candidate profile

1. Open **Optimize resume**.
2. Paste the candidate JSON from the candidate editor or load a JSON file.
3. Add the job description as text or provide a job URL.
4. Select the language of the resume output.
5. Click **Generate prompt**.
6. Copy the generated prompt and submit it to an external AI service.
7. Ask the service to return only the optimized JSON described in the prompt.

### 3. Generate the resume

1. Open **Generate resume**.
2. Paste the optimized JSON or load a JSON file.
3. Choose one of the 15 available templates.
4. Choose a color palette.
5. Optionally edit individual palette colors.
6. Adjust font size, spacing, margins, and date format.
7. Reorder, hide, or add resume sections.
8. Review the preview.
9. Click **Print / Save as PDF** and select a PDF printer in the browser dialog.

The interface language, resume language, selected template, palette, date format, visual settings, section order, hidden sections, and custom sections are stored in `localStorage` and restored on the next visit. Candidate JSON is stored in browser cookies only after explicit consent. If consent is not granted, candidate data is not saved as a cookie.

The visual editor includes a reset button. Changing the selected palette always restores that palette's default colors instead of carrying custom colors from the previous palette.

## Candidate JSON Format

The candidate input contains the candidate profile and source information. Dates use an object with an optional month and a preferred year.

```json
{
  "candidate": {
    "name": "Maria Souza",
    "title": "Front-end Developer",
    "contact": {
      "email": "maria@email.com",
      "phone": "+55 11 99999-9999",
      "location": "Sao Paulo, Brazil",
      "linkedin": "linkedin.com/in/maria-souza",
      "github": "github.com/mariasouza",
      "portfolio": "mariasouza.dev",
      "others": ["Behance: behance.net/mariasouza"]
    }
  },
  "objective": "Seeking web development opportunities focused on user experience.",
  "summary": "Front-end developer with 4 years of experience.",
  "skills": ["React", "JavaScript", "CSS"],
  "experiences": [
    {
      "company": "Nova Tech",
      "position": "Front-end Developer",
      "start": { "month": 1, "year": 2022 },
      "end": null,
      "current": true,
      "description": "Developing interfaces for digital products.",
      "skills": ["React", "TypeScript"]
    }
  ],
  "education": [
    {
      "institution": "University of Sao Paulo",
      "degree": "Bachelor of Information Systems",
      "start": { "month": 3, "year": 2017 },
      "end": { "month": 12, "year": 2021 },
      "current": false
    }
  ],
  "certifications": ["AWS Cloud Practitioner"],
  "languages": ["Portuguese", "English"],
  "projects": [
    {
      "name": "Customer Portal",
      "description": "React self-service platform."
    }
  ]
}
```

### Contact fields

- `email`, `phone`, `location`, `linkedin`, `github`, and `portfolio` are optional strings.
- `others` is optional and accepts `null`, one string, or an array of strings.
- Empty contact values are ignored by the templates.

### Date fields

- `month` is optional.
- `year` should be provided whenever possible.
- Ongoing experiences or education use `current: true` and may use `end: null`.
- Experiences and education display their periods in the rendered resume.
- Two-digit years such as `21` are accepted and displayed as `2021`.

## Optimized Resume JSON Format

The optimized resume follows the same candidate structure and adds a top-level `language` field. The external AI should preserve factual information and return valid JSON only.

```json
{
  "language": "en",
  "candidate": {
    "name": "Maria Souza",
    "title": "Front-end Developer",
    "contact": {
      "email": "maria@email.com",
      "phone": "+55 11 99999-9999",
      "location": "Sao Paulo, Brazil",
      "linkedin": "linkedin.com/in/maria-souza",
      "github": "github.com/mariasouza",
      "portfolio": "mariasouza.dev",
      "others": null
    }
  },
  "objective": "Front-end developer focused on accessible interfaces.",
  "summary": "React and JavaScript specialist focused on usability.",
  "skills": ["React", "JavaScript", "Accessibility"],
  "experiences": [
    {
      "company": "Nova Tech",
      "position": "Front-end Developer",
      "start": { "month": 1, "year": 2022 },
      "end": null,
      "current": true,
      "description": "Developing responsive digital products.",
      "achievements": ["Improved accessibility across web platforms"]
    }
  ],
  "education": [
    {
      "institution": "University of Sao Paulo",
      "degree": "Bachelor of Information Systems",
      "start": { "month": 3, "year": 2017 },
      "end": { "month": 12, "year": 2021 },
      "current": false
    }
  ],
  "certifications": [],
  "languages": ["Portuguese (native)", "English (advanced)"],
  "projects": []
}
```

The complete working examples are available in:

- `src/data/candidate.example.json`
- `src/data/optimized-resume.example.json`

## Prompt Generation

The prompt is generated by `src/services/promptGenerator.js`. It instructs the external AI to:

- use only facts from the candidate input;
- tailor relevant content to the job opening;
- preserve companies, roles, dates, education, and technologies;
- write the resume in the selected language;
- return only valid JSON matching the required schema.

The project does not send candidate data or job descriptions to a server. The user decides which external AI service receives the copied prompt.

## Project Structure

```text
src/
	data/                 Example candidate and optimized JSON files
	i18n/                 Interface translations
  pages/                Home, candidate editor, optimization, and generation pages
	services/             Prompt generation logic
	styles/               Screen and print styles
  templates/            15 resume templates and shared additional renderer
  utils/                Date formatting, JSON validation, and browser storage helpers
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the complete license text.
