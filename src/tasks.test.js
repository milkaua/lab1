// src/tasks.test.js — Unit тести (Vitest)
import { describe, it, expect, vi } from 'vitest'
import {
  createTask, updateStatus, isOverdue,
  filterByStatus, filterByPriority,
  sortByDeadline, getStats, searchTasks,
  PRIORITY, STATUS,
} from './tasks.js'

// ─────────────────────────────────────────
// createTask
// ─────────────────────────────────────────
describe('createTask', () => {
  it('створює завдання з правильними полями', () => {
    const task = createTask('Зробити лабораторну', PRIORITY.HIGH)
    expect(task.title).toBe('Зробити лабораторну')
    expect(task.priority).toBe(PRIORITY.HIGH)
    expect(task.status).toBe(STATUS.TODO)
    expect(task.id).toBeDefined()
  })

  it('обрізає пробіли з назви', () => {
    const task = createTask('  Тест  ')
    expect(task.title).toBe('Тест')
  })

  it('кидає помилку для порожньої назви', () => {
    expect(() => createTask('')).toThrow('Назва завдання не може бути порожньою')
  })

  it('кидає помилку для невірного пріоритету', () => {
    expect(() => createTask('Тест', 'urgent')).toThrow('Невірний пріоритет')
  })

  it('за замовчуванням пріоритет medium', () => {
    const task = createTask('Тест')
    expect(task.priority).toBe(PRIORITY.MEDIUM)
  })
})

// ─────────────────────────────────────────
// updateStatus
// ─────────────────────────────────────────
describe('updateStatus', () => {
  it('оновлює статус завдання', () => {
    const task = createTask('Тест')
    const updated = updateStatus(task, STATUS.DONE)
    expect(updated.status).toBe(STATUS.DONE)
  })

  it('не мутує оригінальний об\'єкт', () => {
    const task = createTask('Тест')
    updateStatus(task, STATUS.DONE)
    expect(task.status).toBe(STATUS.TODO) // оригінал незмінний
  })

  it('кидає помилку для невірного статусу', () => {
    const task = createTask('Тест')
    expect(() => updateStatus(task, 'cancelled')).toThrow('Невірний статус')
  })
})

// ─────────────────────────────────────────
// isOverdue
// ─────────────────────────────────────────
describe('isOverdue', () => {
  it('повертає true для простроченого завдання', () => {
    const task = { ...createTask('Тест'), deadline: '2020-01-01' }
    expect(isOverdue(task)).toBe(true)
  })

  it('повертає false якщо завдання виконано', () => {
    const task = { ...createTask('Тест'), deadline: '2020-01-01', status: STATUS.DONE }
    expect(isOverdue(task)).toBe(false)
  })

  it('повертає false якщо немає дедлайну', () => {
    const task = createTask('Тест')
    expect(isOverdue(task)).toBe(false)
  })
})

// ─────────────────────────────────────────
// filterByStatus / filterByPriority
// ─────────────────────────────────────────
describe('filterByStatus', () => {
  const tasks = [
    { ...createTask('A'), status: STATUS.TODO },
    { ...createTask('B'), status: STATUS.DONE },
    { ...createTask('C'), status: STATUS.DONE },
  ]

  it('повертає лише завдання з потрібним статусом', () => {
    expect(filterByStatus(tasks, STATUS.DONE)).toHaveLength(2)
  })

  it('повертає порожній масив якщо нічого не знайдено', () => {
    expect(filterByStatus(tasks, STATUS.IN_PROGRESS)).toHaveLength(0)
  })
})

describe('filterByPriority', () => {
  const tasks = [
    createTask('A', PRIORITY.HIGH),
    createTask('B', PRIORITY.LOW),
    createTask('C', PRIORITY.HIGH),
  ]

  it('фільтрує за пріоритетом', () => {
    expect(filterByPriority(tasks, PRIORITY.HIGH)).toHaveLength(2)
  })
})

// ─────────────────────────────────────────
// sortByDeadline
// ─────────────────────────────────────────
describe('sortByDeadline', () => {
  it('сортує за датою дедлайну — найближчий першим', () => {
    const tasks = [
      { ...createTask('B'), deadline: '2025-12-31' },
      { ...createTask('A'), deadline: '2025-06-01' },
    ]
    const sorted = sortByDeadline(tasks)
    expect(sorted[0].title).toBe('A')
  })

  it('завдання без дедлайну — в кінці', () => {
    const tasks = [
      { ...createTask('No deadline') },
      { ...createTask('Has deadline'), deadline: '2025-06-01' },
    ]
    const sorted = sortByDeadline(tasks)
    expect(sorted[sorted.length - 1].title).toBe('No deadline')
  })

  it('не мутує оригінальний масив', () => {
    const tasks = [
      { ...createTask('B'), deadline: '2025-12-31' },
      { ...createTask('A'), deadline: '2025-06-01' },
    ]
    const original = [...tasks]
    sortByDeadline(tasks)
    expect(tasks[0].title).toBe(original[0].title)
  })
})

// ─────────────────────────────────────────
// getStats
// ─────────────────────────────────────────
describe('getStats', () => {
  it('повертає нулі для порожнього масиву', () => {
    const stats = getStats([])
    expect(stats.total).toBe(0)
    expect(stats.completionRate).toBe(0)
  })

  it('коректно рахує completionRate', () => {
    const tasks = [
      updateStatus(createTask('A'), STATUS.DONE),
      updateStatus(createTask('B'), STATUS.DONE),
      createTask('C'),
      createTask('D'),
    ]
    const stats = getStats(tasks)
    expect(stats.completionRate).toBe(50)
  })

  it('рахує прострочені завдання', () => {
    const tasks = [
      { ...createTask('Overdue'), deadline: '2020-01-01' },
      createTask('Normal'),
    ]
    expect(getStats(tasks).overdueCount).toBe(1)
  })
})

// ─────────────────────────────────────────
// searchTasks
// ─────────────────────────────────────────
describe('searchTasks', () => {
  const tasks = [
    createTask('Написати тести'),
    createTask('Зробити коміт'),
    createTask('Написати README'),
  ]

  it('знаходить завдання за підрядком', () => {
    expect(searchTasks(tasks, 'Написати')).toHaveLength(2)
  })

  it('пошук не чутливий до регістру', () => {
    expect(searchTasks(tasks, 'написати')).toHaveLength(2)
  })

  it('повертає всі завдання для порожнього запиту', () => {
    expect(searchTasks(tasks, '')).toHaveLength(3)
  })
})
