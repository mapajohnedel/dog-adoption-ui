'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type BrowsePaginationProps = {
  currentPage: number
  totalPages: number
}

export function BrowsePagination({ currentPage, totalPages }: BrowsePaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(currentPage - 1)}
              onClick={(e) => {
                e.preventDefault()
                router.push(createPageUrl(currentPage - 1))
              }}
            />
          </PaginationItem>
        )}
        
        <PaginationItem>
          <span className="px-4 py-2 text-sm font-medium text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={createPageUrl(currentPage + 1)}
              onClick={(e) => {
                e.preventDefault()
                router.push(createPageUrl(currentPage + 1))
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
