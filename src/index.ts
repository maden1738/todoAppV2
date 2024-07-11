import config from "./config";
import express from "express";
import router from "./routes";
import { genericErrorHandler, notFoundError } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/logger";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";

const app = express();

const limiter = rateLimiter({
     windowMs: 60 * 1000,
     limit: 15,
     message: "too many requests",
});

app.use(helmet());

app.use(limiter);

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
