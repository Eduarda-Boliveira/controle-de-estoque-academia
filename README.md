# Controle de Estoque - Academia

Sistema de controle de estoque para academia desenvolvido em NestJS.

## Funcionalidades

- CRUD completo para produtos (Monster, Água, Power Ade)
- Gestão de estoque
- API REST

## Produtos suportados
- Monster Energy
- Água
- Power Ade

## Tecnologias

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Class Validator
- Class Transformer

## Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run start:dev

# Executar em produção
npm run start:prod
```

## API Endpoints

- `GET /products` - Listar todos os produtos
- `GET /products/:id` - Obter produto por ID
- `POST /products` - Criar novo produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Remover produto

## Estrutura do Projeto

```
src/
├── products/
│   ├── dto/
│   ├── entities/
│   ├── repositories/
│   ├── services/
│   └── controllers/
└── app.module.ts
```