'use server'

import { getRankingStyles as getRankingStylesApi } from '@services/api'
import { RankingStylesSearchParams } from '@services/types'

const getRankingStyles = async ({ rankBy, page, cursor }: RankingStylesSearchParams) => {
  const response = await getRankingStylesApi({ rankBy, page, cursor })
  return response
}

export default getRankingStyles
