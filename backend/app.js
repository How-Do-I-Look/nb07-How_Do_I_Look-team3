import express from "express";
import cors from "cors";
import { errorHandler } from "./src/errors/errorHandler.js";
import curationRouter from "./src/routes/curation/curation.route.js";
import styleRouter from "./src/routes/style/style.route.js";
import { multerUtil as multer } from "./src/utils/multer.js";
import { createStyleImage } from "./src/services/style/style.service.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    // 💡 선택 사항: 허용할 HTTP 메서드 명시
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);
const PORT = process.env.PORT || 3000;

app.use(express.json());

BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use("/curations", curationRouter);
app.use("/styles", styleRouter);
app.post("/images", multer.single("image"), createStyleImage);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("서버 실행 중");
});
