import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("API is running");
});

// Routes
app.use("/auth", authRoutes);

export default app;
