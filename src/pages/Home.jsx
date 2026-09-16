const Home = ({ t }) => {
  return (
    <section className="home-page">
      <div className="hero-card">
        <p className="eyebrow">{t.home.eyebrow}</p>
        <h1>{t.home.title}</h1>
        <p className="lead">{t.home.lead}</p>

        <div className="action-grid">
          <a href="/candidate" className="action-card primary">
            <span>{t.home.candidate}</span>
            <small>{t.home.candidateSubtitle}</small>
          </a>

          <a href="/optimize" className="action-card secondary">
            <span>{t.home.optimize}</span>
            <small>{t.home.optimizeSubtitle}</small>
          </a>

          <a href="/generate" className="action-card secondary">
            <span>{t.home.generate}</span>
            <small>{t.home.generateSubtitle}</small>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
