import express from "express";

const app = express();
app.use(express.json());
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.listen(PORT, () => {
  console.log("서버 실행 중");
});
