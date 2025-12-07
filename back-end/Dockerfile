# Usamos Node LTS
FROM node:18

# Dentro do container
WORKDIR /app

# Copiamos o package.json
COPY package*.json ./

# Instalamos dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta 
EXPOSE 5000

# Comando de produção (sem nodemon)
CMD ["node", "src/index.js"]
