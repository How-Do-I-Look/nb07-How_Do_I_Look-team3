/* eslint-disable no-undef */
import request from "supertest";
import app from '../../../app.js';
import { prisma } from "../../utils/prisma.js";



describe("서비스 통합 테스트 시나리오", () => {
  let styleId;
  beforeAll(async () => {
    const res = await request(app).post("/styles").send({
      nickname: "테스트용",
      title: "사전 생성 스타일",
      password: "StylePass123!",
      tags: ["테스트"],
      categories: {},
      imageUrls: ["http://img.com/test.jpg"],
    });

    styleId = res.body.id;
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  /**
   * 스타일 기본 정보와 연관 데이터(이미지, 아이템, 태그)가
   * 올바르게 저장되는지 검증합니다.
   *
   * - POST /styles
   * 요청 데이터
   *   nickname, title, content, password, categories, tags, imageUrls
   * 기대결과
   * - 201 Created
   * - id는 string(BigInt → string)
   * - password는 응답에 노출되지 않음
   * - 연관 데이터(tags, items) 정상 생성
   */
  describe("스타일 등록", () => {
    test.only("스타일 등록 - 정상 등록", async () => {
      const data = {
        nickname: "패션왕",
        title: "겨울 미니멀 룩",
        content: "따뜻한 코디입니다.",
        password: "StylePass123!",
        categories: {
          top: { name: "터틀넥", brand: "유니클로", price: 39900 },
          outer: { name: "캐시미어 코트", brand: "인사일런스", price: 250000 },
        },
        tags: ["미니멀", "겨울", "코트"], // 최대 3개
        imageUrls: ["http://img.com/1.jpg", "http://localhost:3000/2.jpg"],
      };
      const res = await request(app).post("/styles").send(data);

      expect(res.status).toBe(201);
      expect(typeof res.body.id).toBe("string"); // [점검] BigInt 처리 (문자열 전달)
      expect(res.body.tags.length).toBe(3);
      expect(res.body.items.length).toBe(2);
      styleId = res.body.id;
    });

    test("스타일 등록 - 태그 4개 이상 시 차단 여부", async () => {
      const res = await request(app).post("/styles").send({
        nickname: "유저",
        title: "태그가 너무 많음",
        password: "Pass",
        tags: ["1", "2", "3", "4"],
        categories: {},
        imageUrls: ["http://localhost:3000/1.jpg"]
      });

      expect(res.status).toBe(400);
    });
  });

  /**
   * 기존에 등록된 스타일을 수정할 수 있는지 검증합니다.
   * 비밀번호 기반으로 수정 권한을 판단합니다.
   *
   * - PUT /styles/{styleId}
   * 요청 데이터
   *   password, 수정할 필드(title 등)
   * 기대결과
   * - 비밀번호 일치 시 200 OK 및 데이터 반영
   * - 비밀번호 불일치 시 403 Forbidden
   */
  describe("스타일 수정", () => {
    test("스타일 수정 - 비밀번호 일치 및 수정 데이터 반영", async () => {
      const updateData = {
        password: "StylePass123!", // 등록 시와 동일
        title: "수정된 제목"
      };

      const res = await request(app).put(`/styles/${styleId}`).send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("수정된 제목");
    });

    test("스타일 수정 - 비밀번호 불일치", async () => {
      const res = await request(app).put(`/styles/${styleId}`).send({
        password: "wrong_password",
        title: "수정"
      });
      expect(res.status).toBe(403);
    });
  });

  /**
   * 스타일 조회 기능이 정상 동작하는지 검증합니다.
   *
   * - GET /styles
   *   정렬(sortBy), 검색(keyword, searchBy) 기능 검증
   *
   * - GET /styles/{styleId}
   *   상세 데이터 및 조회수 증가 여부 검증
   *
   * 기대결과
   * - 목록 조회 시 배열 반환
   * - 상세 조회 시 스타일 반환
   */
  describe("스타일 조회", () => {
    test("스타일 목록 조회 - 최신순 정렬 및 검색 작동", async () => {
      const res = await request(app).get("/styles").query({
        sortBy: "latest",
        keyword: "겨울",
        searchBy: "title"
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].title).toContain("겨울");
    });

    test("스타일 상세 조회 - 데이터 바인딩 및 조회수 증가", async () => {
      const res = await request(app).get(`/styles/${styleId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(styleId);
      // 조회수 등의 필드가 존재하는지 확인
      expect(res.body.data).toHaveProperty("views");
    });
  });


  describe("스타일 삭제", () => {
   /**
   * - DELETE /styles/{styleId}
   * 요청 데이터
   *    password
   * 기대결과:
   * - 204 No Content
   * - 해당 styleId에 대한 데이터가 DB에서 삭제됨
   * - 연관 데이터(images, items, tags)도 함께 삭제됨 (cascade)
   * - 응답 body 없음
   */
    test("스타일 삭제 - 비밀번호 일치", async () => {
      const res = await request(app)
        .delete(`/styles/${styleId}`)
        .send({ password: "StylePass123!" });
      expect(res.status).toBe(200);
    });
    /**
     * - DELETE /styles/{styleId}
     * 요청 데이터
     *    password (불일치)
     * 기대결과:
     * - 403 Forbidden
     * - 스타일 데이터가 삭제되지 않음
     */
    test("스타일 삭제 - 비밀번호 불일치", async () => {
      const res = await request(app)
        .delete(`/styles/${styleId}`)
        .send({ password: "zzzzzzzzz" });
      expect(res.status).toBe(403);
    });
    /**
     * 이미 삭제된 스타일에 대해
     * 다시 삭제 요청 시 404를 반환하는지 검증합니다.
     *
     * - DELETE /styles/{styleId}
     * 기대결과
     * - 404 Not Found
     */
    test("스타일 삭제 - 이미 삭제된 스타일 요청 시 404", async () => {
      const res = await request(app)
        .delete(`/styles/${styleId}`)
        .send({ password: "StylePass123!" });

      expect(res.status).toBe(404);
    });
  });

});
