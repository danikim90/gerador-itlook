# 🎨 Gerador de Descrições IT LOOK

Aplicativo web para gerar descrições automatizadas de produtos de moda usando IA.

---

## 📋 PASSO A PASSO PARA FAZER O DEPLOY

### **1. Obter API Key da Anthropic**

1. Acesse: https://console.anthropic.com/
2. Faça login ou crie uma conta
3. Vá em **API Keys** no menu lateral
4. Clique em **Create Key**
5. Copie a chave (começa com `sk-ant-...`)
6. **GUARDE BEM ESSA CHAVE!** Você vai precisar dela.

---

### **2. Preparar o Projeto**

#### **No seu computador:**

1. **Instale o Node.js** (se ainda não tiver):
   - Baixe em: https://nodejs.org/
   - Versão LTS (recomendada)

2. **Baixe este projeto** e extraia a pasta

3. **Abra o terminal/prompt** na pasta do projeto

4. **Instale as dependências:**
   ```bash
   npm install
   ```

5. **Teste localmente** (opcional):
   ```bash
   npm run dev
   ```
   - Abra http://localhost:5173
   - **IMPORTANTE:** Não vai funcionar ainda porque precisa da API Key configurada no Vercel

---

### **3. Fazer Deploy no Vercel**

#### **3.1 Criar conta no Vercel:**

1. Acesse: https://vercel.com/signup
2. Faça login com GitHub (recomendado) ou email

#### **3.2 Instalar Vercel CLI:**

```bash
npm install -g vercel
```

#### **3.3 Fazer login no Vercel:**

```bash
vercel login
```

#### **3.4 Deploy do projeto:**

Na pasta do projeto, rode:

```bash
vercel
```

O CLI vai perguntar algumas coisas:
- **Set up and deploy "..."?** → `Y` (sim)
- **Which scope?** → Escolha sua conta
- **Link to existing project?** → `N` (não)
- **What's your project's name?** → `gerador-itlook` (ou o nome que quiser)
- **In which directory is your code located?** → `.` (ponto)

Aguarde o deploy finalizar.

#### **3.5 Configurar a API Key:**

**MUITO IMPORTANTE:** Você precisa adicionar sua API Key da Anthropic como variável de ambiente.

**Opção A - Pelo Site (Recomendado):**

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto que você acabou de criar
3. Vá em **Settings** (Configurações)
4. Clique em **Environment Variables** (Variáveis de Ambiente)
5. Adicione uma nova variável:
   - **Name (Nome):** `ANTHROPIC_API_KEY`
   - **Value (Valor):** Cole sua API Key (começa com `sk-ant-...`)
   - **Environments:** Marque **Production**, **Preview** e **Development**
6. Clique em **Save**

**Opção B - Pelo Terminal:**

```bash
vercel env add ANTHROPIC_API_KEY
```

Quando perguntar:
- **What's the value of ANTHROPIC_API_KEY?** → Cole sua API Key
- **Add to which Environments?** → Selecione **Production** e **Preview**

#### **3.6 Fazer redeploy:**

Depois de adicionar a API Key, você precisa fazer redeploy:

```bash
vercel --prod
```

---

### **4. Pronto! 🎉**

Seu app está no ar! O Vercel vai te dar um link tipo:

```
https://gerador-itlook.vercel.app
```

**Compartilhe esse link com sua funcionária** e ela pode usar sem precisar do seu Claude!

---

## 🔒 SEGURANÇA

✅ **Sua API Key está protegida** - ela fica nos servidores do Vercel, não no código
✅ **Ninguém consegue ver sua chave** - nem sua funcionária
✅ **Você controla os gastos** - monitore o uso em https://console.anthropic.com/

---

## 💰 CUSTOS

- **Vercel:** Gratuito (plano Hobby)
- **Anthropic API:** Você paga por uso
  - Claude Sonnet 4: ~$3 por milhão de tokens de input
  - Cada descrição gasta ~1.000-3.000 tokens
  - Estimativa: 300-500 descrições por $1

**Monitore seu uso em:** https://console.anthropic.com/settings/billing

---

## 🔄 ATUALIZAÇÕES FUTURAS

Quando você quiser atualizar o app:

1. Faça as mudanças nos arquivos
2. Rode:
   ```bash
   vercel --prod
   ```

---

## 🆘 PROBLEMAS COMUNS

### "API Key não configurada"
→ Você esqueceu de adicionar a `ANTHROPIC_API_KEY` nas variáveis de ambiente do Vercel

### "Erro 401" ou "Unauthorized"
→ A API Key está incorreta. Verifique no console da Anthropic

### App muito lento
→ Normal na primeira requisição (cold start). As próximas são rápidas.

### "Command not found: vercel"
→ Rode `npm install -g vercel` novamente

---

## 📞 SUPORTE

- Documentação Vercel: https://vercel.com/docs
- Documentação Anthropic: https://docs.anthropic.com/

---

Feito com 💜 para IT LOOK
