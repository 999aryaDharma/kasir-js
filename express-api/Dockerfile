# Gunakan base image Node.js versi 18
FROM node:18-alpine

# Set working dir
WORKDIR /app

# Copy package.json untuk install dependensi
COPY package*.json ./

RUN npm install

# Copy schema prisma
COPY prisma ./prisma/

# Generate prisma client (perlu node_modules sudah ada)
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Jalankan dev server (pakai nodemon atau npm run dev)
CMD ["npm", "run", "dev"]
