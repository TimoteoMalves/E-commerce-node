#!/bin/bash

# Este script executa a inicialização do Replica Set (rs.initiate())
# Ele roda automaticamente no startup do container MongoDB

echo "=> Iniciando a configuração do Replica Set 'rs0'..."

# Acessa o shell do MongoDB e executa o comando rs.initiate
# O sleep é para garantir que o mongod tenha iniciado completamente.
mongosh --host orders-db:27017 <<EOF
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "orders-db:27017" }
    ]
  }, { force: true });
EOF

echo "=> Configuração do Replica Set concluída."