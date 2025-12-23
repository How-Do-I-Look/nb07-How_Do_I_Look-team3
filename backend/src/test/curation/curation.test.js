/* eslint-disable no-undef */
import request from "supertest";
import app from '../../../app.js';
import { prisma } from "../../utils/prisma.js";


describe("큐레이팅 통합 테스트 시나리오", () => {
  let styleId;
  let curationId;
  beforeAll(async () => {
    // 스타일 생성
    const styleRes = await request(app).post("/styles").send({
      nickname: "큐레이션용",
      title: "큐레이션 테스트 스타일",
      password: "StylePass123!",
      tags: ["테스트"],
      categories: {},
      imageUrls: ["http://img.com/test.jpg"],
    });

    styleId = styleRes.body.id;
    // 큐레이팅 생성
    const curationRes = await request(app)
      .post(`/styles/${styleId}/curations`)
      .send({
        nickname: "큐레이터",
        password: "CurePass123!",
        content: "기본 큐레이팅",
        trendy: 4,
        personality: 4,
        practicality: 3,
        costEffectiveness: 4,
      });

    curationId = curationRes.body.id;
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe("큐레이팅 등록", () => {
    test("큐레이팅 등록", async () => {
      const payload = {
        nickname: "큐레이터1",
        password: "CurePass123!",
        content: "정말 세련됐네요!",
        trendy: 5, personality: 4, practicality: 3, costEffectiveness: 4
      };

      const res = await request(app).post(`/styles/${styleId}/curations`).send(payload);
      expect(res.status).toBe(201);
      curationId = res.body.id;
    });
  });
  describe("큐레이팅 수정", () => {
    /**
     * 비밀번호가 일치할 경우
     * 큐레이팅 내용 및 평점이 정상적으로 수정되는지 검증합니다.
     *
     * - PUT /curations/{curationId}
     * 요청 데이터
     *   password, content, 평점 필드
     * 기대결과
     * - 200 OK
     * - 수정된 content가 응답에 반영됨
     */
    test("큐레이팅 수정 - 비밀번호 일치", async () => {
      const res = await request(app)
        .put(`/curations/${curationId}`)
        .send({
          password: "CurePass123!",
          content: "수정된 큐레이팅 코멘트입니다.",
          trendy: 4,
        });

      expect(res.status).toBe(200);
      expect(res.body.content).toContain("수정된");
    });
    /**
     * 비밀번호가 일치하지 않을 경우
     * 큐레이팅 수정이 차단되는지 검증합니다.
     *
     * - PUT /curations/{curationId}
     * 요청 데이터
     *   password (불일치)
     * 기대결과
     * - 403 Forbidden
     */
    test("큐레이팅 수정 - 비밀번호 불일치 시 403", async () => {
      const res = await request(app)
        .put(`/curations/${curationId}`)
        .send({
          password: "wrong_password",
          content: "수정",
        });

      expect(res.status).toBe(403);
    });
  });
  describe("큐레이팅 조회", () => {
    /**
     * 스타일 상세 조회 시
     * 큐레이팅 목록이 함께 포함되는지 검증합니다.
     *
     * - GET /styles/{styleId}
     * 기대결과
     * - 200 OK
     * - curations 배열 존재
     * - 큐레이팅 데이터가 1개 이상 포함됨
     */
    test("큐레이팅 조회 - 스타일 상세에 큐레이팅 포함", async () => {
      const res = await request(app).get(`/styles/${styleId}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.curations)).toBe(true);
      expect(res.body.data.curations.length).toBeGreaterThan(0);
    });
  });
  describe("큐레이팅 삭제", () => {
    /**
     * 비밀번호가 일치할 경우
     * 큐레이팅이 정상적으로 삭제되는지 검증합니다.
     *
     * - DELETE /curations/{curationId}
     * 요청 데이터
     *   password
     * 기대결과
     * - 204 No Content
     */
    test("큐레이팅 삭제 - 비밀번호 일치 시 정상 삭제", async () => {
      const res = await request(app)
        .delete(`/curations/${curationId}`)
        .send({ password: "CurePass123!" });

      expect(res.status).toBe(204);
    });

    /**
     * 이미 삭제된 큐레이팅에 대해
     * 다시 삭제 요청 시 404를 반환하는지 검증합니다.
     *
     * - DELETE /curations/{curationId}
     * 기대결과
     * - 404 Not Found
     */
    test("큐레이팅 삭제 - 이미 삭제된 curationId 요청 시 404", async () => {
      const res = await request(app)
        .delete(`/curations/${curationId}`)
        .send({ password: "CurePass123!" });

      expect(res.status).toBe(404);
    });
    /**
     * 비밀번호가 일치하지 않을 경우
     * 큐레이팅 삭제 요청이 차단되는지 검증합니다.
     *
     * - DELETE /curations/{curationId}
     * 요청 데이터
     *   password (불일치)
     * 기대결과
     * - 403 Forbidden
     */
    test("큐레이팅 삭제 - 비밀번호 불일치 시 403", async () => {
      const res = await request(app)
        .delete(`/curations/${curationId}`)
        .send({ password: "wrong_password" });

      expect(res.status).toBe(403);
    });
  });
});
