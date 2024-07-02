const chechPagination = (page, limit) => {
  const pagelimits = [10, 25, 50, 100];

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  if (!pagelimits.includes(limit)) {
    return res.status(400).json({ error: 'Invalid limit. Must be one of the following: 10, 25, 50, 100' });
  }

  return { page, limit };
}

export { chechPagination };
