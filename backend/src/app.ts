import express from "express";
import cookiesParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/user.route.js";
import contentRouter from "./routes/content.route.js";
import { errorHandler } from "./middlewares/errorrHandler.middlewares.js";


const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookiesParser());

// cors configrations
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.get('/', (req, res) => {
    res.json({
        msg: "Welcome!!"
    })
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth", contentRouter);
app.use(errorHandler);
export default app;