'use client'

import { usePathname, useSearchParams } from 'next/navigation'

const useUpdateQueryURL = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateQueryURL = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([name, value]) => {
      if (value === null || value === undefined) {
        params.delete(name)
      } else {
        params.set(name, value.toString())
      }
    })

    return `${pathname}?${params.toString()}`
  }

  return { updateQueryURL }

}

export default useUpdateQueryURL
