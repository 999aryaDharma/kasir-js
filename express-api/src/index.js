require("dotenv").config();

BigInt.prototype.toJSON = function () {
	return this.toString();
};

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./routes"); // ✅ Import aggregator
const errorMiddleware = require("./middlewares/errorMiddleware");

// Middleware global
app.use(
	cors({
		origin: true, // Mengizinkan semua origin dalam development
		credentials: true, // Izinkan pengiriman cookie
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
	res.json({ message: "🚀 API Kasir is alive!" });
});

// Semua routes di bawah /api
app.use("/api", routes);

// Error handler (taruh paling akhir)
app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
