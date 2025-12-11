import express from "express";
import { errorHandler } from "./src/errors/errorHandler.js";
import curationRouter from "./src/routes/curation/curation.route.js";
import stlyeRouter from "./src/routes/curation/styleRead.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use("/curations", curationRouter);
app.use("/style", stlyeRouter)

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("서버 실행 중");
});
