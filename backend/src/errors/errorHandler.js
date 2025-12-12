export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "잘못된 요청입니다") {
    super(message, 400);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "비밀번호가 틀렸습니다") {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "존재하지 않습니다") {
    super(message, 404);
  }
}

export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.code === "P2002") {
    return res.status(400).json({ message: "이미 존재하는 데이터입니다" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ message: "존재하지 않습니다" });
  }

  // 예기치 못한 에러 처리
  console.error(err);
  return res
    .status(500)
    .json({ message: "서버 내부 오류가 발생했습니다." + err.message });
};
