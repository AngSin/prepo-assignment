FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .
COPY .env .env
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start"]
