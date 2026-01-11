# Documentação da API - Controle de Estoque Academia

Base URL: `http://localhost:3000`

## Endpoints Disponíveis

### 1. Listar todos os produtos
```
GET /products
```

**Query Parameters (opcionais):**
- `category`: `BEBIDA_ENERGETICA`, `BEBIDA_NATURAL`, `BEBIDA_ESPORTIVA`
- `search`: string para buscar por nome

**Exemplos:**
```bash
# Todos os produtos
curl http://localhost:3000/products

# Produtos por categoria
curl http://localhost:3000/products?category=BEBIDA_ENERGETICA

# Buscar por nome
curl http://localhost:3000/products?search=Monster
```

### 2. Obter produto por ID
```
GET /products/:id
```

### 3. Criar novo produto
```
POST /products
Content-Type: application/json
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Red Bull",
    "price": 7.99,
    "stock": 40,
    "minStock": 10,
    "category": "BEBIDA_ENERGETICA"
  }'
```

### 4. Atualizar produto (completo)
```
PUT /products/:id
Content-Type: application/json
```

**Exemplo:**
```bash
curl -X PUT http://localhost:3000/products/[ID] \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Red Bull Atualizado",
    "price": 8.50,
    "stock": 25,
    "minStock": 5,
    "category": "BEBIDA_ENERGETICA"
  }'
```

### 5. Atualizar produto (parcial)
```
PATCH /products/:id
Content-Type: application/json
```

**Exemplo:**
```bash
curl -X PATCH http://localhost:3000/products/[ID] \
  -H "Content-Type: application/json" \
  -d '{
    "price": 8.50,
    "stock": 25
  }'
```

### 6. Remover produto
```
DELETE /products/:id
```

## Estrutura de Resposta

### Product Response
```json
{
  "id": "uuid",
  "name": "string",
  "price": 0.00,
  "stock": 0,
  "minStock": 0,
  "category": "CATEGORIA",
  "active": true,
  "createdAt": "2025-12-26T22:30:00.000Z",
  "updatedAt": "2025-12-26T22:30:00.000Z",
  "lowStock": false
}
```

### Summary Response
```json
{
  "total": 7,
  "lowStock": 1,
  "outOfStock": 0,
  "byCategory": {
    "BEBIDA_ENERGETICA": 2,
    "BEBIDA_NATURAL": 2,
    "BEBIDA_ESPORTIVA": 3
  }
}
```

## Categorias de Produtos

1. `BEBIDA_ENERGETICA`: Monster, Red Bull, etc.
2. `BEBIDA_NATURAL`: Água mineral, sucos naturais
3. `BEBIDA_ESPORTIVA`: Powerade, Gatorade, etc.