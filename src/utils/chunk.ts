const chunk = <T>(items: T[], chunkSize: number) => {
  const ar = Array(Math.ceil(items.length / chunkSize));
  return Array.from(ar, (_, i) => items.slice(i * chunkSize, i * chunkSize + chunkSize));
};

export default chunk;
