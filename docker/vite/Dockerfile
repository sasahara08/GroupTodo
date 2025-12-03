FROM node:22

WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend ./

RUN npm run build

# dist を外に取り出したいので保持
CMD ["sleep", "infinity"]
