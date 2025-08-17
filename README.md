# 💈 API Barbearia

API REST para gestão de barbearias, desenvolvida em **Node.js** com **Express** e **MongoDB**, oferecendo funcionalidades como:
- 📅 Agendamento de horários

- ⛔ Bloqueio de horários

- ✂️ Gerenciamento de serviços

- 📊 Painel administrativo

- 🔐 Autenticação com JWT

- 💬 Integração futura com WhatsApp Business API

- ✅ Controle de status de agendamento (AGENDADO, CANCELADO, CONCLUIDO, manual ou automático)

---

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Token) para autenticação
- **Swagger** para documentação da API
- **Nodemailer** para envio de e-mails
- **WhatsApp Business API** (integração futura)
- **Bcrypt** para hash de senhas
- **Node-cron** (para jobs automáticos de atualização de status)

---

## 📂 Estrutura de Pastas
```
src/
├── controllers/ # Lógica de negócio
├── jobs/
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

    - **Horários (Schedule)** /schedule – criar, listar, editar, excluir horários

        - Somente **BARBEIRO** e **ADMIN** podem criar

        - Horários são vinculados ao barbeiro

        - Apenas o dono do horário ou ADMIN podem editar/excluir

        - Horários são utilizados para agendamento de clientes

    - **Agendamentos:** /agendamentos

    - **Bloqueios:** /bloqueios

    - **Admin:** /admin/painel

---

## 📌 Regras de Negócio Implementadas

- **Permissões baseadas em roles: CLIENTE, BARBEIRO, ADMIN**

- **Apenas BARBEIRO e ADMIN podem criar bloqueios e horários**

- **Horários (Schedule) criados por um barbeiro são exclusivos dele**

- **Agendamentos só podem ser feitos em horários disponíveis e não bloqueados**

- **Atualização de status de agendamento pode ser manual (barbeiro) ou automática via job**

- **Cancelamento de agendamento deve respeitar regra de antecedência mínima**

- **JWT é usado em todas as rotas protegidas**

- **Painel administrativo acessível apenas para ADMIN**

- **Horários bloqueados atualizam automaticamente o isDisponivel do Schedule**