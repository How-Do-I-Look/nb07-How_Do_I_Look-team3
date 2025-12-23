
/* eslint-disable no-undef */
import request from "supertest";
import { prisma } from "../../utils/prisma.js";

import app from '../../../app.js';

describe("답글 통합 테스트 시나리오", () => {
  let styleId;
  let curationId;
  let commentsId;
  beforeAll(async () => {
    // 스타일 생성
    const styleRes = await request(app).post("/styles").send({
      nickname: "답글테스트",
      title: "답글 테스트 스타일",
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
    // 답글 생성
    const commentRes = await request(app)
      .post(`/curations/${curationId}/comments`)
      .send({
        nickname: "작성자",
        password: "ReplyPass123!",
        content: "의견 감사합니다!",
      });

    commentsId = commentRes.body.id;
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe("답글 등록", () => {
    /**
     * 특정 큐레이팅에 답글을 정상적으로 등록할 수 있는지 검증합니다.
     *
     * - POST /curations/{curationId}/comments
     * 요청 데이터
     *   nickname, password, content
     * 기대결과
     * - 201 Created
     * - reply id 반환
     * - content가 정상 저장됨
     */
    test("답글 등록 - 정상 등록", async () => {
      const payload = {
        nickname: "작성자",
        password: "ReplyPass123!",
        content: "의견 감사합니다!",
      };

      const res = await request(app)
        .post(`/curations/${curationId}/comments`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(typeof res.body.id).toBe("string");

      commentsId = res.body.id;
    });
  });
  describe("답글 수정", () => {
    /**
     * 비밀번호가 일치할 경우
     * 답글 내용이 정상적으로 수정되는지 검증합니다.
     *
     * - PUT /comments/{commentsId}
     * 요청 데이터
     *   password, content
     * 기대결과
     * - 200 OK
     * - 수정된 content가 응답에 반영됨
     */
    test("답글 수정 - 비밀번호 일치", async () => {
      const res = await request(app)
        .put(`/comments/${commentsId}`)
        .send({
          password: "ReplyPass123!",
          content: "수정된 답글입니다.",
        });

      expect(res.status).toBe(200);
      expect(res.body.content).toContain("수정된");
    });
    /**
     * 비밀번호가 일치하지 않을 경우
     * 답글 수정 요청이 차단되는지 검증합니다.
     *
     * - PUT /comments/{commentsId}
     * 요청 데이터
     *   password (불일치)
     * 기대결과
     * - 403 Forbidden
     */
    test("답글 수정 - 비밀번호 불일치 시 403", async () => {
      const res = await request(app)
        .put(`/comments/${commentsId}`)
        .send({
          password: "wrong_password",
          content: "수정",
        });

      expect(res.status).toBe(403);
    });
  });
  describe("답글 조회", () => {
    /**
     * 스타일 상세 조회 시
     * 큐레이팅 내부에 답글이 포함되어 반환되는지 검증합니다.
     *
     * - GET /styles/{styleId}
     * 기대결과
     * - 200 OK
     * - curations[].replies 배열 존재
     * - 답글 데이터 1개 이상 포함
     */
    test("답글 조회 - 스타일 상세에 답글 포함", async () => {
      const res = await request(app).get(`/styles/${styleId}`);

      expect(res.status).toBe(200);

      const curations = res.body.data.curations;
      expect(Array.isArray(curations)).toBe(true);
      expect(curations[0].reply.length).toBeGreaterThan(0);
    });
  });
  describe("답글 삭제", () => {
    /**
     * 비밀번호가 일치할 경우
     * 답글이 정상적으로 삭제되는지 검증합니다.
     *
     * - DELETE /comments/{commentsId}
     * 요청 데이터
     *   password
     * 기대결과
     * - 204 No Content
     */
    test("답글 삭제 - 비밀번호 일치 시 정상 삭제", async () => {
      const res = await request(app)
        .delete(`/comments/${commentsId}`)
        .send({ password: "ReplyPass123!" });

      expect(res.status).toBe(204);
    });

    /**
     * 이미 삭제된 답글에 대해
     * 다시 삭제 요청 시 404를 반환하는지 검증합니다.
     *
     * - DELETE /comments/{commentsId}
     * 기대결과
     * - 404 Not Found
     */
    test("답글 삭제 - 이미 삭제된 commentsId 요청 시 404", async () => {
      const res = await request(app)
        .delete(`/comments/${commentsId}`)
        .send({ password: "ReplyPass123!" });

      expect(res.status).toBe(404);
    });
    /**
     * 비밀번호가 일치하지 않을 경우
     * 답글 삭제 요청이 차단되는지 검증합니다.
     *
     * - DELETE /comments/{commentsId}
     * 요청 데이터
     *   password (불일치)
     * 기대결과
     * - 403 Forbidden
     */
    test("답글 삭제 - 비밀번호 불일치 시 403", async () => {
      const res = await request(app)
        .delete(`/comments/${commentsId}`)
        .send({ password: "wrong_password" });

      expect(res.status).toBe(403);
    });
  });

});
