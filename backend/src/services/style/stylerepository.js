import { prisma } from '../../utils/prisma.js';
class StylesRepository {

    //전체 개수 조회 함수 (검색 개수 오류 우회를 위해 findMany().length 사용)
    async countStyles(whereConditions) {
        const countResult = await prisma.style.findMany({
            where: whereConditions,
            select: { id: true }
        });
        return countResult.length; // 정확한 검색 결과 개수 반환
    }

    //실제 스타일 목록 조회 함수 (skip, take, where 조건만 받음)
    async findStylesWithOffset({ skip, take, sortBy, where: whereConditions}) {

       const orderBy = this.getPrismaOrderByClause({ sortBy });

       // 실제 데이터 조회
       const styles = await prisma.style.findMany({
            skip: skip,
            take: take,
            where: whereConditions,
            orderBy: orderBy,

            include: {
                images: { where: { order: 1}, select: { path: true }, take:1 },
                items: true,
                tags: { select: { tag: { select: { name: true } } } }
            }
        });
        return styles;
    }
        //  WHERE 조건 생성 함수 (Service에서 호출할 수 있도록 분리)
        getPrismaWhereClause({ searchBy, keyword, tag }) {
        const whereConditions = {};

        // 태그 필터링 조건
        if (tag) {
            const tagsArray = tag.split(',').map(t => t.trim());
            whereConditions.tags = {
                some: {
                    tag: { name: { in: tagsArray } }
                }
            };
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


        //검색 조건
            if (keyword && searchBy) {
           const containsKeyword = { contains: keyword, mode: 'insensitive' };//대소문자 상관 없이
            const searchConditions = [];
           //닉네임 검색
            if (searchBy === 'author' || searchBy === 'all') {
                searchConditions.push({ author: containsKeyword});
            }
            //제목 검색
            if (searchBy === 'title' || searchBy === 'all') {
                searchConditions.push({title: containsKeyword});
            }
            // 스타일 상세 검색
            if (searchBy === 'description' || searchBy === 'all') {
                searchConditions.push({ description: containsKeyword });
            }
            //태그 검색
            if(searchBy === 'tags' || searchBy === 'all') {
                searchConditions.push({
                    tags: { some: {tag: {name: containsKeyword // Tag의 'name' 필드에 키워드가 포함되는지 확인
                                    }
                                }
                            }
                        });
            }
            if (searchConditions.length > 0) {
                whereConditions.AND = whereConditions.AND || [];
                whereConditions.AND.push({ OR: searchConditions });
            }
           }
           return whereConditions;
}

        getPrismaOrderByClause({ sortBy }) {
            const orderBy = [];
        // 최신순 (latest)
        if (sortBy === 'latest') {
            orderBy.push({ created_at: 'desc' }, { id: 'desc' });
        }
        // 조회순 (mostViewed)
        else if (sortBy === 'mostViewed') {
            orderBy.push({ views: 'desc' }, { id: 'desc' });
        }
        // 큐레이팅순 (mostCurated)
        else if (sortBy === 'mostCurated') {
            orderBy.push({ curation_count: 'desc' }, { id: 'desc' });
        }
        };
    }


export const stylesRepository = new StylesRepository();
