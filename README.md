# 🔐 OAuth Authentication App - Autenticação com Google

Aplicação web completa com **autenticação OAuth 2.0 Google**, **JWT**, **banco de dados SQLite** e **área protegida**.

---

## 📋 Características

✅ **Login com Google OAuth 2.0** — Autenticação segura via Google  
✅ **JWT Tokens** — Geração com expiração de 24 horas  
✅ **SQLite Database** — Persistência de usuários e sessões  
✅ **Dashboard Protegido** — Área restrita com autenticação obrigatória  
✅ **Lista de Usuários** — Visualizar usuários logados  
✅ **Sessões Ativas** — Contar conexões ativas  
✅ **Logout Seguro** — Limpeza automática de sessões  
✅ **Interface Responsiva** — Design moderno e intuitivo  

---

## 🔧 Instalação Completa

### Pré-requisitos

- **Node.js v14+** ([Baixar](https://nodejs.org/))
- **npm ou yarn**
- **Conta Google** para OAuth

### Passo 1: Obter Credenciais do Google

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Vá para **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
5. Selecione **Web application**
6. Adicione `http://localhost:3000/auth/google/callback` em **Authorized redirect URIs**
7. Copie **Client ID** e **Client Secret**

### Passo 2: Configurar .env

Crie arquivo `.env` na raiz do projeto:

```env
GOOGLE_CLIENT_ID=576352942482-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=minha_chave_jwt_muito_secreta_mude_isto_em_producao
SESSION_SECRET=minha_chave_sessao_muito_secreta_mude_isto_em_producao
PORT=3000
NODE_ENV=development
```

### Passo 3: Instalar e Rodar

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (com auto-reload)
npm run dev

# Ou modo produção
npm start
```

A aplicação estará em: **http://localhost:3000**

---

## 📱 Fluxo da Aplicação

```
┌─────────────────────────┐
│ 1. Usuário acessa login │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│ 2. Clica "Login Google" │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│ 3. Redireciona para     │
│    Google (OAuth)       │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│ 4. Usuário autoriza     │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ 5. Google redireciona para callback     │
│    /auth/google/callback?code=...       │
└────────────┬─────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ 6. Servidor cria/atualiza usuário       │
└────────────┬─────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ 7. Gera JWT token (24 horas)            │
└────────────┬─────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ 8. Redireciona para dashboard com token  │
└────────────┬──────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│ 9. Dashboard carrega e exibe perfil      │
└──────────────────────────────────────────┘
```

---

## 📂 Estrutura do Projeto

```
projeto/
├── public/                  # Frontend
│   ├── index.html          # Página de login
│   └── dashboard.html      # Área protegida
│
├── src/                    # Backend
│   ├── server.js           # Servidor Express
│   ├── routes.js           # Rotas da API
│   ├── database.js         # SQLite functions
│   └── middleware.js       # JWT validation
│
├── scripts/                # Ferramentas
│   └── test-api.bat        # Testes
│
├── .env                    # Variáveis (gitignore)
├── .env.example            # Exemplo
├── .gitignore              # Git config
├── package.json            # Dependências
└── users.db                # Database (local)
```

---

## 🔐 API Reference

### 🔓 Autenticação

#### 1. Iniciar Login Google
```http
GET /auth/google
```
Redireciona para Google para fazer login.

#### 2. Callback Google (Automático)
```http
GET /auth/google/callback?code=...&state=...
```
Google redireciona aqui. Retorna JWT na URL.

---

### 👤 Usuário Autenticado

#### 3. Obter Dados do Usuário
```http
GET /api/user
Authorization: Bearer SEU_JWT_TOKEN
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "displayName": "João Silva",
  "email": "joao@example.com",
  "photo": "https://...",
  "createdAt": "2024-04-18T10:30:00Z",
  "lastLogin": "2024-04-18T15:45:30Z"
}
```

**Curl:**
```bash
curl -H "Authorization: Bearer seu_token_aqui" \
     http://localhost:3000/api/user
```

---

### 👥 Usuários e Sessões

#### 4. Listar Todos os Usuários
```http
GET /api/users
Authorization: Bearer SEU_JWT_TOKEN
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "displayName": "João Silva",
    "email": "joao@example.com",
    "photo": "https://...",
    "createdAt": "2024-04-18T10:30:00Z",
    "lastLogin": "2024-04-18T15:45:30Z"
  }
]
```

#### 5. Contar Sessões Ativas
```http
GET /api/active-sessions
Authorization: Bearer SEU_JWT_TOKEN
```

**Resposta (200 OK):**
```json
{
  "count": 5
}
```

#### 6. Fazer Logout
```http
POST /api/logout
Authorization: Bearer SEU_JWT_TOKEN
```

**Resposta (200 OK):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

#### 7. Health Check
```http
GET /api/health
```

**Resposta (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2024-04-18T10:30:00Z"
}
```

