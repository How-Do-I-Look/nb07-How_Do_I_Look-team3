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
    return Math.ceil(totalItemCount / pageSize);
}

/**
 * 페이지네이션에 필요한 메타데이터(skip, totalPages, currentPage)를 계산하여 반환합니다.
 */
export function getPaginationMetadata({ totalItemCount, page, pageSize }) {
    const currentPage = page > 0 ? page : 1;

    // 전체 페이지 수 계산
    const totalPages = calculateTotalPages(totalItemCount, pageSize);

    // OFFSET(skip) 값 계산
    const skip = (currentPage - 1) * pageSize;

    return {
        currentPage,
        totalPages,
        skip
    };
}
