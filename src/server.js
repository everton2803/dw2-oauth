require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const routes = require('./routes');

const app = express();

// Inicializar banco de dados
db.initDatabase();

// Configuração de Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Configuração de Sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // True em produção com HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  },
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar Estratégia Google OAuth
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Processando login do Google para:', profile.emails[0].value);
      
      // Encontrar ou criar usuário no banco de dados
      const user = await db.findOrCreateUser(
        profile.id,
        profile.displayName,
        profile.emails[0].value,
        profile.photos[0]?.value
      );
      
      console.log('✅ Usuário processado:', user.email);
      return done(null, user);
    } catch (error) {
      console.error('❌ Erro ao processar usuário Google:', error.message);
      return done(error);
    }
  }
));

// Serializar usuário
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserializar usuário
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (error) {
    console.error('❌ Erro ao desserializar usuário:', error.message);
    done(error);
  }
});

// Usar rotas
app.use('/', routes);

// Rota de healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'API está funcionando' });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Acesse http://localhost:${PORT} para fazer login\n`);
});
