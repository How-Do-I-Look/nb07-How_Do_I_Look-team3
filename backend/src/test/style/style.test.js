import request from "supertest";
import express from "express";
import { prisma } from "../../utils/prisma.js";

const app = express();
const HOST_NAME = process.env.DEV_HOST_NAME || "http://localhost:3000";
describe("서비스 통합 테스트 시나리오", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe("스타일 등록", () => {
    /**
     * 시나리오:
     * - POST /styles
     * 요청 데이터
     *    nickname,
     *    title,
     *    content,
     *    password,
     *    items
     *    tags
     *    imageUrls
     * 기대결과:
     * - 201(또는 200)
     * - id는 string
     * - 응답에 password가 노출되지 않음(정책)
     */
    test("스타일 등록 - 정상 등록 및 데이터 바인딩 확인", async () => {
      const data = {
        nickname: "패션왕",
        title: "겨울 미니멀 룩",
        content: "따뜻한 코디입니다.",
        password: "StylePass123!",







        items: {
          top: { name: "터틀넥", brand: "유니클로", price: 39900 },
          outer: { name: "캐시미어 코트", brand: "인사일런스", price: 250000 }
        },
        tags: ["미니멀", "겨울", "코트"], // 최대 3개
        imageUrls: ["http://img.com/1.jpg", "http://img.com/2.jpg"]
      };
      const res = await request(app).post("/api/styles").send(payload);

      expect(res.status).toBe(201);
      expect(typeof res.body.id).toBe("string"); // [점검] BigInt 처리 (문자열 전달)
      expect(res.body.tags.length).toBe(3);
      expect(res.body.items.length).toBe(2);
      styleId = res.body.id;
  });
});
