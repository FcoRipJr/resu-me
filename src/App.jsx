import { useMemo, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Optimize from "./pages/Optimize";
import Generate from "./pages/Generate";
import { translations, languageOptions } from "./i18n/translations";
import { getStoredPreference, setStoredPreference } from "./utils/storage";

const APP_LANGUAGE_KEY = "resu-me.app-language";
const languageValues = languageOptions.map((option) => option.value);

function App() {
  const [language, setLanguage] = useState(() =>
    getStoredPreference(APP_LANGUAGE_KEY, "en", languageValues),
  );
  const t = useMemo(
    () => translations[language] || translations["en"],
    [language],
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <NavLink to="/" className="brand">
            resu-me
          </NavLink>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink
            to="/optimize"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {t.nav.optimize}
          </NavLink>
          <NavLink
            to="/generate"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {t.nav.generate}
          </NavLink>
        </nav>

        <div className="language-switcher">
          <label htmlFor="app-language" className="sr-only">
            Language
          </label>
          <select
            id="app-language"
            value={language}
            onChange={(event) => {
              const nextLanguage = event.target.value;
              setLanguage(nextLanguage);
              setStoredPreference(APP_LANGUAGE_KEY, nextLanguage);
            }}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home language={language} t={t} />} />
          <Route
            path="/optimize"
            element={<Optimize language={language} t={t} />}
          />
          <Route
            path="/generate"
            element={<Generate language={language} t={t} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
