BigInt.prototype.toJSON = function () {
	return this.toString();
};
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const categoryRoutes = require("./routes/categoryRoutes"); // Import rute
const productRoutes = require("./routes/productRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Terapkan CORS sebagai middleware global SEBELUM rute
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "🚀 API Kasir is alive!" });
});

// Gunakan middleware error handling
app.use(errorMiddleware);

// Gunakan rute produk dengan prefix /products
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
