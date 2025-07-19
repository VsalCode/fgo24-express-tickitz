const jwt = require('jsonwebtoken');
const { constants: http } = require("http2");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Akses ditolak. Token tidak disediakan.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Format token tidak valid.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({ message: 'Token tidak memiliki userId yang valid.' });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role; 
    next();

} catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Token kadaluarsa.' });
    }
    return res.status(http.HTTP_STATUS_FORBIDDEN).json({ message: 'Token tidak valid.' });
  }
};

module.exports = {
  verifyToken,
};