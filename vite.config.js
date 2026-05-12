import { defineConfig, loadEnv } from 'vite'

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const posthogHost = (env.VITE_POSTHOG_HOST || '').trim().replace(/\/$/, '')
  const posthogProxyPath = (env.VITE_POSTHOG_PROXY_PATH || '').trim().replace(/\/$/, '')

  const config = {
    test: {
      environment: 'node',
      include: ['src/**/*.test.js'],
      exclude: ['tests/**', 'node_modules/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/tasks.js'],
      },
    },
  }

  if (posthogHost && posthogProxyPath) {
    config.server = {
      proxy: {
        [posthogProxyPath]: {
          target: posthogHost,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${escapeForRegExp(posthogProxyPath)}`), ''),
        },
      },
    }
  }

  return config
})
