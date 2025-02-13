export default {
  srcDir: 'server',
  publicDir: 'public',

  routeRules: {
    '/api/todos': '~/api/todos/index.ts',
    '/api/todos/:id': '~/api/todos/[id].ts',
  },

  serverMiddleware: [
    { path: '/api/(?!auth|hello)', handler: '~/middleware/auth.ts' },
  ],

  compatibilityDate: '2025-02-13',
};