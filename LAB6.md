# Lab 6

This lab adds Sentry frontend monitoring to the existing Task Manager project.

## 1. Configure Sentry

Add these variables to `.env`:

```bash
VITE_SENTRY_DSN=your_sentry_browser_dsn
VITE_SENTRY_ENVIRONMENT=development
VITE_SENTRY_RELEASE=it-project-lab@1.0.0
```

If you already use PostHog, keep those variables too.

## 2. Run locally

```bash
npm run dev
```

## 3. Generate a Sentry issue

1. Open the app locally.
2. Make sure the PostHog feature flag `show-urgent-filter` is enabled.
3. Click `Urgent Only`.

The app adds a breadcrumb and sends a controlled frontend exception to Sentry.

Issue title example:

`Critical failure in show-urgent-filter action: too many urgent tasks (3)`

## 4. What is instrumented

- Sentry Browser SDK
- Browser tracing
- Session replay
- Breadcrumbs for the urgent filter action
- Manual exception capture for the experimental urgent-filter failure

## 5. Screenshots for the report

- Sentry `Issues -> Feed`
- Sentry issue details page with stack trace and breadcrumbs
- Sentry `Insights -> Frontend`
- Sentry dashboard with frontend widgets
- Sentry `Alerts`
- the created alert rule
- email notification from Sentry

## 6. Alert rule example

Create an alert like in the lab screenshots:

- condition: when Sentry marks a new issue as high priority
- action: send a notification
- interval: `30 minutes`
