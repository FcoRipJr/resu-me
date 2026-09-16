import { useMemo, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Optimize from "./pages/Optimize";
import Generate from "./pages/Generate";
import CandidateEditor from "./pages/CandidateEditor";
import { translations, languageOptions } from "./i18n/translations";
import { getStoredPreference, setStoredPreference } from "./utils/storage";
import { getCookie, setCookie } from "./utils/cookies";

const APP_LANGUAGE_KEY = "resu-me.app-language";
const languageValues = languageOptions.map((option) => option.value);
const COOKIE_CONSENT_KEY = "resu-me-cookie-consent";

function App() {
  const [language, setLanguage] = useState(() =>
    getStoredPreference(APP_LANGUAGE_KEY, "en", languageValues),
  );
  const [cookieConsent, setCookieConsent] = useState(() =>
    getCookie(COOKIE_CONSENT_KEY),
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
            Resu.Me
          </NavLink>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink
            to="/candidate"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {t.nav.candidate}
          </NavLink>
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
          <Route
            path="/candidate"
            element={<CandidateEditor t={t} cookieConsent={cookieConsent} />}
          />
        </Routes>
      </main>
      {!cookieConsent && (
        <div className="cookie-consent" role="dialog" aria-live="polite">
          <div>
            <strong>{t.cookieConsent.title}</strong>
            <p>{t.cookieConsent.description}</p>
          </div>
          <div className="cookie-consent-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setCookie(COOKIE_CONSENT_KEY, "rejected");
                setCookieConsent("rejected");
              }}
            >
              {t.cookieConsent.reject}
            </button>
            <button
              type="button"
              onClick={() => {
                setCookie(COOKIE_CONSENT_KEY, "accepted");
                setCookieConsent("accepted");
              }}
            >
              {t.cookieConsent.accept}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
