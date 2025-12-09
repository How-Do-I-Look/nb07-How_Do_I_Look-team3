import express from "express";
import { errorHandler } from "./src/errors/errorHandler.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
BigInt.prototype.toJSON = function () {
  return this.toString();
};

var aa = 1;

app.use(errorHandler);
app.listen(PORT, () => {
  console.log("서버 실행 중");
});
