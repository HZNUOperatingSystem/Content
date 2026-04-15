import { route, type RouteConfig } from '@react-router/dev/routes'

export default [
  route('api/search', 'routes/search.ts'),
  route('api/content/*', 'routes/content-markdown.ts'),
  route('*?', 'routes/docs.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
