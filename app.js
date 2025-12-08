import "./src/utils/dotenv.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.listen(PORT, () => {
  console.log("서버 실행 중");
});
