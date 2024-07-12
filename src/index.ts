import config from "./config";
import express from "express";
import router from "./routes";
import { genericErrorHandler, notFoundError } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/logger";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

const app = express();

const limiter = rateLimiter({
     windowMs: 60 * 1000,
     limit: 15,
     message: "too many requests",
});

app.use(helmet());

app.use(limiter);

const allowedOrigins = ["https://www.test.com"];
app.use(
     cors({
          origin: (origin, callback) => {
               if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, origin);
               } else {
                    callback(new Error("not allowed"));
               }
          },
     })
);

app.use(express.json());
app.use(requestLogger);

app.use(router);

app.use(notFoundError);
app.use(genericErrorHandler);

app.listen(config.port, () => {
     console.log(
          `Server Started. Listening on http://localhost:${config.port}/`
     );
});
