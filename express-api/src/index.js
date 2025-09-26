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
		origin: ["http://localhost:8080", "http://localhost:3001"], // Izinkan hanya origin frontend Anda
		credentials: true, // Izinkan pengiriman cookie
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
