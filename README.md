# 📊 Case Técnico – Gestão de Clientes e Ativos Financeiros

Este projeto é um _case técnico_ de frontend desenvolvido para Anka Tech. O objetivo principal é fornecer uma interface intuitiva e eficiente para a **gestão de clientes** e a **visualização detalhada da alocação de ativos financeiros** para cada um deles. Construído com `Next.js` e `TypeScript`, esta aplicação demonstra um fluxo completo de interação com um backend para manipulação de dados.

## ✨ Visão Geral

No mercado de investimentos, a capacidade de gerenciar informações de clientes e seus respectivos portfólios de ativos é crucial. Este projeto aborda essa necessidade, oferecendo:

- **Cadastro e listagem de clientes**: Para organizar a base de dados de investidores.
- **Visualização e alocação de ativos por cliente**: Uma funcionalidade essencial para acompanhar a diversificação e o desempenho dos investimentos.

A interface foi pensada para ser _simples, funcional e responsiva_, focando na experiência do usuário e na facilidade de acesso às informações.

## 🚀 Funcionalidades Principais

A aplicação oferece as seguintes capacidades:

- **Clientes**:

  - **Listagem Completa**: Visualize todos os clientes cadastrados com suas informações básicas (nome, e-mail, status).
  - **Criação de Novos Clientes**: Adicione novos clientes à base de dados com facilidade.
  - **Edição de Informações**: Atualize dados de clientes existentes, como nome ou status (ativo/inativo).
  - **Exclusão de Clientes**: Remova clientes do sistema (com validação para evitar exclusões acidentais).

- **Ativos por Cliente (`/clients/{id}`)**:
  - **Visualização Detalhada**: Ao selecionar um cliente, acesse uma página dedicada (`/clients/{id}`) que exibe todos os ativos financeiros alocados a ele.
  - **Alocação de Ativos**: Adicione novos ativos ao portfólio de um cliente específico.
  - **Gerenciamento de Alocações**: Edite ou remova alocações de ativos existentes para um determinado cliente.

## 🛠️ Tecnologias Utilizadas

- **Next.js**
- **TypeScript**
- **ShadCN UI**
- **React Query**
- **React Hook Form + Zod**
- **Axios**
- **Tailwind CSS**

## ⚙️ Instalação e Execução

### Pré-requisitos

- Node.js (versão LTS)
- npm ou yarn

### Clonando o Repositório

```bash
git clone https://github.com/VHAlvesS/caseAnka-frontend.git
cd caseAnka-frontend
```

### Instalando Dependências

```bash
npm install
# ou
yarn install
```

### Rodando a Aplicação

⚠️ **O backend roda na porta 3000 (via Docker)**. Para evitar conflito, use o script abaixo para rodar o frontend na porta 3001:

```bash
npm run dev:3001
# ou
yarn dev:3001
```

Esse script utiliza:

```json
"dev:3001": "cross-env PORT=3001 next dev"
```

Acesse [http://localhost:3001](http://localhost:3001) no navegador.

## 🧩 Estrutura do Projeto

```
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── app/
│   │   ├── clients/
│   │   │   ├── page.tsx         # Lista e cria clientes
│   │   │   └── [id].tsx          # Página de alocações e ativos
│   │   └── page.tsx
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```
