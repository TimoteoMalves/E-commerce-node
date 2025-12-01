#!/bin/bash
# rs-init.sh

echo "=> Aguardando o orders-db iniciar..."

sleep 15 

echo "=> Iniciando a configuração do Replica Set 'rs0'..."

mongosh --host orders-db:27017 --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"orders-db:27017"}]}, {force:true});'

echo "=> Configuração do Replica Set concluída."