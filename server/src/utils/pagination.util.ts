const getPagination = (page: number, limit: number) => {

  const pages = Math.max(page || 1, 1);
  const limits = Math.max(limit || 10, 1);

  const skip = (pages - 1) * limits;

  return {
    pages,
    limits,
    skip
  };
};

export default getPagination;