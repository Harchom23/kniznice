import express from "express";
import { mongoose } from "mongoose";
import libraryRouter from "./routes/libraries";
import studentsRouter from "./routes/students";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("database connected");
});

const app = express();
const port = 2345;
app.set("view engine", "html");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/libraries", libraryRouter);
app.use("/students", studentsRouter);
app.listen(port, () => console.log(`Server runs on port ${port}`));
