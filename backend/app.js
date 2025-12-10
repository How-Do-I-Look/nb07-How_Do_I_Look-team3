import express from "express";
import { errorHandler } from "./src/errors/errorHandler.js";
import commentRouter from "./src/routes/comment/comment.route.js";
import curationRouter from "./src/routes/curation/curation.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use("/curations", curationRouter);
app.use("/comments", commentRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("서버 실행 중");
});
