## 💈 API Barbearia — Gestão Completa de Barbearias

API REST robusta para gestão de barbearias, desenvolvida com **Node.js**, **Express** e **MongoDB**, oferecendo controle total sobre agendamentos, bloqueios de horários, planos de assinatura, serviços, notificações, e painéis administrativos.


## ✨ Funcionalidades Principais

- 📅 Agendamento de horários

- ⛔ Bloqueio de horários

- ✂️ Gerenciamento de serviços

- 🧍‍♂️ Cadastro e autenticação de usuários

- 🔐 Autenticação via JWT

- 📊 Painel administrativo — métricas, relatórios e controle de usuários

- 🔁 Atualização automática de status de agendamento via node-cron

- 📧 Envio de notificações por e-mail (via Nodemailer)

- 🧠 Atualização de dados do usuário autenticado com verificação de token

- 🧩 Permissões por papel (role-based access control)

## 🧱 Arquitetura e Tecnologias

- Node.js + Express — servidor e API REST

- MongoDB + Mongoose — banco de dados e models

- JWT (JSON Web Token) — autenticação segura

- Brevo — envio de e-mails de confirmação e aviso

- Node-cron — tarefas automáticas (cron jobs)

- Swagger — documentação interativa da API

- Bcrypt — criptografia de senhas

- Dotenv — gerenciamento seguro de variáveis de ambiente

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Token) para autenticação
- **Swagger** para documentação da API
- **Nodemailer** para envio de e-mails
- **WhatsApp Business API** (integração futura)
- **Bcrypt** para hash de senhas
- **Node-cron** (para jobs automáticos de atualização de status)


## 📂 Estrutura de Pastas
```
src/
|   ├── controllers/ # Lógica de negócio
|   ├── jobs/
|   ├── models/ # Definições das collections do MongoDB
|   ├── routes/ # Rotas da API
|   ├── middlewares/ # Middlewares de autenticação e permissões
|   ├── utils/ # Funções utilitárias
├── config/ # Configurações (DB, e-mail, etc.)
└── app.js # Configuração principal do servidor
```

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

## 📖 Documentação da API

- **A documentação da API é gerada com Swagger.**

- **URL local:** http://localhost:3000/api-docs

- **URL prod:** https://sandbox-back-end-integration.onrender.com/api-docs