import config from "./config";
import express from "express";
import router from "./routes";
import { genericErrorHandler, notFoundError } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(router);

app.use(genericErrorHandler);
app.use(notFoundError);

app.listen(config.port, () => {
     console.log(
          `Server Started. Listening on http://localhost:${config.port}/`
     );
});
