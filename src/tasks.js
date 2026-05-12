// src/tasks.js — чиста бізнес-логіка (без DOM)

export const PRIORITY = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
export const STATUS   = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' }

/**
 * Створити нове завдання
 */
export function createTask(title, priority = PRIORITY.MEDIUM, deadline = null) {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Назва завдання не може бути порожньою')
  }
  if (!Object.values(PRIORITY).includes(priority)) {
    throw new Error(`Невірний пріоритет: ${priority}`)
  }
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    priority,
    deadline,
    status: STATUS.TODO,
    createdAt: new Date().toISOString(),
  }
}

/**
 * Змінити статус завдання
 */
export function updateStatus(task, newStatus) {
  if (!Object.values(STATUS).includes(newStatus)) {
    throw new Error(`Невірний статус: ${newStatus}`)
  }
  return { ...task, status: newStatus }
}

/**
 * Чи прострочено завдання
 */
export function isOverdue(task) {
  if (!task.deadline || task.status === STATUS.DONE) return false
  return new Date(task.deadline) < new Date()
}

/**
 * Фільтрувати завдання за статусом
 */
export function filterByStatus(tasks, status) {
  return tasks.filter(t => t.status === status)
}

/**
 * Фільтрувати завдання за пріоритетом
 */
export function filterByPriority(tasks, priority) {
  return tasks.filter(t => t.priority === priority)
}

/**
 * Сортування за дедлайном (найближчі — першими, без дедлайну — в кінці)
 */
export function sortByDeadline(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return new Date(a.deadline) - new Date(b.deadline)
  })
}

/**
 * Статистика по завданнях
 */
export function getStats(tasks) {
  const total = tasks.length
  if (total === 0) return { total: 0, done: 0, inProgress: 0, todo: 0, completionRate: 0, overdueCount: 0 }

  const done       = tasks.filter(t => t.status === STATUS.DONE).length
  const inProgress = tasks.filter(t => t.status === STATUS.IN_PROGRESS).length
  const todo       = tasks.filter(t => t.status === STATUS.TODO).length
  const overdueCount = tasks.filter(isOverdue).length

  return {
    total,
    done,
    inProgress,
    todo,
    completionRate: Math.round((done / total) * 100),
    overdueCount,
  }
}

/**
 * Пошук завдань за рядком
 */
export function searchTasks(tasks, query) {
  const q = query.toLowerCase().trim()
  if (!q) return tasks
  return tasks.filter(t => t.title.toLowerCase().includes(q))
}
