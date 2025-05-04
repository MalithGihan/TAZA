import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db_config.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

connectDB();

app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://tazalive.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
