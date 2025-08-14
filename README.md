# 💈 API Barbearia

API REST para gestão de barbearias, desenvolvida em **Node.js** com **Express** e **MongoDB**, oferecendo funcionalidades como agendamentos, bloqueio de horários, gerenciamento de serviços, painel do administrador, autenticação JWT e integração futura com WhatsApp Business API.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Token) para autenticação
- **Swagger** para documentação da API
- **Nodemailer** para envio de e-mails
- **WhatsApp Business API** (integração futura)
- **Bcrypt** para hash de senhas

---

## 📂 Estrutura de Pastas
```
src/
├── controllers/ # Lógica de negócio
├── models/ # Definições das collections do MongoDB
├── routes/ # Rotas da API
├── middlewares/ # Middlewares de autenticação e permissões
├── utils/ # Funções utilitárias
├── config/ # Configurações (DB, e-mail, etc.)
└── app.js # Configuração principal do servidor
```
---

## ⚙️ Instalação e Execução

1. **Clonar o repositório**
    ```bash```

        git clone https://github.com/seuusuario/api-barbearia.git
        cd api-barbearia

2. **Instalar as dependências**
    ```bash```

        npm install

3. **Configurar variáveis de ambiente**

    Copie o arquivo *.env.example* para *.env* e preencha com suas credenciais.

4. **Rodar o servidor**
    Ambiente de desenvolvimento:
    ```bash```
    
        npm run dev

    Ambiente de produção:
    ```bash```

        npm start

---

## 🔑 Variáveis de Ambiente

Arquivo *.env* (não subir para o GitHub)

```ini
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/barbearia

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.seuservidor.com
EMAIL_PORT=587
EMAIL_USER=seuemail@dominio.com
EMAIL_PASS=sua_senha

WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=000000000000000
WHATSAPP_ACCESS_TOKEN=seu_token
```
---

## 📖 Documentação da API

- **A documentação da API é gerada com Swagger.**

- **URL local:** http://localhost:3000/api-docs

- **URL prod:** https://api-bairro.onrender.com/api-docs

- **Rotas principais:**

    - **Auth:** /auth/register, /auth/login

    - **Usuários:** /usuarios (listar, buscar, editar, deletar)

    - **Serviços:** /servicos

    - **Agendamentos:** /agendamentos

    - **Bloqueios:** /bloqueios

    - **Admin:** /admin/painel

---

## 📌 Regras de Negócio Implementadas

- **Apenas BARBEIRO e ADMIN podem criar bloqueios.**

- **Apenas ADMIN pode acessar o painel administrativo.**

- **Agendamentos não podem ser feitos em horários bloqueados.**

- **Um barbeiro não pode criar dois bloqueios no mesmo horário.**

- **JWT é usado para autenticação em todas as rotas protegidas.**

- **Permissões baseadas em roles: CLIENTE, BARBEIRO, ADMIN.**