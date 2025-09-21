-- Tabela de Status do Pedido
CREATE TABLE Status (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de Métodos de Pagamento
CREATE TABLE Payment_method (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de Clientes
CREATE TABLE Client (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL -- Senhas devem ser armazenadas com hash!
);

-- Tabela de Produtos
CREATE TABLE Product (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    estoque INTEGER NOT NULL CHECK (estoque >= 0),
    valor_unitario NUMERIC(10, 2) NOT NULL CHECK (valor_unitario >= 0)
);

-- Tabela de Pedidos
CREATE TABLE "Order" ( -- Usamos aspas duplas pois ORDER é uma palavra reservada
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES Client(id),
    status_id INTEGER NOT NULL REFERENCES Status(id),
    valor_total NUMERIC(10, 2) NOT NULL CHECK (valor_total >= 0),
    -- O campo 'products' não é necessário aqui. O relacionamento "Um pedido pode ter vários produtos"
    -- é resolvido pela tabela de ligação Product_order (próxima seção).
    data_pedido TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ligação: Pedido e Produto (M:N)
CREATE TABLE Product_order (
    product_id INTEGER REFERENCES Product(id),
    order_id INTEGER REFERENCES "Order"(id),
    
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    
    -- Chave composta (um produto só pode aparecer uma vez por pedido)
    PRIMARY KEY (product_id, order_id) 
);

-- Tabela de Ligação: Pedido e Método de Pagamento (M:N)
-- Considerando que um pedido pode ser pago com vários métodos (ex: parte em cartão, parte em dinheiro),
-- ou simplesmente para um futuro multi-pagamento.
CREATE TABLE Payment_order (
    order_id INTEGER REFERENCES "Order"(id),
    payment_method_id INTEGER REFERENCES Payment_method(id),
    
    valor_pago NUMERIC(10, 2) NOT NULL CHECK (valor_pago >= 0),
    
    -- Chave composta (um método só pode ser aplicado uma vez por pedido)
    PRIMARY KEY (order_id, payment_method_id) 
);

INSERT INTO Status (tipo) VALUES
('PENDENTE'),
('EM PROCESSAMENTO'),
('ENVIADO'),
('ENTREGUE'),
('CANCELADO');


INSERT INTO Payment_method (tipo) VALUES
('Cartão de Crédito'),
('Pix'),
('Boleto Bancário'),
('Dinheiro (na entrega)');

INSERT INTO Client (nome, email, senha) VALUES
('Ana Silva', 'ana.silva@email.com', 'senha123'),
('Bruno Costa', 'bruno.costa@email.com', 'senha456'),
('Carla Lopes', 'carla.lopes@email.com', 'senha789');

INSERT INTO Product (descricao, estoque, valor_unitario) VALUES
('Mouse Gamer XYZ', 85, 120.50),
('Teclado Mecânico PRO', 40, 350.00),
('Monitor LED 27" 4K', 15, 1899.99),
('Cabo HDMI 2.1', 300, 25.00),
('WebCam Full HD', 60, 95.00);