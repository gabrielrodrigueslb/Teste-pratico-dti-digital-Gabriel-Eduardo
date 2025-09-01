# Sistema de Entregas com Drones – Desafio Técnico dti digital

Este projeto foi desenvolvido como parte do processo seletivo da **dti digital (Enterprise Hakuna)**.  
O desafio consistia em **simular a operação de drones urbanos para entregas**, aplicando regras de capacidade, distância e prioridade de pacotes, com o objetivo de minimizar o número de viagens realizadas.

---

## 📦 Visão Geral

O sistema gerencia todo o ciclo de entregas, desde o cadastro dos pacotes até a alocação e simulação do voo dos drones.  
Ele é composto por:

- **Backend (Node.js + Express + Prisma + SQLite):** responsável pela lógica de negócio, regras de alocação e API RESTful.  
- **Frontend (React + Vite + Tailwind + TypeScript):** painel administrativo para monitoramento em tempo real das entregas e drones.  

---

## ✨ Funcionalidades

### 🔹 Backend
- **Gerenciamento de Drones e Pacotes:** CRUD completo.  
- **Algoritmo de Alocação Inteligente:** distribui pacotes para drones considerando:
  - Prioridade da entrega (Alta, Média, Baixa);  
  - Capacidade máxima de peso e distância de cada drone;  
  - Nível de bateria disponível.  
- **Simulação de Estados:** drones e pacotes passam por estados como `IDLE`, `IN_FLIGHT`, `IN_TRANSIT`, `DELIVERED`, etc.  
- **API RESTful:** endpoints bem definidos para integração com o frontend.  

### 🔹 Frontend
- **Dashboard em Tempo Real:** visão geral das entregas (pendentes, em trânsito, concluídas) e status da frota.  
- **Gestão de Pedidos:** listagem com filtros por status e atributos.  
- **Gestão de Drones:** monitoramento de status, bateria e capacidade.  
- **Modais Interativos:** criação de pacotes e drones sem sair da página.  
- **Alocação com 1 Clique:** botão que dispara o algoritmo de alocação, com feedback instantâneo ao usuário.  

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express, Prisma, SQLite  
- **Frontend:** React, TypeScript, Vite, Tailwind CSS  
- **Testes:** Jest, Supertest  
- **Dev Tools:** Nodemon  

---

## ⚙️ Como Executar

### 🔹 Pré-requisitos
- Node.js (>= 18.x)  
- npm ou yarn  

### 1. Clone o repositório
```bash
git clone https://github.com/gabrielrodrigueslb/Teste-pratico-dti-digital-Gabriel-Eduardo.git
cd <pasta-do-projeto>
```

### 2. Configurar o Backend
```bash
cd drone-backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` caso necessário. Para SQLite:
```env
DATABASE_URL="file:./dev.db"
```

Rodar migrações e seed:
```bash
npx prisma migrate dev
npx prisma db seed
```

Iniciar o servidor:
```bash
npm run dev
```
➡️ Backend disponível em: `http://localhost:3000`

### 3. Configurar o Frontend
```bash
cd ../drone-frontend
npm install
npm run dev
```
➡️ Frontend disponível em: `http://localhost:5173`

---

## 🧪 Testes

### Instalação
Os testes utilizam **Jest** e **Supertest**.  
Já estão configurados no projeto:

```bash
cd drone-backend
npm install --save-dev jest supertest babel-jest @babel/preset-env
```

### Configuração
- `babel.config.js` → garante suporte a ESModules (`import/export`).  
- `jest.config.js` → define ambiente de testes Node.  
- `setupTests.js` → mock global para silenciar logs de erro (opcional).  

### Rodando testes
```bash
npm test
```

### Estrutura dos testes
- `tests/services/*` → testa regras de negócio (mock do Prisma).  
- `tests/controllers/*` → testa controllers e tratamento de erros.  
- `tests/integration/*` → testa rotas reais com `supertest`.  

Exemplo de saída:
```
 PASS  src/tests/services/allocationService.test.js
 PASS  src/tests/services/dronesService.test.js
 PASS  src/tests/services/packageService.test.js
 PASS  src/tests/controllers/allocationController.test.js
 PASS  src/tests/controllers/dronesController.test.js
 PASS  src/tests/controllers/packageController.test.js
 PASS  src/tests/integration/server.test.js

Test Suites: 7 passed, 7 total
Tests:       17 passed, 17 total
```

---

## 🌐 Endpoints Principais

| Método | Endpoint                | Descrição |
|--------|-------------------------|-----------|
| `POST` | `/pedidos`              | Cria novo pedido |
| `GET`  | `/pedidos`              | Lista pedidos (filtro por status disponível) |
| `POST` | `/drones`               | Cadastra novo drone |
| `GET`  | `/drones`               | Lista todos os drones com status |
| `PUT`  | `/drones/:id`           | Atualiza informações de um drone |
| `POST` | `/alocacoes`            | Executa alocação automática de pacotes |
| `POST` | `/alocacoes/finalizar`  | Finaliza entregas em andamento |
| `POST` | `/alocacoes/recarregar` | Recarrega drones em estado de carga |

---

## ✅ Entregáveis (como pedido no desafio)

- README com instruções de execução ✅  
- Testes unitários para as regras principais ✅  
- API RESTful bem definida ✅  
- Dashboard interativo ✅  

Extras implementados:
- Simulação com estados reais dos drones  
- Feedback visual em tempo real no frontend  

---

## 📊 Possíveis Melhorias Futuras
- Inserção de obstáculos (zonas de exclusão aérea)  
- Cálculo de tempo total de entrega  
- Relatórios e métricas (drone mais eficiente, tempo médio, mapa de entregas)  
- Deploy em ambiente online  

---

## 🤖 Uso de IA

Este README foi gerado parcialmente com apoio de ferramentas de Inteligência Artificial (IA), conforme sugestão da dti.  
Foram utilizadas para estruturar a documentação, organizar requisitos e auxiliar na escrita de testes, sem substituir o desenvolvimento da lógica e do código.  
