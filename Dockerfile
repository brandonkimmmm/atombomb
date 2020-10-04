FROM node:8

RUN mkdir -p /user/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]