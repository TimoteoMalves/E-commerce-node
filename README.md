# 🛒 Sistema E-commerce API (Node.js & Prisma)
Este é o backend de uma aplicação de e-commerce construída com Node.js, utilizando o framework Express para roteamento e o Prisma como ORM (Object-Relational Mapper) para gerenciar a base de dados PostgreSQL.

# 🚀 Funcionalidades Principais
O sistema oferece endpoints RESTful completos para as seguintes entidades:

## Módulo	Funcionalidades (CRUD)	Endpoints Específicos
- Clientes (eClient)	Criar, Listar, Buscar por ID, Atualizar.	N/A
- Produtos (Product)	Criar, Listar, Buscar por ID, Atualizar (detalhes), Deletar.	PATCH /products/:id/stock (Exclusivo para atualização de estoque)
- Pedidos (Order)	Criar um pedido completo.	GET /clients/:clientId/orders (Buscar pedidos de um cliente)
- Pagamentos	Atualizar status de pagamento (PENDING, PAID, FAILED, REFUNDED).	PATCH /orders/:id/status

## 🛠️ Tecnologias Utilizadas
**Linguagem**: JavaScript (ES Modules)

**Runtime**: Node.js

**Framework** Web: Express

**ORM**: Prisma (Client & Migrate)

**Banco de Dados**: PostgreSQL
