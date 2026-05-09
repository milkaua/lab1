import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="container">
    <header class="header">
      <div class="header-inner">
        <a href="/" class="logo">⬡ IT Lab</a>
        <nav>
          <a href="/">Лабораторні</a>
          <a href="/about.html" class="nav-active">Про проєкт</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero hero--small">
        <div class="hero-tag">About</div>
        <h1>Про <em>проєкт</em></h1>
      </section>

      <section class="about-section">
        <div class="about-grid">

          <div class="about-block">
            <span class="about-label">// мета курсу</span>
            <p>Сформувати практичні навички управління IT-проєктами — від організації коду у Git до побудови Agile-процесів у команді.</p>
          </div>

          <div class="about-block">
            <span class="about-label">// стек</span>
            <div class="stack-list">
              <span class="stack-item">Vite 5</span>
              <span class="stack-item">Vanilla JS</span>
              <span class="stack-item">CSS Variables</span>
              <span class="stack-item">Git & GitHub</span>
            </div>
          </div>

          <div class="about-block about-block--wide">
            <span class="about-label">// що вивчаємо</span>
            <div class="skills-grid">
              <div class="skill-item">
                <span class="skill-icon">01</span>
                <div>
                  <strong>Git & Version Control</strong>
                  <p>Розгалуження, злиття, Pull Requests, вирішення конфліктів</p>
                </div>
              </div>
              <div class="skill-item">
                <span class="skill-icon">02</span>
                <div>
                  <strong>Agile / Scrum</strong>
                  <p>Спринти, планування, ретроспективи, velocity команди</p>
                </div>
              </div>
              <div class="skill-item">
                <span class="skill-icon">03</span>
                <div>
                  <strong>CI/CD Pipelines</strong>
                  <p>GitHub Actions, автоматичне тестування та деплой</p>
                </div>
              </div>
              <div class="skill-item">
                <span class="skill-icon">04</span>
                <div>
                  <strong>Документація</strong>
                  <p>README, Confluence, архітектурні рішення (ADR)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="about-block">
            <span class="about-label">// автор</span>
            <p class="author-name">Студент групи ___</p>
            <p class="author-course">Курс: Управління IT-проєктами · 2025</p>
          </div>

        </div>
      </section>
    </main>

    <footer>
      <p>IT Project Management Lab · ${new Date().getFullYear()}</p>
    </footer>
  </div>
`
