'use client'

import { type Dog, mockDogs } from '@/lib/mock-dogs'

export function useDogCatalog(): Dog[] {
  // Return the dogs in reverse order to show the 'latest added' first
  return [...mockDogs].reverse()
}
