# 🚀 팀 프로젝트 Git 협업 규칙 — 실전 버전



## ✅ 1) 브랜치 규칙 (Branch Rule)
<예시 구조>
- main — 완성된 안정 버전만
- dev — 기능 모으는 통합 브랜치(선택)
  - feature/김수빈-담당_뭐시기
  - feature/이보라-담당_뭐시기
  - feature/송형욱-담당_뭐시기
  - feature/지근영-담당_뭐시기
  - feature/김관규-담당_뭐시기

#### ✔ 브랜치 이름 규칙
feature/본인이름-기능명
예) feature/subin-article




## ✅ 2) 팀원이 자신의 브랜치에서 작업했을 때, 팀에게 알려주는 방식
1. 커밋 푸시 후 Discord/단톡/노션에 간단 보고
메시지 형식 통일시키면 팀 관리가 편함.

[업데이트] feature/subin-article 브랜치 푸시함

변경 사항:
- Article 작성 API 완성
- Prisma schema에 Article 모델 추가
- Post 요청 validation 추가

다른 브랜치랑 충돌 가능성: 거의 없음 / 약간 있음 / 있음
이런 식으로 줄 요약 방식으로 보고하면 됨.




## ✅ 3) Pull Request 규칙 (PR Rule)
✔ PR 보낼 때 꼭 포함해야 하는 정보
PR은 팀 문서라고 생각하면 됨.

### 작업 내용
- what: 무엇을 만들었는지
- why: 왜 필요한지
- how: 어떻게 구현했는지

### 테스트 방법
- 로컬에서 postman 사용해 테스트한 기록 추가

### 리뷰 요청 포인트
- validation 이 부분 확인 필요
- prisma 명세 추가된 부분 확인 필요
✔ PR Reviewer 지정
팀원 두 명 이상이 리뷰 후 approve 해야 머지 가능 → 이걸 강제하려면 GitHub에서 Protect Branch 설정 가능




## ✅ 4) 팀원들이 서로의 변경 사항을 가져오는 규칙
- 항상 다음 순서로 진행: PR 머지됨
- 팀장이 메인 업데이트 알림 전송
- 팀원 명령어 실행
  - git switch main
  - git pull origin main
- 각자 브랜치 최신화:
  - git switch feature/subin-article
  - git merge main 또는 git rebase main

→ 팀원들의 브랜치는 항상 main 기반이어야 한다.



## ✅ 5) 충돌(conflict) 발생 시 규칙
#### 마스터가 팀장이라면 아래처럼 공표하면 됨

- 충돌 난 사람은 절대 혼자 해결하지 말고 단톡방에 알려라
- 충돌 메시지를 그대로 캡쳐하고 공유
- 충돌난 파일을 팀원 2명 이상 함께 보면서 해결
- 충돌 해결 후 푸시할 때는:
  ```
  git add .
  git commit -m "fix: conflict resolved"
  git push
  ```



## ✅ 6) 메시지 템플릿(팀에게 보고용)
### 👤 작업 완료 보고 템플릿
[작업 완료] feature/subin-article 브랜치

#### <수정 사항>
- Article CRUD 구현 등등

#### 다음 작업
- 댓글 API 예정

#### PR 보냄 → 리뷰 부탁!
📌 main 업데이트 템플릿
📌 main 브랜치 최신화 알림

#### <머지된 내용>
- auth 기능
- group 기능 일부

#### 👇 업데이트 명령어
```
git switch main
git pull origin main
```

#### 👇 본인 브랜치 최신화 명령어
```
git switch feature/subin-article
git merge main
```




### 🚀 7) 팀에서 반드시 금지해야 할 5가지

❌ main에서 직접 코딩

❌ 팀원 브랜치 코드에 허락 없이 수정

❌ PR 없이 바로 merge

❌ 로컬 main을 pull 안 받아놓고 PR 보내는 행위

❌ “commit 1, commit 2, final” 같은 의미 없는 커밋 메시지
