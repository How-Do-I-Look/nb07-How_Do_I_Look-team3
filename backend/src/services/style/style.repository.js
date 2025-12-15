import { prisma } from '../../utils/prisma.js';
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
        //전체 랭킹 정렬 (큐레이팅 수 > 조회수 )
        else if (sortBy === 'total') {
            orderBy.push({ curation_count: 'desc'}, {views: 'desc'},{ id: 'desc' });
        }
        //트랜디 정렬 (조회순 기준으로)
        else if (sortBy === 'trendy') {
            orderBy.push({views: 'desc'}, {created_at:'desc'});
        }
        //가성비 정렬 (costEffectiveness)
        else if (sortBy === 'costEffectiveness') {
            orderBy.push({
                curations :{
                    some:{
                costEffectiveness: {

                }
                    }
                }
            })
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
                    tags: { //연결 모델중
                    some: {
                    tag: {
                name: containsKeyword // Tag의 'name' 필드에 키워드가 포함되는지 확인
                 }
                }
               }
             });
            }
            if (searchConditions.length > 0) {
                whereConditions.OR = searchConditions;
            }
           }
           console.log(whereConditions);

        // 실제 데이터 조회
        const styles = await prisma.style.findMany({
            skip: skip,
            take: pageSize,
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
