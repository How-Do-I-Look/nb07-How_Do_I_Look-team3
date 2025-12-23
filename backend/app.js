import express from "express";
import cors from "cors";
import { errorHandler } from "./src/errors/errorHandler.js";
import curationRouter from "./src/routes/curation/curation.route.js";
import commentRouter from "./src/routes/comment/comment.route.js";
import tagRouter from "./src/routes/tag/tag.route.js";
import styleRouter from "./src/routes/style/style.route.js";
import rankingRouter from "./src/routes/ranking/ranking.route.js";
import { multerUtil as multer } from "./src/utils/multer.js";
import { createStyleImage } from "./src/services/style/style.service.js";
import { specs, swaggerUi } from "./src/utils/swagger.util.js";
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
    // 허용 HTTP 메서드 명시
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);

app.use(express.json());

BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use("/comments", commentRouter);
app.use("/tags", tagRouter);
app.use("/curations", curationRouter);
app.use("/styles", styleRouter);
if (process.env.NODE_ENV !== "TEST") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
app.use("/ranking", rankingRouter);
app.post("/images", multer.single("image"), (req, res, next) => {
  try {
    const uploadFile = req.file;

    const imageUrl = createStyleImage(uploadFile);
    res.status(201).json({ imageUrl });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

export default app;
