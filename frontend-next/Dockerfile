FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# # Copy semua kode ke container (nanti di override pakai volume)
# COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:3000/api

EXPOSE 3000

CMD ["npm", "run", "dev"]
