/* eslint-disable no-undef */
import request from "supertest";
import app from '../../../app.js';
import { prisma } from "../../utils/prisma.js";

describe("태그 통합 테스트 시나리오", () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe("태그 등록", () => {
    /**
     * 스타일 등록 시 태그가 정상적으로 생성되고
     * 스타일과 연결되는지 검증합니다.
     *
     * - POST /styles
     * 요청 데이터
     *   tags (1~3개)
     * 기대결과
     * - 201 Created
     * - tags 배열 길이가 요청한 개수와 일치
     * - 각 태그는 name 필드를 가짐
     */
    test("태그 생성 - 스타일 등록 시 정상 생성", async () => {
      const res = await request(app).post("/styles").send({
        nickname: "태그테스트",
        title: "태그 테스트 룩",
        password: "TagPass123!",
        tags: ["미니멀", "블랙"],
        categories: {},
        imageUrls: ["http://img.com/tag.jpg"],
      });

      expect(res.status).toBe(201);
      expect(Array.isArray(res.body.tags)).toBe(true);
      expect(res.body.tags.length).toBe(2);
      expect(res.body.tags[0]).toHaveProperty("name");
    });
     /**
     * 태그 개수가 정책(최대 3개)을 초과할 경우
     * 스타일 등록이 차단되는지 검증합니다.
     *
     * - POST /styles
     * 요청 데이터
     *   tags 4개 이상
     * 기대결과
     * - 400 Bad Request
     */
    test("태그 생성 - 태그 4개 이상 시 400 반환", async () => {
      const res = await request(app).post("/styles").send({
        nickname: "태그초과",
        title: "태그가 너무 많음",
        password: "TagPass123!",
        tags: ["1", "2", "3", "4"],
        categories: {},
        imageUrls: ["http://img.com/tag2.jpg"],
      });

      expect(res.status).toBe(400);
    });
  });
  describe("태그 수정", () => {
    /**
     * 스타일 수정 시 태그 목록이 변경되면
     * 기존 태그 연결이 해제되고 새로운 태그로 갱신되는지 검증합니다.
     *
     * - PUT /styles/{styleId}
     * 요청 데이터
     *   password, tags
     * 기대결과
     * - 200 OK
     * - tags 배열이 수정된 값으로 반영됨
     */
    test("태그 수정 - 스타일 수정 시 태그 갱신", async () => {
      const create = await request(app).post("/styles").send({
        nickname: "수정용",
        title: "태그 수정 테스트",
        password: "TagPass123!",
        tags: ["캐주얼"],
        categories: {},
        imageUrls: ["http://img.com/edit.jpg"],
      });

      const styleId = create.body.id;

      const res = await request(app)
        .put(`/styles/${styleId}`)
        .send({
          password: "TagPass123!",
          tags: ["미니멀", "포멀"],
        });

      expect(res.status).toBe(200);
      expect(res.body.tags.length).toBe(2);
      expect(res.body.tags.map(t => t.name)).toContain("포멀");
    });
  });
  describe("태그 조회", () => {
    /**
     * 스타일 상세 조회 시
     * 태그 목록이 함께 반환되는지 검증합니다.
     *
     * - GET /styles/{styleId}
     * 기대결과
     * - 200 OK
     * - tags 배열 존재
     */
    test("태그 조회 - 스타일 상세에 태그 포함", async () => {
      const create = await request(app).post("/styles").send({
        nickname: "조회용",
        title: "태그 조회 테스트",
        password: "TagPass123!",
        tags: ["클래식", "포멀"],
        categories: {},
        imageUrls: ["http://img.com/view.jpg"],
      });

      const styleId = create.body.id;

      const res = await request(app).get(`/styles/${styleId}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.tags)).toBe(true);
      expect(res.body.data.tags.length).toBe(2);
    });
    /**
     * 태그를 기준으로 스타일 목록을 조회할 수 있는지 검증합니다.
     *
     * - GET /styles?tag={tagName}
     * 기대결과
     * - 200 OK
     * - 해당 태그를 포함한 스타일만 반환
     */
    test("태그 조회 - 태그 기준 스타일 검색", async () => {
      const res = await request(app)
        .get("/styles")
        .query({ tag: "미니멀" });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
  describe("태그 삭제", () => {
    /**
     * 스타일이 삭제될 경우
     * 해당 스타일과 태그의 연결만 해제되고
     * 태그 자체는 삭제되지 않는지 검증합니다.
     *
     * - DELETE /styles/{styleId}
     * 기대결과
     * - 스타일 삭제 성공
     * - 태그 레코드는 유지됨
     */
    test("태그 삭제 정책 - 스타일 삭제 시 태그는 유지", async () => {
      const create = await request(app).post("/styles").send({
        nickname: "삭제용",
        title: "태그 삭제 정책",
        password: "TagPass123!",
        tags: ["유지태그"],
        categories: {},
        imageUrls: ["http://img.com/delete.jpg"],
      });

      const styleId = create.body.id;

      await request(app)
        .delete(`/styles/${styleId}`)
        .send({ password: "TagPass123!" });

      const tagCount = await prisma.tag.count({
        where: { name: "유지태그" },
      });

      expect(tagCount).toBe(1);
    });
  });
});
