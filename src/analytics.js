import posthog from 'posthog-js'

const POSTHOG_KEY = (import.meta.env.VITE_POSTHOG_KEY || '').trim()
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com').trim().replace(/\/$/, '')
const POSTHOG_PROXY_PATH = (import.meta.env.VITE_POSTHOG_PROXY_PATH || '').trim().replace(/\/$/, '')
const POSTHOG_DEFAULTS = '2026-01-30'

let initialized = false

function hasValidConfig() {
  return POSTHOG_KEY !== '' && POSTHOG_KEY !== 'phc_your_project_key'
}

export function analyticsEnabled() {
  return hasValidConfig()
}

export function initAnalytics() {
  if (initialized || !hasValidConfig()) return posthog

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_PROXY_PATH || POSTHOG_HOST,
    ui_host: POSTHOG_HOST,
    defaults: POSTHOG_DEFAULTS,
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    session_recording: {
      maskAllInputs: false,
    },
    loaded: sdk => {
      window.posthog = sdk
    },
  })

  posthog.register({
    lab_name: 'lab5',
    app_name: 'task-manager',
  })

  initialized = true
  return posthog
}

export function captureEvent(eventName, properties = {}) {
  if (!hasValidConfig()) return
  initAnalytics()
  posthog.capture(eventName, properties)
}

export function isFeatureEnabled(flagKey) {
  if (!hasValidConfig()) return false
  initAnalytics()
  return Boolean(posthog.isFeatureEnabled(flagKey))
}

export function subscribeToFeatureFlag(flagKey, listener) {
  if (typeof listener !== 'function') return () => {}
  if (!hasValidConfig()) {
    listener(false)
    return () => {}
  }

  initAnalytics()

  const handler = () => {
    listener(Boolean(posthog.isFeatureEnabled(flagKey)))
  }

  posthog.onFeatureFlags(handler)
  handler()

  return () => {
    posthog.offFeatureFlags?.(handler)
  }
}
