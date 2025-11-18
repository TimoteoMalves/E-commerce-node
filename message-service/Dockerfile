# Imagem base
FROM node:20-alpine

# Cria e define o diretório de trabalho no container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Comando para iniciar o serviço
# Assumindo que o arquivo principal é 'index.js' ou 'notificationService.js'
CMD ["node", "index.js"] 
# Altere para CMD ["node", "notificationService.js"] no serviço de notificação