# UpWorker - Guia de Instalação e Execução

Este projeto contém o backend (UpWorkerApi) e o frontend (UpWorkerWeb) do sistema UpWorker, além dos scripts e documentação.

## Requisitos
- Node.js >= 18
- Yarn ou npm
- Docker e Docker Compose

## Passo a Passo para Executar as Aplicações

### 1. Clonar o repositório
```bash
# Via HTTPS
git clone https://github.com/JJPontes/UpWorker.git
cd UpWorker
```

### 2. Instalar dependências

#### Backend (UpWorkerApi)
```bash
cd UpWorkerApi
npm install # ou yarn install
```

#### Frontend (UpWorkerWeb)
```bash
cd ../UpWorkerWeb
npm install # ou yarn install
```

### 3. Configurar variáveis de ambiente
- Copie `.env.example` para `.env` nas pastas `UpWorkerApi` e ajuste conforme seu ambiente.
- Para Docker, ajuste `.env.docker` se necessário.

### 4. Executar Backend localmente
```bash
cd ../UpWorkerApi
npm run dev # ou yarn dev
```

### 5. Executar Frontend localmente
```bash
cd ../UpWorkerWeb
npm run dev # ou yarn dev
```
- O frontend estará disponível em `http://localhost:5173` (padrão Vite)
- O backend estará disponível em `http://localhost:3001`

### 6. Executar via Docker Compose
```bash
cd .. # pasta raiz do projeto
# Garante que o banco não está rodando local
# Sobe containers do backend e banco

docker compose up -d
```
- O backend estará disponível em `http://localhost:3001`
- O banco PostgreSQL estará disponível em `localhost:5432`

### 7. Testes e Coverage
```bash
cd UpWorkerApi
npm test
npm run test:coverage
```

## Observações
- O frontend pode ser executado fora do Docker para melhor experiência de desenvolvimento (HMR).
- O backend pode ser testado localmente ou via Docker.
- As tabelas do banco são criadas automaticamente ao subir o container.
- Documentação Swagger disponível em `/api-docs`.

## Links Úteis
- [Documentação Backend](docs/backend/arquitetura_backend.md)
- [Documentação Docker Compose](docs/devops/docker_compose.md)
- [Esquema do Banco](docs/database/esquema.md)
