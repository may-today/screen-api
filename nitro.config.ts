//https://nitro.unjs.io/config
export default defineNitroConfig({
  routeRules: {
    "/**": {
      cors: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  },
});
