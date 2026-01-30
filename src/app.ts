import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("API is running");
});

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

export default app;
