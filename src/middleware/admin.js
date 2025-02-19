const admin = async (req, res, next) => {
  // For this example, we'll assume admin status is based on email domain
  // In a real application, you'd want to add an admin flag to the User model
  if (req.user.email.endsWith('@admin.com')) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required.' });
  }
};

module.exports = admin; 