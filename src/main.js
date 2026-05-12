import './style.css'
import {
  createTask, updateStatus, isOverdue,
  filterByStatus, filterByPriority,
  sortByDeadline, getStats, searchTasks,
  PRIORITY, STATUS,
} from './tasks.js'
import {
  initAnalytics,
  captureEvent,
  subscribeToFeatureFlag,
} from './analytics.js'
import {
  initSentry,
  addUiBreadcrumb,
  captureUrgentFilterFailure,
} from './sentry.js'

let tasks = [
  { ...createTask('Налаштувати Git репозиторій', PRIORITY.HIGH), deadline: '2025-06-01', status: STATUS.DONE },
  { ...createTask('Написати README.md', PRIORITY.MEDIUM), deadline: '2025-06-05', status: STATUS.DONE },
  { ...createTask('Додати .gitignore', PRIORITY.LOW), status: STATUS.DONE },
  { ...createTask('Написати Unit тести', PRIORITY.HIGH), deadline: '2025-06-15', status: STATUS.IN_PROGRESS },
  { ...createTask('Налаштувати Vitest', PRIORITY.HIGH), deadline: '2025-06-12', status: STATUS.IN_PROGRESS },
  { ...createTask('Зробити E2E тести з Playwright', PRIORITY.MEDIUM), deadline: '2025-06-20' },
  { ...createTask('Вирішити merge conflict', PRIORITY.LOW) },
]

let filterStatus = 'all'
let filterPriority = 'all'
let searchQuery = ''
let filterUrgent = false
let showUrgentFilter = false

const PRIORITY_LABEL = { high: 'Високий', medium: 'Середній', low: 'Низький' }
const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }
const STATUS_NEXT = { todo: STATUS.IN_PROGRESS, in_progress: STATUS.DONE, done: STATUS.TODO }
const STATUS_BTN = { todo: '▶ Почати', in_progress: '✓ Виконано', done: '↺ Відновити' }

function getDaysLeft(deadline) {
  if (!deadline) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(deadline)
  dueDate.setHours(0, 0, 0, 0)

  return Math.ceil((dueDate - today) / 86400000)
}

function isUrgentTask(task) {
  return task.priority === PRIORITY.HIGH || isOverdue(task)
}

function getTaskAnalyticsProps(task) {
  return {
    task_id: task.id,
    priority: task.priority,
    status: task.status,
    deadline: task.deadline,
    has_deadline: Boolean(task.deadline),
    days_left: getDaysLeft(task.deadline),
    is_overdue: isOverdue(task),
    is_urgent: isUrgentTask(task),
  }
}

function getUrgentTasksCount() {
  return tasks.filter(isUrgentTask).length
}

function getFiltered() {
  let result = [...tasks]
  if (filterStatus !== 'all') result = filterByStatus(result, filterStatus)
  if (filterPriority !== 'all') result = filterByPriority(result, filterPriority)
  if (showUrgentFilter && filterUrgent) result = result.filter(isUrgentTask)
  result = searchTasks(result, searchQuery)
  return sortByDeadline(result)
}

function formatDate(dateValue) {
  if (!dateValue) return ''
  return new Date(dateValue).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })
}

