export function getPagination({ totalItemCount, page, pageSize }) {
    if (totalItemCount === 0 || pageSize === 0) {
        return { currentPage: page, totalPages: 0, totalItemCount: 0 };
    }

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalItemCount / pageSize);

    // offset 값 계산
    const skip = (page - 1) * pageSize;

    return {
        currentPage: page,
        totalPages,
        totalItemCount,
        skip
    };
}
