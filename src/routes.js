const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { isAuthenticated, verifyToken } = require('./middleware');
const db = require('./database');

const router = express.Router();

// Rota de login (renderiza página de login)
router.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  console.log('📄 Servindo index.html de:', indexPath);
  res.sendFile(indexPath);
});

// Rota de debug (sem autenticação)
router.get('/api/debug', (req, res) => {
  res.json({
    jwt_secret_configured: !!process.env.JWT_SECRET,
    jwt_secret_length: process.env.JWT_SECRET?.length || 0,
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    timestamp: new Date().toISOString(),
  });
});

// Iniciar autenticação Google
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Callback do Google
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed' }),
  async (req, res) => {
    try {
      // Gerar JWT
      const token = jwt.sign(
        {
          id: req.user.id,
          googleId: req.user.googleId,
          email: req.user.email,
          displayName: req.user.displayName,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Criar sessão no banco de dados
      await db.createSession(req.user.id, token, 24 * 60 * 60 * 1000); // 24 horas

      // Redirecionar para dashboard com token
      res.redirect(`/dashboard?token=${token}`);
    } catch (error) {
      console.error('Erro no callback do Google:', error);
      res.status(500).json({ error: 'Erro ao processar login: ' + error.message });
    }
  }
);

// Obter dados do usuário autenticado
router.get('/api/user', verifyToken, async (req, res) => {
  try {
    console.log('📋 Requisição GET /api/user para usuário:', req.user?.id);
    const user = await db.getUserById(req.user.id);
    if (!user) {
      console.error('❌ Usuário não encontrado:', req.user.id);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    console.log('✅ Retornando dados do usuário:', user.email);
    res.json({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      photo: user.photo,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message });
  }
});

// Listar todos os usuários logados
router.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Obter contagem de sessões ativas
router.get('/api/active-sessions', verifyToken, async (req, res) => {
  try {
    const count = await db.getActiveSessionsCount();
    res.json({ activeSessions: count });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sessões ativas' });
  }
});

// Logout
router.post('/api/logout', verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await db.deleteSession(token);
    }
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer logout' });
  }
});

// Servir dashboard (área protegida)
router.get('/dashboard', (req, res) => {
  const dashboardPath = path.join(__dirname, '../public/dashboard.html');
  console.log('📄 Servindo dashboard.html de:', dashboardPath);
  res.sendFile(dashboardPath, (err) => {
    if (err) {
      console.error('❌ Erro ao servir dashboard:', err.message);
      res.status(500).json({ error: 'Erro ao carregar dashboard: ' + err.message });
    }
  });
});

module.exports = router;
