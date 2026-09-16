import { useMemo, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Optimize from './pages/Optimize';
import Generate from './pages/Generate';
import { translations, languageOptions } from './i18n/translations';

function App() {
  const [language, setLanguage] = useState('pt-BR');
  const t = useMemo(() => translations[language] || translations['pt-BR'], [language]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <NavLink to="/" className="brand">
            resu-me
          </NavLink>
        </div>

        <nav className="main-nav" aria-label="Navegação principal">
          <NavLink to="/optimize" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t.nav.optimize}
          </NavLink>
          <NavLink to="/generate" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t.nav.generate}
          </NavLink>
        </nav>

        <div className="language-switcher">
          <label htmlFor="app-language" className="sr-only">
            Language
          </label>
          <select id="app-language" value={language} onChange={(event) => setLanguage(event.target.value)}>
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
          <Route path="/optimize" element={<Optimize language={language} t={t} />} />
          <Route path="/generate" element={<Generate language={language} t={t} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
