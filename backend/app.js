import express from "express";
import { errorHandler } from "./src/errors/errorHandler.js";
import curationRouter from "./src/routes/curation/curation.route.js";
import commentRouter from "./src/routes/comment/comment.route.js";
import rankRouter from "./src/routes/style/ranking.route.js";
import styleRouter from "./src/routes/style/styleRead.route.js";


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use("/curations", curationRouter);
app.use("/styles", styleRouter);
app.use("/ranking", rankRouter);
app.use("/comments", commentRouter);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log("서버 실행 중");
});
