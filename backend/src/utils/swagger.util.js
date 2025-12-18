import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path, { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "How Do I Rook",
      description: "NB 7기 3팀 초급 프로젝트 API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "개발 환경",
      },
    ],
    tags: [
      { name: "Styles", description: "스타일 갤러리 관리 API" },
      { name: "Curations", description: "큐레이션(평가/댓글) 관리 API" },
      { name: "Comments", description: "답글 관리 API" },
      { name: "Tags", description: "태그 관리 API" },
      { name: "Ranking", description: "랭킹/정렬 관련 API" },
    ],
  },

  apis: [join(__dirname, "../../src/apis/*/*.yaml")],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
