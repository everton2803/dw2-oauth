# 🛠️ Scripts e Utilitários

Esta pasta contém scripts automáticos para facilitar o desenvolvimento.

## 📋 Scripts Disponíveis

### test-api.bat (Windows)
- **Sistema**: Windows apenas
- **O que faz**: Testa os endpoints da API
- **Como usar**:
  ```batch
  test-api.bat
  ```
- **Requer**: Servidor rodando (`npm run dev`)
- **Passo-a-passo**:
  1. Inicie o servidor: `npm run dev`
  2. Faça login normalmente no navegador
  3. Execute: `test-api.bat`
  4. Cole seu JWT token quando pedido
  5. Veja os testes rodar

---

### install.sh (Linux/Mac)
- **Sistema**: Linux e Mac
- **O que faz**: Instala dependências automaticamente
- **Como usar**:
  ```bash
  bash install.sh
  ```
- **O que acontece**:
  1. Verifica se Node.js está instalado
  2. Instala dependências npm
  3. Mostra próximos passos

---

## 🚀 Quando Usar Cada Um

| Situação | Script |
|----------|--------|
| Primeira vez instalando no Windows | `install.sh` ou manual |
| Quer testar a API rapidinho | `test-api.bat` |
| Tem dúvida de qual usar | Leia o arquivo! |

---

## 📝 Criando Novos Scripts

Quer criar seus próprios scripts? Coloque aqui!

**Exemplo de script bash (test.sh):**
```bash
#!/bin/bash
echo "Executando testes..."
npm test
```

**Exemplo de script batch (test.bat):**
```batch
@echo off
echo Executando testes...
npm test
```

---

## ⚠️ Permissões em Linux/Mac

Se o script não rodar, dê permissão:
```bash
chmod +x install.sh
chmod +x seu-script.sh
```

---

Pronto! Use os scripts para facilitar seu trabalho! 🚀
