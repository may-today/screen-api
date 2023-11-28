//https://nitro.unjs.io/config
export default defineNitroConfig({
  preset: 'vercel-edge',
  routeRules: {
    "/**": {
      cors: true,
    },
  },
});
