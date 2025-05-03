import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db_config.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT) || 3020;

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
