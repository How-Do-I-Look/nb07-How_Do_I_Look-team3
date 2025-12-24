#!/bin/bash
set -euo pipefail

############################
# Config
############################
BASE_URL="${BASE_URL:-http://localhost:3000}"
PASSWORD="test-password123"
WRONG_PASSWORD="wrong123"

############################
# Stats
############################
PASSED=0
FAILED=0

############################
# Utils
############################
log() {
  echo -e "\n\033[1;34m▶ $1\033[0m"
}

success() {
  echo -e "\033[1;32m✔ SUCCESS\033[0m"
  ((PASSED++)) || true
}

fail() {
  echo -e "\033[1;31m✘ FAIL: $1\033[0m"
  ((FAILED++)) || true
}

api_call() {
  local method=$1
  local endpoint=$2
  local data=${3:-}
  local result

  if [[ -n "$data" ]]; then
    result=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$BASE_URL$endpoint")
  else
    result=$(curl -s -w "\n%{http_code}" -X "$method" \
      "$BASE_URL$endpoint")
  fi

  echo "$result"
}

check_status() {
  local response=$1
  local expected=$2
  local status=$(echo "$response" | tail -1)

  if [[ "$status" == "$expected" ]]; then
    success
  else
    fail "Expected $expected, got $status"
    echo "Response: $(echo "$response" | sed '$d')"
  fi
}

############################
# Scenario 1: Style Lifecycle
############################
log "[Scenario 1] Style Lifecycle (Create -> Get -> Update -> Delete)"

# 1. Create Style
log "1-1. Create Style (POST /styles)"
STYLE_DATA='{
  "nickname": "tester",
  "title": "테스트 스타일",
  "content": "자동화 테스트용 스타일",
  "password": "'$PASSWORD'",
  "categories": {
    "top": { "name": "셔츠", "brand": "Uniqlo", "price": 30000 },
    "bottom": { "name": "청바지", "brand": "Levis", "price": 80000 }
  },
  "tags": ["캐주얼", "테스트"],
  "imageUrls": ["https://example.com/test.jpg"]
}'
RESPONSE=$(api_call POST "/styles" "$STYLE_DATA")
check_status "$RESPONSE" "201"
BODY=$(echo "$RESPONSE" | sed '$d')
STYLE_ID=$(echo "$BODY" | jq -r '.id')

# 2. Get Style Detail
log "1-2. Get Style Detail (GET /styles/$STYLE_ID)"
RESPONSE=$(api_call GET "/styles/$STYLE_ID")
check_status "$RESPONSE" "200"

# 3. Update Style (Success)
log "1-3. Update Style (PUT /styles/$STYLE_ID)"
UPDATE_DATA='{
  "nickname": "tester",
  "title": "수정된 제목",
  "content": "수정된 내용",
  "password": "'$PASSWORD'",
  "categories": {
    "top": { "name": "니트", "brand": "Zara", "price": 50000 }
  },
  "tags": ["수정됨"],
  "imageUrls": ["https://example.com/updated.jpg"]
}'
RESPONSE=$(api_call PUT "/styles/$STYLE_ID" "$UPDATE_DATA")
check_status "$RESPONSE" "200"

# 4. Update Style (Wrong Password - 403)
log "1-4. Update Style with Wrong Password (PUT /styles/$STYLE_ID)"
WRONG_UPDATE_DATA=$(echo "$UPDATE_DATA" | jq '.password = "'$WRONG_PASSWORD'"')
RESPONSE=$(api_call PUT "/styles/$STYLE_ID" "$WRONG_UPDATE_DATA")
check_status "$RESPONSE" "403"

# 5. Delete Style (Wrong Password - 403)
log "1-5. Delete Style with Wrong Password (DELETE /styles/$STYLE_ID)"
RESPONSE=$(api_call DELETE "/styles/$STYLE_ID" '{"password": "'$WRONG_PASSWORD'"}')
check_status "$RESPONSE" "403"

# 6. Delete Style (Success)
log "1-6. Delete Style (DELETE /styles/$STYLE_ID)"
RESPONSE=$(api_call DELETE "/styles/$STYLE_ID" '{"password": "'$PASSWORD'"}')
check_status "$RESPONSE" "200"

# 7. Get Deleted Style (404)
log "1-7. Get Deleted Style (GET /styles/$STYLE_ID)"
RESPONSE=$(api_call GET "/styles/$STYLE_ID")
check_status "$RESPONSE" "404"

############################
# Scenario 2: List & Ranking
############################
log "[Scenario 2] Style List & Ranking (Filter, Sort, Rank)"

# 1. List Styles
log "2-1. List Styles (GET /styles)"
RESPONSE=$(api_call GET "/styles?page=1&pageSize=10")
check_status "$RESPONSE" "200"

# 2. Sort Styles
log "2-2. Sort Styles by mostViewed (GET /styles?sortBy=mostViewed)"
RESPONSE=$(api_call GET "/styles?sortBy=mostViewed")
check_status "$RESPONSE" "200"

