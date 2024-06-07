FROM node:20.11-slim
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
COPY .env ./
RUN npm install
RUN apt-get update -y && apt-get install -y openssl
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]