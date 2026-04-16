'use client'

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Camera, CheckCircle2, Dog, MapPin, ShieldCheck, Upload, X } from 'lucide-react'
import { breedOptions } from '@/lib/breed-options'
import {
  formatBytes,
  MAX_PET_IMAGE_BYTES,
  MAX_PET_IMAGE_COUNT,
  uploadPetImageToCloudinary,
} from '@/lib/cloudinary/client'
import { createClient } from '@/lib/supabase/client'

type ListingDraft = {
  name: string
  breed: string
  age: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  location: string
  description: string
  vaccinated: boolean
  neutered: boolean
}

type SelectedImage = {
  id: string
  file: File
  previewUrl: string
}

type CreatePetListingSectionProps = {
  initialLocation?: string
}

function createDefaultDraft(initialLocation = ''): ListingDraft {
  return {
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    size: 'medium',
    location: initialLocation,
    description: '',
    vaccinated: true,
    neutered: false,
  }
}

function revokePreviewUrls(images: SelectedImage[]) {
  images.forEach((image) => URL.revokeObjectURL(image.previewUrl))
}

function buildSelectedImages(files: File[]) {
  return files.map((file) => ({
    id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
    file,
    previewUrl: URL.createObjectURL(file),
  }))
}

export function CreatePetListingSection({
  initialLocation = '',
}: CreatePetListingSectionProps) {
  const supabase = useMemo(() => createClient(), [])
  const [draft, setDraft] = useState<ListingDraft>(() => createDefaultDraft(initialLocation))
  const [customBreed, setCustomBreed] = useState('')
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hasPreview, setHasPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStateMessage, setSubmitStateMessage] = useState<string | null>(null)
  const selectedImagesRef = useRef<SelectedImage[]>([])
  const isOtherBreed = draft.breed === 'Other'
  const resolvedBreed = isOtherBreed ? customBreed.trim() : draft.breed.trim()
  const primaryPreviewUrl = selectedImages[0]?.previewUrl ?? null

  useEffect(() => {
    selectedImagesRef.current = selectedImages
  }, [selectedImages])

  useEffect(() => {
    return () => {
      revokePreviewUrls(selectedImagesRef.current)
    }
  }, [])

  const previewAge = useMemo(() => {
    if (!draft.age) {
      return 'Set an age'
    }

    const parsedAge = Number(draft.age)

    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      return 'Enter a valid age'
    }

    return `${parsedAge} ${parsedAge === 1 ? 'year' : 'years'} old`
  }, [draft.age])

  const clearSelectedImages = () => {
    revokePreviewUrls(selectedImagesRef.current)
    selectedImagesRef.current = []
    setSelectedImages([])
  }

  const resetForm = () => {
    setDraft(createDefaultDraft(initialLocation))
    setCustomBreed('')
    setErrorMessage(null)
    setSuccessMessage(null)
    setHasPreview(false)
    setSubmitStateMessage(null)
    clearSelectedImages()
  }

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/')
    )

    event.target.value = ''

    if (files.length === 0) {
      return
    }

    if (selectedImages.length + files.length > MAX_PET_IMAGE_COUNT) {
      setErrorMessage(`You can upload up to ${MAX_PET_IMAGE_COUNT} pet images only.`)
      return
    }

    setErrorMessage(null)
    setSelectedImages((current) => [...current, ...buildSelectedImages(files)])
  }

  const removeImage = (imageId: string) => {
    setSelectedImages((current) => {
      const imageToRemove = current.find((image) => image.id === imageId)

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      return current.filter((image) => image.id !== imageId)
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setHasPreview(false)

    if (!draft.name.trim() || !resolvedBreed || !draft.location.trim()) {
      setErrorMessage('Please complete the pet name, breed, and location.')
      return
    }

    if (selectedImages.length === 0) {
      setErrorMessage('Please upload at least one pet image before publishing.')
      return
    }

    const parsedAge = Number(draft.age)

    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      setErrorMessage('Please enter a valid age in years.')
      return
    }

    setIsSubmitting(true)
    setSubmitStateMessage('Checking your partner account...')

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error(userError?.message ?? 'You must be signed in as a partner to save listings.')
      }

      const uploadedImageUrls: string[] = []
      const petName = draft.name.trim()

      for (const [index, image] of selectedImages.entries()) {
        setSubmitStateMessage(`Uploading image ${index + 1} of ${selectedImages.length}...`)
        const uploadedImage = await uploadPetImageToCloudinary(image.file)
        uploadedImageUrls.push(uploadedImage.url)
      }

      setSubmitStateMessage('Saving listing to Supabase...')

      const { error } = await supabase.from('pets').insert({
        partner_user_id: user.id,
        name: petName,
        breed: resolvedBreed,
        age_years: parsedAge,
        gender: draft.gender,
        size: draft.size,
        location: draft.location.trim(),
        description: draft.description.trim() || '',
        image_url: uploadedImageUrls[0] ?? null,
        image_urls: uploadedImageUrls,
        vaccinated: draft.vaccinated,
        neutered: draft.neutered,
        status: 'published',
        published_at: new Date().toISOString(),
      })

      if (error) {
        throw new Error(error.message)
      }

      setHasPreview(true)
      setSuccessMessage(
        `${petName} is now live with ${uploadedImageUrls.length} optimized photo${uploadedImageUrls.length === 1 ? '' : 's'}.`
      )
      setDraft(createDefaultDraft(initialLocation))
      setCustomBreed('')
      clearSelectedImages()
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while uploading the pet images.'
      )
    } finally {
      setIsSubmitting(false)
      setSubmitStateMessage(null)
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Dog className="h-5 w-5 text-primary" />
            Create Pet Listing
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Add the pet details, choose up to three photos, and we&apos;ll compress each image to
            about 200 KB before uploading it to Cloudinary and saving the URLs to Supabase.
          </p>
        </div>
        <span className="rounded-full bg-[#eef7ff] px-3 py-1.5 text-xs font-semibold text-[#145da0]">
          Partner tool
        </span>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Pet Name</label>
              <input
                type="text"
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Luna"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Breed</label>
              <select
                value={draft.breed}
                onChange={(event) => setDraft((current) => ({ ...current, breed: event.target.value }))}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              >
                <option value="">Select a breed</option>
                {breedOptions.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
              {isOtherBreed && (
                <input
                  type="text"
                  value={customBreed}
                  onChange={(event) => setCustomBreed(event.target.value)}
                  placeholder="Enter the breed"
                  className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Age</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={draft.age}
                onChange={(event) => setDraft((current) => ({ ...current, age: event.target.value }))}
                placeholder="2"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                value={draft.location}
                onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
                placeholder="Quezon City, Metro Manila"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              />
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Prefilled from your partner profile. You can adjust it for this listing if needed.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Gender</label>
              <select
                value={draft.gender}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    gender: event.target.value as ListingDraft['gender'],
                  }))
                }
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm capitalize text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Size</label>
              <select
                value={draft.size}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    size: event.target.value as ListingDraft['size'],
                  }))
                }
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm capitalize text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Share the pet's personality, energy level, ideal home, and any rescue background that helps adopters connect."
              rows={6}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-foreground">Pet Photos</label>
              <span className="text-xs font-semibold text-[#145da0]">
                {selectedImages.length}/{MAX_PET_IMAGE_COUNT} selected
              </span>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[#d6e8fb] bg-[#f8fbff] px-6 py-8 text-center transition-colors hover:border-primary/40 hover:bg-[#f3f9ff]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">
                Upload up to {MAX_PET_IMAGE_COUNT} images
              </p>
              <p className="mt-2 max-w-md text-xs leading-6 text-muted-foreground">
                Each image is compressed client-side to about {formatBytes(MAX_PET_IMAGE_BYTES)}
                before it is uploaded to Cloudinary.
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
                className="hidden"
                disabled={isSubmitting || selectedImages.length >= MAX_PET_IMAGE_COUNT}
              />
            </label>

            {selectedImages.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {selectedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      <img
                        src={image.previewUrl}
                        alt={`Selected pet photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
                        aria-label={`Remove image ${index + 1}`}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-foreground">{image.file.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Original size: {formatBytes(image.file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
              <input
                type="checkbox"
                checked={draft.vaccinated}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, vaccinated: event.target.checked }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-foreground">Vaccinated</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
              <input
                type="checkbox"
                checked={draft.neutered}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, neutered: event.target.checked }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-foreground">Neutered / Spayed</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? submitStateMessage || 'Saving Listing...' : 'Save Listing'}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={resetForm}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 font-semibold text-foreground transition-colors hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Clear Form
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#edf3fb] bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_100%)] p-6 shadow-[0_20px_60px_-36px_rgba(20,44,90,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#145da0]">
              Listing preview
            </p>

            <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-white">
              <div className="relative aspect-[4/3] bg-[linear-gradient(180deg,#fff3e8_0%,#eef7ff_100%)]">
                {primaryPreviewUrl ? (
                  <img
                    src={primaryPreviewUrl}
                    alt="Pet listing preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                      <Camera className="h-8 w-8 text-primary" />
                      <p className="text-sm font-medium">Your first uploaded image becomes the cover.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {draft.name.trim() || 'Pet name'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{resolvedBreed || 'Breed'}</p>
                  </div>
                  {draft.vaccinated && (
                    <span className="rounded-full bg-[#eef7ff] px-3 py-1.5 text-xs font-semibold text-[#145da0]">
                      Vaccinated
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#fef1e8] px-3 py-1.5 text-xs font-semibold text-primary">
                    {previewAge}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold capitalize text-foreground">
                    {draft.gender}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold capitalize text-foreground">
                    {draft.size}
                  </span>
                  {draft.neutered && (
                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                      Neutered / Spayed
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-[#145da0]" />
                  <span>{draft.location.trim() || 'Set a city or area'}</span>
                </div>

                {selectedImages.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {selectedImages.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.previewUrl}
                        alt={`Preview gallery ${index + 1}`}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-border"
                      />
                    ))}
                  </div>
                )}

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {draft.description.trim() ||
                    'A strong listing description explains the pet’s personality, routine, and the kind of home that would be a good fit.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background/40 p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Suggested fields
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Name, breed, and age for fast scanning</li>
              <li>Gender, size, and location for browse filters</li>
              <li>Vaccination and neuter status for trust and screening</li>
              <li>Description with temperament, rescue history, and ideal home</li>
              <li>Up to three compressed photos for a faster Cloudinary-backed gallery</li>
            </ul>
          </div>

          {hasPreview && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                Listing published successfully
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-700">
                Your pet listing now has optimized Cloudinary image URLs stored in the `pets`
                table and is published automatically.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
