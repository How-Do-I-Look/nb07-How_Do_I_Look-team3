'use client'

import { useEffect, useState } from 'react'
import UiGalleryStyleList from '../ui-gallery/UiGalleryStyleList'
import { GalleryStyle, GalleryStylesSearchParams } from '@services/types'
import getGalleryStyles from '../data-access-gallery/getGalleryStyles'
import useIntersect from '@libs/shared/util-hook/useIntersect'

type GalleryStyleListProps = {
  searchParams: GalleryStylesSearchParams
  initialStyles: GalleryStyle[]
  initialHasNext: boolean
  initialCursor: string | null
}

const GalleryStyleList = ({ searchParams, initialStyles, initialHasNext, initialCursor }: GalleryStyleListProps) => {
  const [styles, setStyles] = useState(initialStyles)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(initialHasNext)
  const [cursor, setCursor] = useState(initialCursor)

  const loadMoreStyles = async () => {
    const newPage = page + 1
    const { data: newStyles, currentPage, totalPages, lastElemCursor } = await getGalleryStyles({
      ...searchParams,
      page: newPage,
      cursor: cursor ?? undefined,
    })

    setStyles((prevStyles) => [...prevStyles, ...newStyles])
    setPage(newPage)
    setHasNext(currentPage < totalPages)
    setCursor(lastElemCursor)
  }
  const ref = useIntersect(
    async (entry, observer) => {
      observer.unobserve(entry.target)
      if (hasNext) {
        await loadMoreStyles()
        observer.observe(entry.target)
      }
    },
    { rootMargin: '0px 0px 500px' },
  )

  useEffect(() => {
    setStyles(initialStyles)
    setHasNext(initialHasNext)
    setPage(1)
    setCursor(initialCursor)
  }, [initialStyles, initialHasNext, initialCursor])

  return (
    <>
      <UiGalleryStyleList styles={styles} />
      <div ref={ref} style={{ height: '1px' }} />
    </>
  )
}

export default GalleryStyleList
