// //프론트엔드 코드
export const getGalleryStyles = async (
  params: GalleryStylesSearchParams,
): Promise<PaginationResponse<GalleryStyle>> => {
  const urlParams = new URLSearchParams()
  urlParams.set('sortBy', params.sortBy)
  urlParams.set('searchBy', params.searchBy)
  urlParams.set('keyword', params.keyword)
  urlParams.set('tag', params.tag)
  urlParams.set('page', params.page?.toString() ?? '1')
  urlParams.set('pageSize', GALLERY_STYLES_PAGE_SIZE.toString())
  const query = urlParams.toString()

  const response = await fetch(`${BASE_URL}/styles?${query}`, {
    next: { tags: ['galleryStyles'] },
  })
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json()
  return { currentPage, totalPages, totalItemCount, data }
}

export const getGalleryTags = async () => {
  const response = await fetch(`${BASE_URL}/tags`, {
    next: { tags: ['galleryTags'] },
  })
  const { tags } = await response.json()
  return { tags }
}

export const getRankingStyles = async (
  params: RankingStylesSearchParams,
): Promise<PaginationResponse<RankingStyle>> => {
  const urlParams = new URLSearchParams()
  urlParams.set('rankBy', params.rankBy)
  urlParams.set('page', params.page.toString())
  urlParams.set('pageSize', RANKING_STYLES_PAGE_SIZE.toString())
  const query = urlParams.toString()

  const response = await fetch(`${BASE_URL}/ranking?${query}`, {
    next: { tags: ['rankingStyles'] },
  })
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json()
  return { currentPage, totalPages, totalItemCount, data }
}


export const getStyle = async (styleId: number): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`)
  const style = await response.json()
  return style
}