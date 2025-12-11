
import { prisma } from '../../utils/prisma.js'; 


// - `page` : number (현재 페이지 번호)
// - `pageSize` : number (페이지당 아이템 수)
// - `sortBy` : latest | mostViewed | mostCurated (정렬 기준)
// - `searchBy` : nickname | title | content | tag (검색 기준)
// - `keyword` : string (검색어)


class StylesRepository {

    async findStylesWithOffset({ page, pageSize, sortBy, searchBy, keyword, tag }) {
        
        // OFFSET 값 계산 (
        const currentPage = page > 0 ? page : 1; // 페이지 번호가 1 미만일 경우 1로 설정
        const skip = (currentPage - 1) * pageSize; // OFFSET 값 = (현재 페이지 - 1) * 페이지당 아이템 수

        // 쿼리 조건 준비 
        const whereConditions = {}; //필터링 조건
        const orderBy = [];  //정렬 조건 

        
        // 최신순 (latest)
        if (sortBy === 'latest') {
            orderBy.push({ createdAt: 'desc' }, { id: 'desc' });
        } 
        // 조회순 (mostViewed)
        else if (sortBy === 'mostViewed') {
            orderBy.push({ views: 'desc' }, { id: 'desc' });
        } 
        // 큐레이팅순 (mostCurated)
        else if (sortBy === 'mostCurated') {
            orderBy.push({ curationCount: 'desc' }, { id: 'desc' }); 
        }

        //  태그 필터링 조건
        if (tag) {
            const tagsArray = tag.split(',').map(t => t.trim()); 
            whereConditions.tags = {
                some: { 
                    tag: { name: { in: tagsArray } }
                }
            };
        }

        // 검색 조건 추가 
        if (keyword && searchBy) {
            const searchConditions = [];
            if (searchConditions.length > 0) {
                whereConditions.AND = [whereConditions.AND, { OR: searchConditions }].filter(Boolean);
            }
        }
        

        // 실제 데이터 조회
        const styles = await prisma.style.findMany({ 
            skip: skip, 
            take: pageSize, 
            where: whereConditions,
            orderBy: orderBy, 
            
            include: { 
                user: { select: { nickname: true } }, 
                images: { where: { isRepresentative: true }, select: { url: true } }, 
                tags: { select: { tag: { select: { name: true } } } } 
            }
        });
        
        // 전체 아이템 개수 조회 (총 페이지 수를 계산하기 위해 필수)
        const totalItemCount = await prisma.style.count({ 
            where: whereConditions 
        });

        // 결과 반환 (styles, totalItemCount 모두 반환)
        return { 
            styles, 
            totalItemCount 
        };
    }
}

export const stylesRepository = new StylesRepository();