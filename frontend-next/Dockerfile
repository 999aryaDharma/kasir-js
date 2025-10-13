FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENV NODE_ENV=development

EXPOSE 8000

CMD ["npm", "run", "dev"]
