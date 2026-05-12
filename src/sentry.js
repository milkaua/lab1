import * as Sentry from '@sentry/browser'

const SENTRY_DSN = (import.meta.env.VITE_SENTRY_DSN || '').trim()
const SENTRY_ENVIRONMENT = (import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'development').trim()
const SENTRY_RELEASE = (import.meta.env.VITE_SENTRY_RELEASE || 'it-project-lab@1.0.0').trim()

let initialized = false

export function sentryEnabled() {
  return SENTRY_DSN !== ''
}

export function initSentry() {
  if (initialized || !sentryEnabled()) return

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    release: SENTRY_RELEASE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/.*$/,
    ],
  })

  Sentry.setTag('lab_name', 'lab6')
  Sentry.setTag('app_name', 'task-manager')
  initialized = true
}

export function addUiBreadcrumb(message, data = {}) {
  if (!sentryEnabled()) return
  initSentry()

  Sentry.addBreadcrumb({
    category: 'user',
    message,
    data,
    level: 'info',
  })
}

export function captureUrgentFilterFailure({ urgentTasksCount, randomValue, visibleTaskCount }) {
  if (!sentryEnabled()) return
  initSentry()

  const reason = urgentTasksCount > 2
    ? `too many urgent tasks (${urgentTasksCount})`
    : `experimental 50/50 branch (${randomValue.toFixed(4)})`

  const error = new Error(`Critical failure in show-urgent-filter action: ${reason}`)

  Sentry.withScope(scope => {
    scope.setLevel('error')
    scope.setTag('feature_flag', 'show-urgent-filter')
    scope.setTag('feature_area', 'task-filters')
    scope.setContext('urgent_filter', {
      urgentTasksCount,
      randomValue,
      visibleTaskCount,
    })
    scope.setExtra('urgentTasksCount', urgentTasksCount)
    scope.setExtra('randomValue', randomValue)
    scope.setExtra('visibleTaskCount', visibleTaskCount)
    Sentry.captureException(error)
  })
}
