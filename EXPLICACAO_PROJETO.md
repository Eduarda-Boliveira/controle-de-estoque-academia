# 📋 Explicação Detalhada do Projeto - Sistema de Controle de Estoque

## 🏗️ **Estrutura Geral do Projeto**

Este é um sistema de controle de estoque para academia, desenvolvido com **NestJS** (backend) + **SQLite** (banco de dados) + **HTML/CSS/TypeScript** (frontend).

---

## 📁 **Arquivos de Configuração da Raiz**

### **package.json**
- **Função**: Define as dependências, scripts e metadados do projeto
- **Principais dependências**: NestJS, TypeORM, SQLite, Class-validator
- **Scripts importantes**: `start:dev`, `build`, `seed`, `test`

### **tsconfig.json**
- **Função**: Configuração do TypeScript para o backend
- **Define**: Alvos de compilação, decoradores, módulos

### **tsconfig.frontend.json**
- **Função**: Configuração específica do TypeScript para o frontend
- **Compila**: Arquivos do diretório `public/js/` para JavaScript

### **tsconfig.build.json**
- **Função**: Configuração de build de produção
- **Exclui**: Arquivos de teste e desenvolvimento

### **.eslintrc.js**
- **Função**: Regras de formatação e boas práticas do código
- **Garante**: Código limpo e padronizado

### **.prettierrc**
- **Função**: Configuração de formatação automática do código
- **Define**: Indentação, aspas, vírgulas, etc.

### **.gitignore**
- **Função**: Define quais arquivos/pastas não devem ser versionados
- **Exclui**: node_modules, dist, arquivos de banco, logs

---

## 🎯 **Arquivos Principais do Backend (/src)**

### **main.ts**
```typescript
// PONTO DE ENTRADA da aplicação
- Inicializa a aplicação NestJS
- Configura validação global (ValidationPipe)
- Habilita CORS para frontend
- Define porta 3000
- Bootstrap da aplicação
```

### **app.module.ts**
```typescript
// MÓDULO RAIZ da aplicação
- Importa TypeOrmModule (conexão com SQLite)
- Registra ProductsModule
- Configura banco: database.sqlite, sincronização automática
```

### **test-api.ts**
```typescript
// SCRIPT DE TESTE da API
- Testa todos os endpoints REST
- Cria, lista, atualiza e deleta produtos
- Verifica funcionamento das rotas PATCH
```

---

## 📦 **Módulo de Produtos (/src/products)**

### **products.module.ts**
```typescript
// MÓDULO de produtos - agrupa toda funcionalidade
- Importa TypeOrmModule para entidade Product
- Registra: Controller, Service, Repository
- Exporta Service e Repository para outros módulos
```

### **index.ts**
```typescript
// BARREL EXPORT - facilita importações
- Exporta todas as classes principais do módulo
- Permite imports limpos: import { ProductService } from './products'
```

---

## 🗄️ **Camada de Dados (Entities & Repository)**

### **entities/product.entity.ts**
```typescript
// ENTIDADE do banco de dados
- Define estrutura da tabela products
- Campos: id, name, price, stock, minStock, category, active
- Decorators TypeORM (@Entity, @Column, @PrimaryGeneratedColumn)
- Enum ProductCategory (BEBIDA_ENERGETICA, BEBIDA_NATURAL, etc.)
```

### **repositories/product.repository.ts**
```typescript
// CAMADA de acesso aos dados
- Extends Repository<Product>
- Métodos customizados de consulta
- Abstrai queries complexas do SQLite
- Métodos: findLowStock, searchByName, etc.
```

### **repositories/index.ts**
```typescript
// BARREL EXPORT dos repositories
```

---

## 🛡️ **DTOs - Data Transfer Objects (/src/products/dto)**

### **create-product.dto.ts**
```typescript
// VALIDAÇÃO para criação de produtos
- Class-validator decorators (@IsString, @IsNumber, @IsEnum)
- Define campos obrigatórios e opcionais
- Valida tipos de dados e formatos
```

### **update-product.dto.ts**
```typescript
// VALIDAÇÃO para atualização de produtos
- Extends PartialType(CreateProductDto)
- Todos os campos opcionais
- Permite atualizações parciais
```

### **response-product.dto.ts**
```typescript
// PADRONIZAÇÃO da resposta da API
- Define formato de retorno
- Inclui campo computed 'lowStock'
- Transforma dados do banco para frontend
```

