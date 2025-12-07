# 🏗️ Sistema de Gerenciamento para Construtoras

Sistema completo para gestão de obras, estoque, fornecedores e controle financeiro desenvolvido como Trabalho de Conclusão de Curso (TCC).

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Modelo de Dados](#-modelo-de-dados)
- [Autor](#-autor)

---

## 📖 Sobre o Projeto

Este sistema foi desenvolvido para auxiliar construtoras no gerenciamento completo de suas operações, incluindo:

- Controle de múltiplas obras
- Gestão de estoque por obra
- Cadastro e acompanhamento de fornecedores
- Controle de entradas e saídas de materiais
- Transferência de materiais entre obras
- Gestão de orçamentos
- Acompanhamento de fases das obras
- Cotações de produtos
- Histórico de alterações para auditoria

---

## ✨ Funcionalidades

### 👷 Gestão de Obras

- Cadastro de obras com informações detalhadas
- Upload de fotos das obras (integração com Cloudinary)
- Controle de status (ativa, pausada, concluída)
- Definição de responsável por obra
- Acompanhamento de fases e progresso

### 📦 Controle de Estoque

- Estoque centralizado e por obra
- Entradas com nota fiscal e fornecedor
- Saídas vinculadas a obras específicas
- Transferências entre obras
- Histórico completo de movimentações

### 🏢 Gestão de Fornecedores

- Cadastro completo (CNPJ, contato, endereço)
- Vinculação com entradas de materiais
- Cotações de preços por fornecedor

### 💰 Controle Financeiro

- Orçamento por obra
- Cotações de produtos
- Relatórios de custos

### 👥 Gestão de Usuários

- Níveis de acesso (normal/admin)
- Autenticação JWT
- Controle de permissões

---

## 🛠️ Tecnologias Utilizadas

### Back-end

| Tecnologia        | Versão | Descrição                 |
| ----------------- | ------ | ------------------------- |
| Node.js           | -      | Runtime JavaScript        |
| Express           | 4.21.2 | Framework web             |
| Prisma            | 6.5.0  | ORM para banco de dados   |
| PostgreSQL        | 15     | Banco de dados relacional |
| JWT               | 9.0.2  | Autenticação              |
| Bcrypt            | 3.0.2  | Hash de senhas            |
| Cloudinary        | 1.41.3 | Armazenamento de imagens  |
| Multer            | 2.0.2  | Upload de arquivos        |
| Express Validator | 7.2.1  | Validação de dados        |

### Front-end

| Tecnologia   | Versão | Descrição                |
| ------------ | ------ | ------------------------ |
| Next.js      | 15.5.2 | Framework React          |
| React        | 19.1.0 | Biblioteca UI            |
| Tailwind CSS | 4      | Framework CSS            |
| Recharts     | 3.4.1  | Gráficos e visualizações |
| JWT Decode   | 4.0.0  | Decodificação de tokens  |

### DevOps

| Tecnologia     | Descrição                  |
| -------------- | -------------------------- |
| Docker         | Containerização            |
| Docker Compose | Orquestração de containers |

---

## 🏛️ Arquitetura do Sistema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Front-end    │────▶│    Back-end     │────▶│   PostgreSQL    │
│   (Next.js)     │     │   (Express)     │     │                 │
│   Port: 3000    │     │   Port: 5000    │     │   Port: 5432    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │   Cloudinary    │
                        │   (Imagens)     │
                        │                 │
                        └─────────────────┘
```

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)
- Conta no [Cloudinary](https://cloudinary.com/) (para upload de imagens)

---

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/matheusivi/appContrucaoTcc.git
cd appContrucaoTcc
```

### 2. Configuração do Back-end

```bash
cd back-end

# Instalar dependências
npm install

# Criar arquivo .env
```

Crie um arquivo `.env` na pasta `back-end` com as seguintes variáveis:

```env
DATABASE_URL="postgresql://matheus:12345678@localhost:5432/construtora?schema=public"
JWT_SECRET="sua_chave_secreta_jwt"
```

### 3. Configuração do Front-end

```bash
cd front-end

# Instalar dependências
npm install
```

### 4. Iniciar com Docker Compose

Na raiz do projeto:

```bash
# Subir todos os serviços
docker-compose up -d

# Executar migrations do Prisma
cd back-end
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate
```

### 5. Executar manualmente (sem Docker)

**Terminal 1 - Banco de dados:**

```bash
docker-compose up postgres -d
```

**Terminal 2 - Back-end:**

```bash
cd back-end
npm start
```

**Terminal 3 - Front-end:**

```bash
cd front-end
npm run dev
```

### 6. Acessar a aplicação

- **Front-end:** http://localhost:3000
- **Back-end API:** http://localhost:5000

---

## 📁 Estrutura do Projeto

```
appContrucaoTcc/
├── 📁 back-end/
│   ├── 📁 config/           # Configurações (Cloudinary)
│   ├── 📁 prisma/
│   │   ├── schema.prisma    # Schema do banco de dados
│   │   └── 📁 migrations/   # Migrations do Prisma
│   ├── 📁 src/
│   │   ├── 📁 controllers/  # Controladores das rotas
│   │   ├── 📁 middlewares/  # Middlewares (auth, validação, upload)
│   │   ├── 📁 routes/       # Definição das rotas
│   │   ├── 📁 services/     # Lógica de negócio
│   │   └── index.js         # Entrada da aplicação
│   ├── Dockerfile
│   └── package.json
│
├── 📁 front-end/
│   ├── 📁 public/           # Arquivos estáticos
│   ├── 📁 src/
│   │   └── 📁 app/
│   │       ├── 📁 components/   # Componentes reutilizáveis
│   │       ├── 📁 hooks/        # Custom hooks
│   │       ├── 📁 fornecedores/ # Página de fornecedores
│   │       ├── 📁 obras/        # Listagem de obras
│   │       ├── 📁 obra/         # Detalhes da obra
│   │       ├── 📁 nova-obra/    # Cadastro de obra
│   │       ├── 📁 produtos/     # Página de produtos
│   │       ├── 📁 login/        # Autenticação
│   │       └── 📁 register/     # Cadastro de usuário
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint         | Descrição           |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/login`    | Login de usuário    |
| POST   | `/auth/register` | Cadastro de usuário |

### Obras

| Método | Endpoint     | Descrição             |
| ------ | ------------ | --------------------- |
| GET    | `/obras`     | Listar todas as obras |
| GET    | `/obras/:id` | Buscar obra por ID    |
| POST   | `/obras`     | Criar nova obra       |
| PUT    | `/obras/:id` | Atualizar obra        |
| DELETE | `/obras/:id` | Deletar obra          |

### Produtos

| Método | Endpoint        | Descrição                |
| ------ | --------------- | ------------------------ |
| GET    | `/produtos`     | Listar todos os produtos |
| GET    | `/produtos/:id` | Buscar produto por ID    |
| POST   | `/produtos`     | Criar novo produto       |
| PUT    | `/produtos/:id` | Atualizar produto        |
| DELETE | `/produtos/:id` | Deletar produto          |

### Fornecedores

| Método | Endpoint            | Descrição                    |
| ------ | ------------------- | ---------------------------- |
| GET    | `/fornecedores`     | Listar todos os fornecedores |
| GET    | `/fornecedores/:id` | Buscar fornecedor por ID     |
| POST   | `/fornecedores`     | Criar novo fornecedor        |
| PUT    | `/fornecedores/:id` | Atualizar fornecedor         |
| DELETE | `/fornecedores/:id` | Deletar fornecedor           |

### Estoque

| Método | Endpoint                    | Descrição               |
| ------ | --------------------------- | ----------------------- |
| GET    | `/entradas`                 | Listar entradas         |
| POST   | `/entradas`                 | Registrar entrada       |
| GET    | `/saidas`                   | Listar saídas           |
| POST   | `/saidas`                   | Registrar saída         |
| GET    | `/transferencias`           | Listar transferências   |
| POST   | `/transferencias`           | Registrar transferência |
| GET    | `/estoque-por-obra/:obraId` | Estoque de uma obra     |

### Outros

| Método   | Endpoint      | Descrição               |
| -------- | ------------- | ----------------------- |
| GET/POST | `/fases`      | Gerenciar fases da obra |
| GET/POST | `/cotacoes`   | Gerenciar cotações      |
| GET/POST | `/orcamentos` | Gerenciar orçamentos    |
| GET      | `/relatorios` | Gerar relatórios        |
| GET/PUT  | `/usuarios`   | Gerenciar usuários      |

---

## 🗄️ Modelo de Dados

### Diagrama de Entidades

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   usuarios   │       │    obras     │       │  fornecedores│
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │◄──────│ responsavel  │       │ id           │
│ nome         │       │ id           │       │ nome         │
│ email        │       │ nome         │       │ cnpj         │
│ senha        │       │ endereco     │       │ telefone     │
│ cargo        │       │ data_inicio  │       │ email        │
│ nivel_acesso │       │ status       │       └──────┬───────┘
└──────┬───────┘       └──────┬───────┘              │
       │                      │                      │
       │       ┌──────────────┼──────────────┐       │
       │       │              │              │       │
       ▼       ▼              ▼              ▼       ▼
┌──────────────┐       ┌──────────────┐    ┌──────────────┐
│   entradas   │       │estoque_obra  │    │   cotacoes   │
├──────────────┤       ├──────────────┤    ├──────────────┤
│ produto_id   │       │ obra_id      │    │ produto_id   │
│ fornecedor_id│       │ produto_id   │    │ fornecedor_id│
│ quantidade   │       │ quantidade   │    │ preco        │
│ preco_unit   │       └──────────────┘    └──────────────┘
└──────────────┘
       │
       ▼
┌──────────────┐       ┌──────────────┐
│   produtos   │◄──────│    saidas    │
├──────────────┤       ├──────────────┤
│ id           │       │ produto_id   │
│ nome         │       │ obra_id      │
│ descricao    │       │ quantidade   │
│ unid_medida  │       │ usuario_id   │
│ qtd_atual    │       └──────────────┘
└──────────────┘
```

---

## 📊 Scripts Disponíveis

### Back-end

```bash
npm start      # Inicia o servidor com nodemon
```

### Front-end

```bash
npm run dev    # Inicia em modo desenvolvimento
npm run build  # Gera build de produção
npm run start  # Inicia servidor de produção
npm run lint   # Executa o linter
```

### Prisma

```bash
npx prisma migrate dev     # Executa migrations
npx prisma generate        # Gera Prisma Client
npx prisma studio          # Interface visual do banco
```

---

## 🔐 Variáveis de Ambiente

### Back-end (.env)

```env
DATABASE_URL=            # URL de conexão PostgreSQL
JWT_SECRET=              # Chave secreta para JWT
```

### Front-end (.env.local)

```env
NEXT_PUBLIC_API_URL=     # URL da API (ex: http://localhost:5000)
```

---

## 👨‍💻 Autor

**Matheus Ivi**

- GitHub: [@matheusivi](https://github.com/matheusivi)

---

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) e está disponível para fins educacionais.

---

<p align="center">
  Desenvolvido com ❤️ para o TCC
</p>
