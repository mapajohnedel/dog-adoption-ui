'use client'

import Link from 'next/link'
import { ArrowRight, Heart, HeartHandshake, Home as HomeIcon, ShieldCheck, Sparkles } from 'lucide-react'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { PetCard } from '@/components/home/PetCard'
import { useDogCatalog } from '@/lib/dog-catalog'

const trustPoints = [
  {
    title: 'Verified rescues',
    description: 'Every listing is reviewed so families can adopt with confidence.',
    icon: ShieldCheck,
  },
  {
    title: 'Simple process',
    description: 'Clear steps make it easier to meet, apply, and bring a pet home.',
    icon: Sparkles,
  },
  {
    title: 'Made for matches',
    description: 'We highlight temperament, size, and lifestyle fit to help you choose well.',
    icon: HeartHandshake,
  },
]

const successStoryHighlights = [
  {
    title: 'Second chances matter',
    description:
      'Every rescue story begins with patience, healing, and one kind person willing to open their home.',
    icon: Heart,
  },
  {
    title: 'A loving tahanan changes everything',
    description:
      'When a dog feels safe and loved, they learn to trust again and become part of a real family.',
    icon: HomeIcon,
  },
]

const happyTails = [
  {
    name: 'Luna',
    status: 'Adopted',
    story:
      'From shy rescue to playful best friend, Luna now spends her days surrounded by love and gentle care.',
    location: 'Quezon City',
  },
  {
    name: 'Buddy',
    status: 'Fostered',
    story:
      'Buddy found comfort in a foster home where he could rest, heal, and slowly learn to trust people again.',
    location: 'Cebu City',
  },
  {
    name: 'Mochi',
    status: 'Adopted',
    story:
      'Mochi now wakes up to warm hugs, daily walks, and a family that chose kindness and a second chance.',
    location: 'Davao City',
  },
]

function WaveDivider() {
  return (
    <div className="relative -mt-8 overflow-hidden leading-none text-[#fffaf6]">
      <svg
        viewBox="0 0 1440 180"
        className="block h-20 w-full sm:h-28"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,96L48,90.7C96,85,192,75,288,69.3C384,64,480,64,576,74.7C672,85,768,107,864,122.7C960,139,1056,149,1152,144C1248,139,1344,117,1392,106.7L1440,96L1440,181L1392,181C1344,181,1248,181,1152,181C1056,181,960,181,864,181C768,181,672,181,576,181C480,181,384,181,288,181C192,181,96,181,48,181L0,181Z"
        />
      </svg>
    </div>
  )
}

export default function Home() {
  const dogs = useDogCatalog()
  const featuredDogs = dogs.slice(0, 4)

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_42%,#fffaf6_100%)]">
      <Hero dogs={featuredDogs} />
      <WaveDivider />

      <section
        id="success-stories"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf6_0%,#fff4ec_42%,#eef7ff_100%)] py-20 sm:py-24"
      >
        <div className="absolute left-[8%] top-24 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[10%] top-20 h-28 w-28 rounded-full bg-[#84c5ff]/20 blur-3xl" />

        <div className="site-container relative">
          <div className="rounded-[2.75rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
            <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <div className="space-y-6">
                <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                  Success Stories
                </span>
                <div className="max-w-3xl space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Stories of rescue, healing, and happy new beginnings.
                  </h2>
                  <p className="text-lg leading-8 text-muted-foreground">
                    Every rescued dog has a story of waiting, healing, and hoping for love. Here
                    at AmponPH, we celebrate the beautiful moments when dogs find a safe and caring
                    tahanan through the kindness of people who choose to adopt. These stories
                    remind us that second chances can change a life, not only for the dog, but
                    also for the family who welcomes them home. By adopting, you become part of a
                    mission filled with compassion, hope, and new beginnings.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]"
                  >
                    Be Part of the Mission
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/partner/register"
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8e8fb] bg-[#f7fbff] px-6 py-3.5 font-semibold text-[#145da0] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    For Shelters
                  </Link>
                </div>
              </div>

              <div className="grid gap-5">
                {successStoryHighlights.map(({ title, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-[2rem] border border-white/70 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(20,44,90,0.22)]"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-[#3b82f6]/15 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
                    <p className="leading-7 text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14">
              <div className="mb-8 max-w-2xl space-y-3">
                <p className="inline-flex rounded-full bg-[#eef7ff] px-4 py-1.5 text-sm font-semibold text-[#145da0]">
                  Happy Tails
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Meet the dogs who found loving homes and kind hearts.
                </h3>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                  Here are some of the adopted and fostered dogs whose journeys inspire the
                  AmponPH community.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {happyTails.map((story) => (
                  <div
                    key={story.name}
                    className="rounded-[2rem] border border-[#edf3fb] bg-white p-7 shadow-[0_20px_60px_-36px_rgba(20,44,90,0.28)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-semibold text-foreground">{story.name}</h4>
                        <p className="text-sm text-muted-foreground">{story.location}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          story.status === 'Adopted'
                            ? 'bg-[#ffefe6] text-primary'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {story.status}
                      </span>
                    </div>

                    <p className="leading-7 text-muted-foreground">{story.story}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section id="featured-pets" className="bg-white py-20 sm:py-24">
        <div className="site-container">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-full bg-secondary/15 px-4 py-1.5 text-sm font-semibold text-[#145da0]">
                Featured pets
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Meet friendly faces waiting for their forever family.
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                A few lovable companions to get your search started, with quick details that make
                it easy to take the next step.
              </p>
            </div>

            <Link
              href="/browse"
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8e8fb] bg-[#f7fbff] px-5 py-3 font-semibold text-[#145da0] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore all pets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredDogs.map((dog) => (
              <PetCard key={dog.id} dog={dog} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#f2f8ff] py-20 sm:py-24">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary via-[#ff6b2c] to-[#ef4444] px-6 py-12 text-white shadow-[0_30px_80px_-35px_rgba(249,115,22,0.7)] sm:px-10 lg:px-14 lg:py-14">
            <div className="absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute left-12 top-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold">
                  Ready when you are
                </span>
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  Give a pet a second chance at life.
                </h2>
                <p className="text-lg leading-8 text-white/85">
                  Start browsing adoptable pets and take the first step toward a life-changing
                  connection.
                </p>
              </div>

              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3.5 font-semibold text-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Start Adopting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
