import { prisma } from '../../utils/prisma.js';
class StylesRepository {

    //전체 아이템 개수 조회 (서비스 첫번쨰 호출용)
async countStyles({ searchBy, keyword, tag }) {
        const whereConditions = this.getPrismaWhereClause({ searchBy, keyword, tag });
        const totalItemCount = await prisma.style.count({
            where: whereConditions
        });

        return totalItemCount;
    }
        //실제 스타일 목록 조회 함수 (서비스 두번쨰 호출용)
        async findStylesWithOffset({ skip, take, sortBy, searchBy, keyword, tag }) {

        // 쿼리 조건 및 정렬 조건 준비
        const whereConditions = this.getPrismaWhereClause({ searchBy, keyword, tag });
        const orderBy = this.getPrismaOrderByClause({ sortBy });

        // 실제 데이터 조회
        const styles = await prisma.style.findMany({
            skip: skip,
            take: take,
            where: whereConditions,
            orderBy: orderBy,

           include: {
                images: { where: { order: 1}, //대표 이미지
                          select: { path: true },
                          take:1 },
                items: true,
                tags: { select: { tag: { select: { name: true } } } }
                }
              });
            return styles;
            }

        async getPrismaWhereClause({ searchBy, keyword, tag }) {
        const whereConditions = {}; //필터링 조건

        // 태그 필터링 조건
        if (tag) {
            const tagsArray = tag.split(',').map(t => t.trim());
            whereConditions.tags = {
                some: {
                    tag: { name: { in: tagsArray } }
                }
            };
        }
           //검샏 조건
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
                    tags: {
                        some: {
                            tag: {
                               name: containsKeyword // Tag의 'name' 필드에 키워드가 포함되는지 확인
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

        //정렬 조건
        getPrismaOrderByClause({ sortBy }) {
        const orderBy = [];
        // 기본 정렬 (최신순)
        if (orderBy.length === 0) {
            orderBy.push({ created_at: 'desc' }, { id: 'desc' });
        }
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
        return orderBy;

        }
    }

export const stylesRepository = new StylesRepository();
