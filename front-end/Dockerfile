# Etapa 1 — build da aplicação
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Gera build do Next.js
RUN npm run build

# Etapa 2 — execução
FROM node:18

WORKDIR /app

# Copia arquivos do build
COPY --from=builder /app ./

EXPOSE 3000

# Executa Next em produção
CMD ["npm", "start"]
