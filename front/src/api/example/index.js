export const getExample = async () => {
  return fetch(`${import.meta.env.VITE_API_HOST}/example`);
};
