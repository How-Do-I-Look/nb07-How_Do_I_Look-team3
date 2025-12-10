/**
 * 요청된 커서 문자열을 DB 쿼리용 객체로 파싱합니다.
 * @param {string} cursor - 클라이언트로부터 받은 커서 문자열 (예: '12000_345' 또는 '999')
 * @param {string} sortBy - 정렬 기준 (latest, mostViewed, mostCurated)
 * @returns {{cursorViews: number|null, cursorId: number|null}}
 */
export function parseCursor(cursor, sortBy) {
    if (!cursor) {s
        return { cursorViews: null, cursorId: null };
    }

    // mostViewed, mostCurated는 복합 커서 (조회수/큐레이팅수 + ID) 사용
    if (sortBy === 'mostViewed' || sortBy === 'mostCurated') {
        const parts = cursor.split('_');
        if (parts.length === 2) {
            return {
                cursorViews: parseInt(parts[0]),
                cursorId: parseInt(parts[1])
            };
        }
    } 
    // latest는 ID 기반 단순 커서 사용
    else if (sortBy === 'latest') {
        return { 
            cursorViews: null, // ID만 사용
            cursorId: parseInt(cursor) 
        };
    }

    return { cursorViews: null, cursorId: null };
}

/**
 * DB 조회 결과의 마지막 아이템을 기준으로 다음 요청에 사용할 커서 문자열을 생성합니다.
 * @param {Array<Object>} styles - DB에서 조회된 스타일 목록 (pageSize + 1개)
 * @param {number} pageSize - 요청된 페이지 사이즈
 * @param {string} sortBy - 정렬 기준
 * @returns {string|null} - 다음 커서 문자열 또는 null
 */
export function generateNextCursor(styles, pageSize, sortBy) {
    const hasNext = styles.length > pageSize;
    if (!hasNext) {
        return null;
    }

    // 실제로 응답할 목록의 마지막 아이템을 가져옵니다.
    const lastItem = styles[pageSize - 1]; 
    
    if (sortBy === 'mostViewed' || sortBy === 'mostCurated') {
        // 복합 커서 생성 (예: '뷰수_ID' 또는 '큐레이팅수_ID')
        const field = sortBy === 'mostViewed' ? lastItem.views : lastItem.curationCount;
        return `${field}_${lastItem.styleId}`;
    } else if (sortBy === 'latest') {
        // 단순 커서 생성 (ID)
        return lastItem.styleId.toString();
    }

    return null;
}