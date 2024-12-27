const checkRole = (requiredRole) => {
    return (req, res, next) => {
      const { role } = req.body; // Ideally, extract from a token after authentication
      if (role !== requiredRole) {
        return res.status(403).json({ message: 'Access Denied' });
      }
      next();
    };
  };
  
  module.exports = checkRole;
  