# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências do sistema (OpenSSL)
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci && npm cache clean --force

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Instalar OpenSSL
RUN apk add --no-cache openssl

# Instalar apenas dependências de produção
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos do build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expor porta
EXPOSE 3000

# Comando para iniciar (Prisma push será feito pelo docker-compose)
CMD ["node", "dist/main"]