// stringUtils.js

/**
 * 문자열이 비었는지 확인
 * null, undefined, "", "   " 모두 빈 값으로 처리
 */
export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

/**
 * 문자열이 존재하면 trim해서 반환하고,
 * 비어있으면 null 반환
 */
export function normalizeString(value) {
  return isEmpty(value) ? null : value.trim();
}

/**
 * a가 비었을 경우 b 반환 (fallback 기능)
 * - author가 비었으면 nickname 사용 등
 */
export function fallback(a, b) {
  return isEmpty(a) ? b : a;
}

/**
 * undefined/null이면 기본값 반환
 */
export function defaultValue(value, defaultVal = "") {
  return isEmpty(value) ? defaultVal : value;
}

/**
 * 안전한 문자열 변환기
 * - null/undefined → ""
 * - 숫자/boolean → 문자열로 변환
 */
export function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}
