const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Obter token do header ou cookie
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] || req.cookies?.token;

  console.log('🔍 Verificando token...');
  console.log('Auth Header:', authHeader ? 'Present' : 'Missing');
  console.log('Token:', token ? 'Present' : 'Missing');

  if (!token) {
    console.error('❌ Token não fornecido');
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    console.log('🔑 JWT_SECRET configurado:', process.env.JWT_SECRET ? 'Sim' : 'Não');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token validado para usuário:', decoded.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Erro ao validar token:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado: ' + error.message });
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = {
  verifyToken,
  isAuthenticated,
};
