/**
 * 객체에서 null 또는 undefined인 필드를 제거하여 새로운 객체를 반환합니다.
 * 이 함수는 toJSON() 메소드에서 API 응답을 정리할 때 사용됩니다.
 * * @param {object} obj - 필터링할 원본 객체
 * @returns {object} null/undefined 필드가 제거된 객체
 */
export function removeNullFields(obj) {
  const newObj = {};
  for (const key in obj) {
    // 객체 자신의 속성인지 확인 (상속된 속성 방지)
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      // null 또는 undefined가 아닌 필드만 복사합니다.
      if (value !== null && value !== undefined) {
        newObj[key] = value;
      }
    }
  }
  return newObj;
}