---

## 🏗️ Arquitetura

### Componentes Principais

```
┌──────────────────────────────────────────────────┐
│               Cliente (Navegador)                 │
│  ┌────────────────────────────────────────────┐  │
│  │ index.html        - Página de login        │  │
│  │ dashboard.html    - Área protegida         │  │
│  └────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────┘
                 │ HTTP
                 ↓
┌──────────────────────────────────────────────────┐
│        Servidor (Node.js + Express)              │
│  ┌────────────────────────────────────────────┐  │
│  │ server.js        - Servidor principal      │  │
│  │ routes.js        - Rotas da API            │  │
│  │ middleware.js    - Validação JWT           │  │
│  │ database.js      - SQLite functions        │  │
│  └────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────┘
                 │ SQL
                 ↓
┌──────────────────────────────────────────────────┐
│       Banco de Dados (SQLite)                    │
│  ┌──────────────┐    ┌────────────────────────┐ │
│  │ users        │    │ sessions               │ │
│  │ - id         │    │ - id                   │ │
│  │ - googleId   │    │ - userId (FK)          │ │
│  │ - displayName│    │ - token                │ │
│  │ - email      │    │ - createdAt            │ │
│  │ - photo      │    │ - expiresAt            │ │
│  │ - createdAt  │    └────────────────────────┘ │
│  │ - lastLogin  │                               │
│  └──────────────┘                               │
└──────────────────────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Google OAuth 2.0                            │
│  - Autentica usuários                            │
│  - Fornece dados do perfil                       │
│  - Retorna authorization code                    │
└──────────────────────────────────────────────────┘
```

### Tecnologias

- **Backend:** Node.js, Express.js 4.18+
- **Autenticação:** Passport.js 0.6+, Passport-Google-OAuth20
- **Tokens:** jsonwebtoken 9.0+
- **Banco:** SQLite3 5.1+
- **Utilidades:** dotenv, cors, express-session

---

## 📚 Principais Arquivos

### src/server.js
Servidor Express principal. Configura:
- Passport com estratégia Google OAuth
- Middleware de CORS, JSON, sessão
- Serialização de usuário
- Tratamento de erros global

### src/routes.js
Rotas da API:
- `GET /auth/google` - Iniciar login
- `GET /auth/google/callback` - Callback
- `GET /api/user` - Dados do usuário
- `GET /api/users` - Listar usuários
- `GET /api/active-sessions` - Contar sessões
- `POST /api/logout` - Fazer logout
- `GET /api/health` - Health check

### src/database.js
Operações SQLite:
- `initDatabase()` - Cria tabelas
- `findOrCreateUser()` - CRUD usuários
- `createSession()` - Gerencia sessões
- `getSessionByToken()` - Valida tokens
- `deleteSession()` - Logout

### src/middleware.js
Middleware de autenticação:
- `verifyToken()` - Valida JWT
- `isAuthenticated()` - Alternativa

### public/index.html
Página de login com botão Google OAuth.

### public/dashboard.html
Dashboard protegido que exibe:
- Dados do usuário autenticado
- Lista de usuários logados
- Token JWT
- Botão de logout

---

## 🧪 Testando a Aplicação

### No Terminal

```bash
# Health check
curl http://localhost:3000/api/health

# Obter usuário (com token)
curl -H "Authorization: Bearer seu_token_aqui" \
     http://localhost:3000/api/user

# Listar usuários
curl -H "Authorization: Bearer seu_token_aqui" \
     http://localhost:3000/api/users
```

### No Navegador

1. Abra `http://localhost:3000`
2. Clique em "Login com Google"
3. Autorize a aplicação
4. Você será redirecionado para `/dashboard?token=...`
5. Veja seus dados de perfil
6. Clique em "Logout"

---