# 3. Search Styles
log "2-3. Search Styles by title (GET /styles?searchBy=title&keyword=테스트)"
RESPONSE=$(api_call GET "/styles?searchBy=title&keyword=%ED%85%8C%EC%8A%A4%ED%8A%B8")
check_status "$RESPONSE" "200"

# 4. Filter by Tag
log "2-4. Filter Styles by tag (GET /styles?tag=캐주얼)"
RESPONSE=$(api_call GET "/styles?tag=%EC%BA%90%EC%A3%BC%EC%96%BC")
check_status "$RESPONSE" "200"

# 5. Ranking - Total
log "2-5. Ranking by Total (GET /ranking?rankBy=total)"
RESPONSE=$(api_call GET "/ranking?rankBy=total")
check_status "$RESPONSE" "200"

# 6. Ranking - Trendy
log "2-6. Ranking by Trendy (GET /ranking?rankBy=trendy)"
RESPONSE=$(api_call GET "/ranking?rankBy=trendy")
check_status "$RESPONSE" "200"

############################
# Scenario 3: Curation & Comment
############################
log "[Scenario 3] Curation & Comment (Create, List, Update, Delete)"

# 임시 스타일 생성 (큐레이팅 테스트용)
RESPONSE=$(api_call POST "/styles" "$STYLE_DATA")
STYLE_ID=$(echo "$RESPONSE" | sed '$d' | jq -r '.id')

# 1. Create Curation
log "3-1. Create Curation (POST /styles/$STYLE_ID/curations)"
CURATION_DATA='{
  "nickname": "curator",
  "content": "멋진 스타일이네요!",
  "password": "'$PASSWORD'",
  "trendy": 5,
  "personality": 4,
  "practicality": 4,
  "costEffectiveness": 5
}'
RESPONSE=$(api_call POST "/styles/$STYLE_ID/curations" "$CURATION_DATA")
check_status "$RESPONSE" "200"
CURATION_ID=$(echo "$RESPONSE" | sed '$d' | jq -r '.id')

# 2. List Curations
log "3-2. List Curations (GET /styles/$STYLE_ID/curations)"
RESPONSE=$(api_call GET "/styles/$STYLE_ID/curations")
check_status "$RESPONSE" "200"

# 3. Create Comment
log "3-3. Create Comment (POST /curations/$CURATION_ID/comments)"
COMMENT_DATA='{
  "content": "감사합니다!",
  "password": "'$PASSWORD'"
}'
RESPONSE=$(api_call POST "/curations/$CURATION_ID/comments" "$COMMENT_DATA")
check_status "$RESPONSE" "200"
COMMENT_ID=$(echo "$RESPONSE" | sed '$d' | jq -r '.id')

# 4. Update Comment
log "3-4. Update Comment (PUT /comments/$COMMENT_ID)"
RESPONSE=$(api_call PUT "/comments/$COMMENT_ID" '{"content": "수정된 감사 인사", "password": "'$PASSWORD'"}')
check_status "$RESPONSE" "200"

# 5. Delete Comment
log "3-5. Delete Comment (DELETE /comments/$COMMENT_ID)"
RESPONSE=$(api_call DELETE "/comments/$COMMENT_ID" '{"password": "'$PASSWORD'"}')
check_status "$RESPONSE" "200"

# 6. Update Curation
log "3-6. Update Curation (PUT /curations/$CURATION_ID)"
RESPONSE=$(api_call PUT "/curations/$CURATION_ID" '{"nickname": "curator", "content": "수정된 평가", "password": "'$PASSWORD'", "trendy": 3, "personality": 3, "practicality": 3, "costEffectiveness": 3}')
check_status "$RESPONSE" "200"

# 7. Delete Curation
log "3-7. Delete Curation (DELETE /curations/$CURATION_ID)"
RESPONSE=$(api_call DELETE "/curations/$CURATION_ID" '{"password": "'$PASSWORD'"}')
check_status "$RESPONSE" "200"

############################
# Scenario 4: Misc (Tags & Images)
############################
log "[Scenario 4] Misc (Tags & Image Upload)"

# 1. Get Popular Tags
log "4-1. Get Tags (GET /tags)"
RESPONSE=$(api_call GET "/tags")
check_status "$RESPONSE" "200"

# 2. Image Upload
log "4-2. Upload Image (POST /images)"
TEST_IMAGE="/tmp/test-image-$$.png"
echo -n -e '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0a\x49\x44\x41\x54\x78\x9c\x63\x00\x01\x00\x00\x05\x00\x01\x0d\x0a\x2d\xb4\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > "$TEST_IMAGE"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST -F "image=@$TEST_IMAGE" "$BASE_URL/images")
rm -f "$TEST_IMAGE"
check_status "$RESPONSE" "201"

echo -e "\n========================================="
echo -e "\033[1;36m최종 테스트 결과 요약\033[0m"
echo -e "========================================="
echo -e "총 성공: $PASSED"
echo -e "총 실패: $FAILED"
echo -e "=========================================\n"

if [[ $FAILED -eq 0 ]]; then
  echo -e "\033[1;32m✔ ALL SCENARIOS PASSED!\033[0m\n"
  exit 0
else
  echo -e "\033[1;31m✘ SOME TESTS FAILED!\033[0m\n"
  exit 1
fi
