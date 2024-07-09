import config from "./config";
import express from "express";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(router);

app.listen(config.port, () => {
     console.log(
          `Server Started. Listening on http://localhost:${config.port}/`
     );
});
