export interface Dog {
  id: string
  name: string
  breed: string
  age: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  location: string
  image: string
  images: string[]
  description: string
  vaccinated: boolean
  neutered: boolean
  shelterName: string
  shelterEmail: string
  price?: number
}

// Using Unsplash image URLs for demo purposes
const dogImages = [
  'https://images.unsplash.com/photo-1633722715463-d30628519d68?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1587300411515-5b60a2c4cb08?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1587462382346-81342ee27537?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1601003834285-406ba2e636c0?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45b003493af0?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1537151608828-fac2d4547b0f?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1612536315141-3a2dba1e6e66?w=500&h=500&fit=crop',
]

export const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    size: 'large',
    location: 'San Francisco, CA',
    image: dogImages[0],
    images: [dogImages[0], dogImages[3], dogImages[6]],
    description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and swim. He\'s great with kids and other dogs.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Bay Area Dog Rescue',
    shelterEmail: 'info@bayareadog.org',
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Husky',
    age: 2,
    gender: 'female',
    size: 'large',
    location: 'Seattle, WA',
    image: dogImages[1],
    images: [dogImages[1], dogImages[4], dogImages[7]],
    description: 'Luna is a beautiful Husky with striking blue eyes. She\'s active, intelligent, and needs regular exercise. Perfect for an active family.',
    vaccinated: true,
    neutered: false,
    shelterName: 'Seattle Animal Shelter',
    shelterEmail: 'adopt@seattleanimal.org',
  },
  {
    id: '3',
    name: 'Charlie',
    breed: 'Labrador Mix',
    age: 5,
    gender: 'male',
    size: 'medium',
    location: 'Portland, OR',
    image: dogImages[2],
    images: [dogImages[2], dogImages[5], dogImages[8]],
    description: 'Charlie is a sweet and calm Labrador mix. He\'s perfect for families looking for a loyal companion. Good with kids and loves cuddles.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Portland Rescue Dogs',
    shelterEmail: 'contact@portlandrescue.org',
  },
  {
    id: '4',
    name: 'Bella',
    breed: 'German Shepherd',
    age: 4,
    gender: 'female',
    size: 'large',
    location: 'Los Angeles, CA',
    image: dogImages[3],
    images: [dogImages[3], dogImages[6], dogImages[9]],
    description: 'Bella is an intelligent and protective German Shepherd. She\'s well-trained and would be perfect as a family guardian.',
    vaccinated: true,
    neutered: true,
    shelterName: 'LA Dog Sanctuary',
    shelterEmail: 'help@ladogsanctuary.org',
  },
  {
    id: '5',
    name: 'Cooper',
    breed: 'Corgi',
    age: 2,
    gender: 'male',
    size: 'small',
    location: 'Austin, TX',
    image: dogImages[4],
    images: [dogImages[4], dogImages[7], dogImages[0]],
    description: 'Cooper is an adorable Corgi with tons of personality. He loves to play and is great for apartment living. Very food motivated!',
    vaccinated: true,
    neutered: true,
    shelterName: 'Austin Paws',
    shelterEmail: 'adopt@austinpaws.org',
  },
  {
    id: '6',
    name: 'Daisy',
    breed: 'Dachshund',
    age: 3,
    gender: 'female',
    size: 'small',
    location: 'Denver, CO',
    image: dogImages[5],
    images: [dogImages[5], dogImages[8], dogImages[1]],
    description: 'Daisy is a cute little Dachshund with a big personality. She loves to cuddle and would be perfect for someone looking for a small companion.',
    vaccinated: true,
    neutered: false,
    shelterName: 'Denver Dog Rescue',
    shelterEmail: 'info@denverdog.org',
  },
  {
    id: '7',
    name: 'Rocky',
    breed: 'Boxer',
    age: 4,
    gender: 'male',
    size: 'large',
    location: 'Chicago, IL',
    image: dogImages[6],
    images: [dogImages[6], dogImages[9], dogImages[2]],
    description: 'Rocky is a muscular and playful Boxer. He\'s extremely loyal and protective of his family. Needs an experienced dog owner.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Chicago Dog Alliance',
    shelterEmail: 'support@chicagodog.org',
  },
  {
    id: '8',
    name: 'Sadie',
    breed: 'Beagle',
    age: 3,
    gender: 'female',
    size: 'small',
    location: 'Boston, MA',
    image: dogImages[7],
    images: [dogImages[7], dogImages[0], dogImages[3]],
    description: 'Sadie is a curious and loving Beagle. She has tons of energy and loves going on adventures. Great with families!',
    vaccinated: true,
    neutered: true,
    shelterName: 'Boston Animal Care',
    shelterEmail: 'hello@bostonanimal.org',
  },
  {
    id: '9',
    name: 'Duke',
    breed: 'German Shepherd Mix',
    age: 6,
    gender: 'male',
    size: 'large',
    location: 'New York, NY',
    image: dogImages[8],
    images: [dogImages[8], dogImages[1], dogImages[4]],
    description: 'Duke is a gentle giant and senior dog looking for a comfortable home. He\'s calm, well-behaved, and would love a quiet household.',
    vaccinated: true,
    neutered: true,
    shelterName: 'NYC Rescue Network',
    shelterEmail: 'contact@nycrescue.org',
  },
  {
    id: '10',
    name: 'Bailey',
    breed: 'Poodle Mix',
    age: 2,
    gender: 'female',
    size: 'medium',
    location: 'Miami, FL',
    image: dogImages[9],
    images: [dogImages[9], dogImages[2], dogImages[5]],
    description: 'Bailey is a smart and friendly Poodle mix. She\'s hypoallergenic and loves to learn new tricks. Perfect for active families!',
    vaccinated: true,
    neutered: true,
    shelterName: 'Miami Dog Friends',
    shelterEmail: 'adopt@miamidogfriends.org',
  },
  {
    id: '11',
    name: 'Scout',
    breed: 'Golden Retriever Mix',
    age: 1,
    gender: 'female',
    size: 'medium',
    location: 'Nashville, TN',
    image: dogImages[0],
    images: [dogImages[0], dogImages[3], dogImages[6]],
    description: 'Scout is a young, energetic Golden Retriever mix. She\'s in training and would benefit from an active family with experience.',
    vaccinated: true,
    neutered: false,
    shelterName: 'Nashville Rescue',
    shelterEmail: 'help@nashvillerescue.org',
  },
  {
    id: '12',
    name: 'Molly',
    breed: 'Labrador Retriever',
    age: 4,
    gender: 'female',
    size: 'large',
    location: 'Phoenix, AZ',
    image: dogImages[1],
    images: [dogImages[1], dogImages[4], dogImages[7]],
    description: 'Molly is a sweet Lab looking for her forever home. She\'s great with kids, loves swimming, and is very food motivated.',
    vaccinated: true,
    neutered: true,
    shelterName: 'Phoenix Animal Control',
    shelterEmail: 'info@phoenixanimal.org',
  },
]

export function getDogById(id: string): Dog | undefined {
  return mockDogs.find(dog => dog.id === id)
}

export function filterDogs(filters: {
  breed?: string
  minAge?: number
  maxAge?: number
  size?: string
  location?: string
}): Dog[] {
  return mockDogs.filter(dog => {
    if (filters.breed && dog.breed.toLowerCase() !== filters.breed.toLowerCase()) {
      return false
    }
    if (filters.minAge !== undefined && dog.age < filters.minAge) {
      return false
    }
    if (filters.maxAge !== undefined && dog.age > filters.maxAge) {
      return false
    }
    if (filters.size && dog.size !== filters.size) {
      return false
    }
    if (filters.location && !dog.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }
    return true
  })
}
