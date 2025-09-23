# Gunakan base image Node.js versi 18
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan layer caching Docker
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin sisa file aplikasi
COPY . .

# Jalankan migrasi database saat container build
RUN npx prisma generate 

# Buka port 3000 agar bisa diakses dari luar container
EXPOSE 3000

# Perintah default untuk menjalankan aplikasi saat container dimulai
CMD ["npm", "run", "start"]