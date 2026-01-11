const { Client } = require('pg');
const Database = require('better-sqlite3');

async function migrateData() {
  // Conectar no SQLite
  const sqliteDb = new Database('database.sqlite');
  
  // Conectar no PostgreSQL
  const pgClient = new Client({
    host: 'localhost',
    port: 5433,
    database: 'controle_estoque',
    user: 'eduarda',
    password: '123456',
  });
  
  await pgClient.connect();
  console.log('✅ Conectado no PostgreSQL');
  
  // Criar tabela products
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      min_stock INTEGER NOT NULL DEFAULT 5,
      category VARCHAR(50) NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  
  console.log('✅ Tabela products criada');
  
  // Buscar dados do SQLite
  const products = sqliteDb.prepare('SELECT * FROM products').all();
  console.log(`📊 Encontrados ${products.length} produtos no SQLite`);
  
  // Inserir dados no PostgreSQL
  for (const product of products) {
    await pgClient.query(`
      INSERT INTO products (id, name, description, price, stock, min_stock, category, active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO NOTHING
    `, [
      product.id,
      product.name,
      product.description,
      product.price,
      product.stock,
      product.minStock,
      product.category,
      product.active ? true : false,
      product.createdAt,
      product.updatedAt
    ]);
  }
  
  console.log('✅ Dados migrados com sucesso!');
  console.log('');
  console.log('🎯 Configuração para DBeaver:');
  console.log('Host: localhost');
  console.log('Porta: 5433');
  console.log('Database: controle_estoque');
  console.log('Usuário: eduarda');
  console.log('Senha: 123456');
  
  await pgClient.end();
  sqliteDb.close();
}

migrateData().catch(console.error);