function render() {
  const filtered = getFiltered()
  const stats = getStats(tasks)

  document.querySelector('#stats-total').textContent = stats.total
  document.querySelector('#stats-done').textContent = stats.done
  document.querySelector('#stats-progress').textContent = stats.inProgress
  document.querySelector('#stats-rate').textContent = `${stats.completionRate}%`
  document.querySelector('#progress-bar').style.width = `${stats.completionRate}%`
  document.querySelector('#stats-overdue').textContent =
    stats.overdueCount > 0 ? `${stats.overdueCount} прострочено` : ''

  document.querySelectorAll('[data-status-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.statusFilter === filterStatus)
  })

  document.querySelectorAll('[data-priority-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.priorityFilter === filterPriority)
  })

  const urgentBtn = document.querySelector('[data-feature-flag="show-urgent-filter"]')
  if (urgentBtn) {
    urgentBtn.hidden = !showUrgentFilter
    urgentBtn.classList.toggle('active', filterUrgent)
    urgentBtn.setAttribute('aria-pressed', String(filterUrgent))
  }

  const list = document.querySelector('#task-list')
  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty">Завдань не знайдено</div>'
    return
  }

  list.innerHTML = filtered.map(task => `
    <div class="task-card ${task.status} ${isOverdue(task) ? 'overdue' : ''}" data-id="${task.id}">
      <div class="task-left">
        <span class="priority-dot priority-${task.priority}"></span>
        <div class="task-info">
          <span class="task-title">${task.title}</span>
          <div class="task-meta">
            <span class="status-badge status-${task.status}">${STATUS_LABEL[task.status]}</span>
            ${task.deadline ? `<span class="deadline ${isOverdue(task) ? 'overdue-text' : ''}">${isOverdue(task) ? '⚠ ' : ''}${formatDate(task.deadline)}</span>` : ''}
            <span class="priority-label prio-${task.priority}">${PRIORITY_LABEL[task.priority]}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-status" data-id="${task.id}" data-action="status">${STATUS_BTN[task.status]}</button>
        <button class="btn-delete" data-id="${task.id}" data-action="delete">✕</button>
      </div>
    </div>
  `).join('')
}

document.querySelector('#task-list').addEventListener('click', event => {
  const btn = event.target.closest('[data-action]')
  if (!btn) return

  const { id, action } = btn.dataset
  const task = tasks.find(item => item.id === id)
  if (!task) return

  if (action === 'status') {
    const newStatus = STATUS_NEXT[task.status]
    const updatedTask = updateStatus(task, newStatus)
    tasks = tasks.map(item => item.id === id ? updatedTask : item)

    captureEvent('task_status_changed', {
      ...getTaskAnalyticsProps(updatedTask),
      previous_status: task.status,
      new_status: newStatus,
    })
  }

  if (action === 'delete') {
    captureEvent('task_deleted', getTaskAnalyticsProps(task))
    tasks = tasks.filter(item => item.id !== id)
  }

  render()
})

document.querySelector('#add-form').addEventListener('submit', event => {
  event.preventDefault()
  const title = document.querySelector('#new-title').value
  const priority = document.querySelector('#new-priority').value
  const deadline = document.querySelector('#new-deadline').value || null

  try {
    const newTask = createTask(title, priority, deadline)
    tasks = [...tasks, newTask]

    captureEvent('task_created', {
      ...getTaskAnalyticsProps(newTask),
      title_length: newTask.title.length,
    })

    event.target.reset()
    render()
  } catch (err) {
    alert(err.message)
  }
})

document.querySelector('#search').addEventListener('input', event => {
  searchQuery = event.target.value
  render()
})

document.querySelector('#search').addEventListener('change', event => {
  const query = event.target.value.trim()
  captureEvent('task_search_used', {
    query,
    query_length: query.length,
  })
})

document.querySelectorAll('[data-status-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    filterStatus = btn.dataset.statusFilter
    captureEvent('status_filter_applied', { status_filter: filterStatus })
    render()
  })
})

document.querySelectorAll('[data-priority-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    filterPriority = btn.dataset.priorityFilter
    captureEvent('priority_filter_applied', { priority_filter: filterPriority })
    render()
  })
})

document.querySelector('[data-feature-flag="show-urgent-filter"]')?.addEventListener('click', () => {
  if (!showUrgentFilter) return

  const urgentTasksCount = getUrgentTasksCount()
  const randomValue = Math.random()

  addUiBreadcrumb('Urgent filter button clicked (experimental 50/50)', {
    urgentTasksCount,
    randomValue,
  })

  if (urgentTasksCount > 2 || randomValue > 0.5) {
    captureUrgentFilterFailure({
      urgentTasksCount,
      randomValue,
      visibleTaskCount: getFiltered().length,
    })
    return
  }

  filterUrgent = !filterUrgent
  captureEvent('urgent_filter_toggled', { enabled: filterUrgent })
  render()
})

initSentry()
initAnalytics()

subscribeToFeatureFlag('show-urgent-filter', enabled => {
  showUrgentFilter = enabled
  if (!enabled) filterUrgent = false
  render()
})

render()
