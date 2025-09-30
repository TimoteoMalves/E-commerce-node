# 🚀 Sistema de Microsserviços de E-commerce

Este repositório contém uma arquitetura de microsserviços desenvolvida em **Node.js** e **Express**, utilizando **Docker Compose** para orquestração e o **Prisma ORM** para interação com diferentes bancos de dados (**PostgreSQL** e **MongoDB**).

O sistema simula o fluxo principal de um e-commerce: **Clientes, Produtos, Pedidos e Pagamentos**.

---

## 🏗️ Arquitetura e Tecnologias

### Serviços Principais

| Serviço          | Função                                                                 | Banco de Dados             | Dependência        | Porta Exposta |
|-----------------|------------------------------------------------------------------------|---------------------------|------------------|---------------|
| **Order Service**   | Gerencia a criação de pedidos (carrinho) e coordena o fluxo de estoque/pagamento | MongoDB (Replica Set)     | Product, Payment  | 3002          |
| **Product Service** | Gerencia o catálogo de produtos e estoque                               | PostgreSQL (product_db)  | -                | 3003          |
| **Payment Service** | Processa pagamentos e notifica a mudança de status do pedido            | PostgreSQL (payments_db) | -                | 3004          |
| **Client Service**  | Gerencia os registros de clientes                                       | PostgreSQL (client_db)   | -                | 3001          |

### Databases e UIs

- **PostgreSQL Databases:**
  - `product_db`
  - `payments_db`
  - `client_db`
- **MongoDB Database:**
  - `orders_db` (Configurado como Replica Set para suportar transações do Prisma)
- **UIs de Gerenciamento:**
  - PgAdmin: `localhost:5050` (PostgreSQL)
  - Mongo Express: `localhost:8081` (MongoDB)

---

## 📋 Pré-requisitos

Para rodar este projeto, você precisa ter instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Node.js (Opcional, mas recomendado para executar scripts locais)

---

## ⚙️ Setup Local

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis. Atenção especial à `DATABASE_URL_ORDER` para o MongoDB.

```env
# ==================================
# Variáveis Comuns (PostgreSQL)
# ==================================
DB_USER=root
DB_PASSWORD=root
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin

# ==================================
# PostgreSQL URLs (Padrão: db_name:port/db_name)
# ==================================
DATABASE_URL_PRODUCT="postgresql://root:root@product_db:5432/product_db?schema=public"
DATABASE_URL_CLIENT="postgresql://root:root@client_db:5432/client_db?schema=public"
DATABASE_URL_PAYMENT="postgresql://root:root@payments_db:5432/payments_db?schema=public"

# ==================================
# MongoDB URL (CRUCIAL: Sem credenciais e com Replica Set)
# ==================================
# Nota: As credenciais foram removidas para evitar o erro "security.keyFile" em ambientes Docker dev.
# O parâmetro `replicaSet=rs0` é OBRIGATÓRIO para transações do Prisma no Mongo.
DATABASE_URL_ORDER="mongodb://orders-db:27017/orders_db?authSource=admin&replicaSet=rs0"

# ==================================
# URLs de Comunicação Inter-serviços
# Os nomes dos hosts devem ser os nomes dos containers (ex: product-service)
# ==================================
PRODUCT_SERVICE_URL=http://product-service:3003
PAYMENT_SERVICE_URL=http://payment-service:3004
