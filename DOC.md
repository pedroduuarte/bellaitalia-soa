# 📄 Documento Técnico — Estrutura de Pastas e Arquitetura  
**Projeto: Pizzaria BellaItália**  
**Arquitetura: SOA (Service-Oriented Architecture)**  
**Tecnologias: Node.js, Express, HTML, CSS, JavaScript**

---

## 📌 Objetivo

Este documento apresenta a estrutura do projeto da pizzaria **BellaItália**, com base na arquitetura orientada a serviços (**SOA**), em que cada funcionalidade principal será desenvolvida como um serviço separado.

---

## 🧱 Arquitetura Geral (SOA)

- Cada **serviço** é um projeto Node.js independente com sua própria API REST.
- O **frontend** será separado, consumindo os serviços por meio de chamadas HTTP.
- O código reutilizável entre os serviços estará em uma pasta `shared/`.

---

## 🗂️ Estrutura de Pastas

```plaintext
bella-italia/
│
├── frontend/                 # Interface web (HTML/CSS/JS)
│   ├── public/               # Arquivos estáticos
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── views/                # Páginas HTML
│   └── server.js             # Servidor do frontend (opcional)
│
├── services/                 # Microserviços independentes
│   ├── auth-service/         # Cadastro, login e autenticação
│   ├── menu-service/         # Gerenciamento de cardápio
│   ├── order-service/        # Criação e acompanhamento de pedidos
│   ├── payment-service/      # Simulação de pagamentos
│   └── delivery-service/     # Rastreamento de entregas
│
├── shared/                   # Código reutilizável
│   ├── database/             # Conexão com o banco de dados
│   ├── middleware/           # Autenticação, validações
│   └── utils/                # Funções auxiliares
│
└── README.md                 # Documentação do projeto
```


## 🔌 Como funcionará cada parte

### 🔧 Serviços (services/)
### Cada serviço tem:

Seu próprio app.js (servidor Express)

Suas rotas (routes/)

Seus controladores (controller/)

Seus modelos (models/)

Um .env com variáveis de ambiente e porta

Eles são independentes e comunicam-se via HTTP.

## 💻 Frontend

Feito com HTML, CSS e JS puro.

Servirá as páginas da pizzaria (menu, login, pedidos, etc).

Fará chamadas HTTP (via fetch ou axios) para os serviços.

## ♻️ Pasta `shared`

Centraliza códigos que podem ser reaproveitados entre os serviços, como:

Conexão com banco de dados

Middleware de autenticação

Helpers e funções utilitárias

## 🚀 Execução do Projeto (sem Docker)

Para rodar localmente:

Acesse a pasta de cada serviço.

Rode npm install.

Execute com node app.js ou nodemon app.js.

O frontend pode ser executado da mesma forma (porta 3000, por exemplo).

Cada serviço ficará disponível em uma porta diferente (ex: 3001, 3002...).

## ✅ Conclusão

Esta estrutura permite:

Escalabilidade (serviços independentes)

Reutilização de código

Facilidade de manutenção

Organização clara para equipe