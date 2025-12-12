import multer from "multer";
import _path from "path";
import fs from "fs/promises";

export const multerUtil = multer({
  storage: multer.diskStorage({
    // 사용자별 폴더 생성
    destination: async function (req, file, cb) {
      const uploadDir = _path.join("public", "images", "style");

      // 폴더가 없으면 생성
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // 프로필 사진은 하나만: image + 타임스탬프 + 확장자
      const ext = _path.extname(file.originalname);
      cb(null, `style-${Date.now()}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    // 이미지 파일만 허용
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      _path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      const fileTypeError = new Error(
        "이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, gif, webp)",
      );
      fileTypeError.name = "FileTypeValidationError";
      cb(fileTypeError);
    }
  },
});

// 프로필 이미지 업로드
