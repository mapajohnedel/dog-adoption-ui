import { BrowsePageClient } from '@/components/browse/browse-page-client'
import { listPublishedPets, type PetFilters } from '@/lib/pets/server'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BrowsePage({ searchParams }: Props) {
  const params = await searchParams
  const pageStr = typeof params.page === 'string' ? params.page : '1'
  const page = parseInt(pageStr, 10) || 1

  const filters: PetFilters = {
    species: typeof params.species === 'string' ? params.species : undefined,
    breed: typeof params.breed === 'string' ? params.breed : undefined,
    size: typeof params.size === 'string' ? params.size : undefined,
    location: typeof params.location === 'string' ? params.location : undefined,
  }

  const { data: dogs, count, totalPages } = await listPublishedPets(filters, page)

  return (
    <BrowsePageClient
      dogs={dogs}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count}
    />
  )
}
