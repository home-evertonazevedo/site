# Problema CORS - Análise e Soluções

## 🚨 Problema Identificado

```
Access to XMLHttpRequest at 'https://api-lime-ten-14.vercel.app/api/raffles' 
from origin 'https://site-eta-nine-21.vercel.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 📋 Análise do Problema

**CORS (Cross-Origin Resource Sharing)** é uma política de segurança implementada pelos navegadores que bloqueia requisições entre diferentes origens (domínios, protocolos ou portas) a menos que o servidor explicitamente permita.

### Origens Envolvidas:
- **Frontend**: `https://site-eta-nine-21.vercel.app`
- **Backend API**: `https://api-lime-ten-14.vercel.app`

### Causa Raiz:
O servidor da API não está configurado para aceitar requisições da origem do frontend.

## ⚠️ Importante: CORS é Configurado no Servidor

**CORS deve ser configurado no backend (servidor da API), não no frontend (cliente).**

Os headers CORS como `Access-Control-Allow-Origin` devem ser enviados pelo **servidor** como resposta, não pelo cliente como requisição.

## 🛠️ Soluções Implementadas no Frontend

### 1. Configuração Otimizada do Axios
- ✅ Cliente HTTP centralizado (`apiClient.js`)
- ✅ Headers apropriados (`Content-Type`, `Accept`)
- ✅ Timeout configurado (15 segundos)
- ✅ Interceptors para logging e debug
- ✅ Tratamento de erros melhorado

### 2. Estrutura Modular
- ✅ `apiClient.js` - Configuração centralizada
- ✅ `authService.js` - Serviços de autenticação
- ✅ `raffleService.js` - Serviços de rifas

## 🔧 Soluções Necessárias no Backend

### Opção 1: Configurar CORS no Servidor da API

O servidor precisa adicionar os seguintes headers nas respostas:

```javascript
// Exemplo para Express.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://site-eta-nine-21.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### Opção 2: Usar Middleware CORS

```javascript
// Para Express.js
const cors = require('cors');

app.use(cors({
  origin: ['https://site-eta-nine-21.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
```

### Opção 3: Configurar no Vercel (vercel.json)

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://site-eta-nine-21.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Accept, Authorization"
        }
      ]
    }
  ]
}
```

## 🧪 Como Testar

### 1. Verificar Headers da Resposta
```bash
curl -I -X OPTIONS https://api-lime-ten-14.vercel.app/api/register \
  -H "Origin: https://site-eta-nine-21.vercel.app"
```

### 2. Verificar no DevTools
1. Abrir DevTools (F12)
2. Ir para Network
3. Fazer uma requisição
4. Verificar os headers da resposta

## 📊 Status Atual

### ✅ Implementado no Frontend:
- Configuração otimizada do axios
- Cliente HTTP centralizado
- Logging e debug melhorados
- Tratamento de erros robusto

### ❌ Pendente no Backend:
- Configuração dos headers CORS
- Permitir origem `https://site-eta-nine-21.vercel.app`
- Suporte a métodos HTTP necessários
- Tratamento de requisições OPTIONS (preflight)

## 🎯 Próximos Passos

1. **Configurar CORS no servidor da API** (responsabilidade do backend)
2. **Testar as requisições** após configuração
3. **Verificar todos os endpoints** (register, login, raffles, etc.)
4. **Documentar a configuração** para futura referência

---

**Nota**: Enquanto o CORS não for configurado no servidor, as requisições continuarão sendo bloqueadas pelo navegador como medida de segurança.
