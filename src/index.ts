import express from "express";
import cors from "cors";
import Routes from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());

// app.use(cors());
// const cors = require("cors");

const allowedOrigins = [process.env.ORIGIN1, process.env.ORIGIN2];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, like mobile apps or curl requests
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent
  })
);


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
