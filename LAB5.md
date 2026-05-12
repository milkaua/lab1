# Lab 5

This project is prepared for a PostHog-based lab.

## 1. Configure credentials

Create `.env` from `.env.example` and paste your real PostHog project key.

If your PostHog project is in the EU, change:

`VITE_POSTHOG_HOST=https://eu.i.posthog.com`

## 2. Run the app

```bash
npm run dev
```

## 3. Generate data for the lab

Open the app and perform these actions several times:

1. Load the page.
2. Create tasks with different priorities.
3. Change task status.
4. Delete at least one task.
5. Use status and priority filters.
6. Use search.

## 4. Check custom events in PostHog

The app now sends these events:

- `task_created`
- `task_deleted`
- `task_status_changed`
- `status_filter_applied`
- `priority_filter_applied`
- `urgent_filter_toggled`
- `task_search_used`

Important task properties included in analytics:

- `task_id`
- `priority`
- `status`
- `deadline`
- `has_deadline`
- `days_left`
- `is_overdue`
- `is_urgent`

## 5. Create the funnel in PostHog

Use this sequence:

1. `Pageview`
2. `task_created`
3. `task_deleted`

Recommended settings:

- graph type: `Conversion steps`
- aggregation: `Unique users`
- step order: `Sequential`

## 6. Feature flag

Create a PostHog feature flag with key:

`show-urgent-filter`

When enabled, the app shows an extra `Urgent Only` filter button.

## 7. Session replay and web analytics

After interacting with the app, collect screenshots from:

- `Web analytics`
- `Session replay`
- `Event definitions`
- the created funnel
- the feature flag page

## 8. Optional proxy

If requests are blocked by extensions or browser privacy filters, keep this in `.env`:

`VITE_POSTHOG_PROXY_PATH=/ingest`

Then restart Vite.
