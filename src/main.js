import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="container">
    <header class="header">
      <div class="header-inner">
        <span class="logo">⬡ IT Lab</span>
        <nav>
          <a href="#labs">Лабораторні</a>
          <a href="#about">Про проєкт</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-tag">Управління IT-проєктами</div>
        <h1>Лабораторний<br><em>практикум</em></h1>
        <p class="hero-sub">Практичні навички роботи з Git, GitHub та командними процесами розробки</p>
      </section>

      <section id="labs" class="labs-section">
        <h2 class="section-title">Лабораторні роботи</h2>
        <div class="labs-grid" id="labs-grid"></div>
      </section>
    </main>

    <footer>
      <p>IT Project Management Lab · ${new Date().getFullYear()}</p>
    </footer>
  </div>
`

const labs = [
  {
    num: '01',
    title: 'Управління кодом та організація робочого простору в Git',
    topics: ['Git Flow', 'Pull Requests', 'Merge Conflicts', '.gitignore'],
    status: 'active',
  },
  {
    num: '02',
    title: 'Agile та Scrum: організація спринту',
    topics: ['User Stories', 'Sprint Planning', 'Backlog', 'Retrospective'],
    status: 'upcoming',
  },
  {
    num: '03',
    title: 'CI/CD та автоматизація процесів',
    topics: ['GitHub Actions', 'Pipelines', 'Testing', 'Deployment'],
    status: 'upcoming',
  },
  {
    num: '04',
    title: 'Управління задачами та документація',
    topics: ['Jira / Trello', 'Confluence', 'Roadmap', 'Звітність'],
    status: 'upcoming',
  },
]

const grid = document.querySelector('#labs-grid')
grid.innerHTML = labs.map(lab => `
  <article class="lab-card ${lab.status}">
    <span class="lab-num">${lab.num}</span>
    <h3>${lab.title}</h3>
    <div class="topics">
      ${lab.topics.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
    <div class="card-footer">
      ${lab.status === 'active'
        ? '<span class="badge badge-active">● Поточна</span>'
        : '<span class="badge badge-upcoming">Незабаром</span>'}
    </div>
  </article>
`).join('')
