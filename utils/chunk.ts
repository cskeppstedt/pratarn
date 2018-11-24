const chunk = <T>(items: T[], chunkSize: number) => {
  return Array.from(Array(Math.ceil(items.length / chunkSize)), (_, i) =>
    items.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
};

export default chunk;
