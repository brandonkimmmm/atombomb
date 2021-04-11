FROM node:8.17.0

RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app/

RUN npm install pm2@3.2.7 sequelize-cli@5.4.0 -g && npm install

COPY . /app

EXPOSE 80

ENTRYPOINT ["/app/entrypoint.sh"]