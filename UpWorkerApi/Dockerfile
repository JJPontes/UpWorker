# Dockerfile para UpWorkerApi (Node.js + TypeScript)
FROM node:alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json yarn.lock ./

# Instala dependências
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY . .

# Compila o TypeScript
RUN yarn build


# Expõe a porta da API (Docker)
EXPOSE 3010

# Copia o .env.docker para .env dentro do container
COPY .env.docker .env

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
