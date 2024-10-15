import express from "express";
import cors from "cors";
import Routes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", Routes); // Use a prefix for your routes

// Catch-all handler for non-existent routes
app.use((req, res) => {
  res.status(404).json("Route does not exist");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening at port http://localhost:${PORT}`);
});
