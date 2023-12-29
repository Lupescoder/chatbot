FROM node:latest

WORKDIR /chatbot

COPY . .

RUN rm -rf node_modules

RUN npm i

CMD ["npm", "start"]

EXPOSE 8080