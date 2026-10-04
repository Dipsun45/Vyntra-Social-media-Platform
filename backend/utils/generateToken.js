const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'vyntra_super_secret_jwt_key_2026_prod',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
