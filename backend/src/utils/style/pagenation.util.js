/**
 * 총 아이템 수와 페이지 크기를 기반으로 전체 페이지 수를 계산합니다.
 * @param {number} totalItemCount - 전체 아이템 수
 * @param {number} pageSize - 페이지당 아이템 수
 * @returns {number} 전체 페이지 수 (totalPages)
 */
export function calculateTotalPages(totalItemCount, pageSize) {
    if (totalItemCount === 0 || pageSize === 0) {
        return 0;
    }
    // Math.ceil()을 사용하여 나머지가 있으면 올림 처리합니다.
    return Math.ceil(totalItemCount / pageSize);
}