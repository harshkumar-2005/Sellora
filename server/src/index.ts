import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

const port: string | undefined = process.env.PORT;

// middleware imports
import { responseTime } from "./middleware/responseTime.js";

app.use(responseTime);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cross origin
const alloweOrigns = ["http://localhost:3000"];
const options: CorsOptions = {
  origin: alloweOrigns,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(options));
// app.options('*', cors(options));

// Routes


//health api
app.get("/", (req: Request, res: Response) => {
  console.log({ success: true, Message: "Health was checked!!!!" });
  res.status(200).json({
    sucess: true,
    message: "Health is good!!!!",
  });
});

app.listen(port, () => {
  console.log(`app is running at http://localhost:3000`);
});
