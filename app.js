import express from "express";

const app = express();
// ⭐️ 이 부분을 남깁니다. (충돌 해소)
const PORT = process.env.PORT || 3000;

app.use(express.json());
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.listen(PORT, () => {
  console.log(`서버 실행 중 (포트: ${PORT})`);
});
