export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  // ... Do whatever you want here
  return {
    config: config,
  };
});
