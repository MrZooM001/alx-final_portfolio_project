
const checkUserRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access is denied' });
  }
  next();
};

export { checkUserRole };