### **dto/index.ts**
```typescript
// BARREL EXPORT dos DTOs
```

---

## ⚙️ **Camada de Negócio (Services)**

### **services/product.service.ts**
```typescript
// LÓGICA DE NEGÓCIO principal
- Métodos CRUD completos
- Validações de estoque
- Cálculos (estoque baixo, resumos)
- Métodos especiais:
  * addStock() / removeStock()
  * activateProduct() / deactivateProduct()
  * findLowStock()
  * getStockSummary()
```

### **services/index.ts**
```typescript
// BARREL EXPORT dos services
```

---

## 🌐 **Camada de Apresentação (Controllers)**

### **controllers/product.controller.ts**
```typescript
// ENDPOINTS da API REST (CRUD COMPLETO)
- @Controller('products') - rota base
- Métodos HTTP:
  * GET /products (com filtros categoria e busca)
  * GET /products/:id
  * POST /products
  * PUT /products/:id (atualização completa)
  * PATCH /products/:id (atualização parcial)
  * DELETE /products/:id
```

### **controllers/index.ts**
```typescript
// BARREL EXPORT dos controllers
```

---

## 🗃️ **Script de Banco (/src/database)**

### **seed.ts**
```typescript
// POPULAÇÃO inicial do banco
- Cria produtos de exemplo
- Diferentes categorias de bebidas
- Dados realistas para demonstração
- Único arquivo de população (simplificado)
```

---

## 🖥️ **Frontend (/public)**

### **index.html**
```html
<!-- INTERFACE do usuário -->
- Single Page Application simples
- Lista produtos, formulários
- Integração com API via JavaScript
```

### **style-2.css**
```css
/* ESTILOS da aplicação */
- Layout responsivo
- Cores tema academia
- Componentes estilizados
```

### **js/script.ts**
```typescript
// LÓGICA do frontend
- Consume API REST
- Manipula DOM
- Envia requisições AJAX
- Valida formulários
```

### **js/dist/script.js**
```javascript
// VERSÃO COMPILADA do TypeScript
- Gerado automaticamente
- Código JavaScript final
```

---

## 📖 **Documentação**

### **API_DOCS.md**
```markdown
# DOCUMENTAÇÃO completa da API
- Lista todos endpoints
- Exemplos de requisições curl
- Estruturas de dados
- Códigos de resposta
```

### **README.md**
```markdown
# DOCUMENTAÇÃO do projeto
- Como instalar e executar
- Tecnologias utilizadas
- Funcionalidades principais
```

---

## 🧪 **Arquivo de Teste**

### **migrate-to-postgres.js**
```javascript
// SCRIPT de migração SQLite → PostgreSQL
- Conecta nos dois bancos
- Copia estrutura e dados
- Para integração com DBeaver
```

---

## 🏃‍♂️ **Como Executar o Projeto**

```bash
# Instalar dependências
npm install

# Popular banco com dados
npm run seed

# Compilar frontend
npm run build:frontend

# Executar em desenvolvimento
npm run start:dev

# API disponível em: http://localhost:3000
# Frontend em: http://localhost:3000 (arquivos estáticos)
```

---

## 🎯 **Funcionalidades Implementadas**

1. ✅ **CRUD completo** de produtos
2. ✅ **Gerenciamento de estoque** (adicionar/remover)
3. ✅ **Filtros avançados** (categoria, estoque baixo, busca)
4. ✅ **Ativação/Desativação** de produtos
5. ✅ **Relatórios** (resumo, estoque baixo)
6. ✅ **Validação robusta** com class-validator
7. ✅ **Interface web** funcional
8. ✅ **Documentação completa** da API

---

## 🏗️ **Arquitetura Utilizada**

- **Arquitetura em Camadas**:
  - 🌐 **Controller** → Recebe requisições HTTP
  - ⚙️ **Service** → Processa lógica de negócio
  - 🗄️ **Repository** → Acessa dados do banco
  - 📋 **Entity** → Mapeia tabelas do banco
  - 🛡️ **DTO** → Valida e transfere dados

- **Padrões Aplicados**:
  - Dependency Injection
  - Repository Pattern
  - Data Transfer Object (DTO)
  - Separation of Concerns

Esta estrutura garante **código limpo**, **manutenível** e **escalável**! 🚀