'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Copy, Heart } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const DONATION_NUMBER = '09468328005'
const ACCOUNT_NAME = 'Johnedel M.'
const SUGGESTED_AMOUNTS = [20, 50, 100] as const

export function SupportPageClient() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_NUMBER)
      toast({ title: 'Number copied!' })
    } catch {
      toast({
        title: 'Could not copy',
        description: 'Please copy the number manually.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-slate-50 py-16 md:py-24">
      <div className="site-container max-w-4xl">
        <header className="mb-12 text-center md:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-600 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
            Donate
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Support AmponPH 🐾
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Help us continue connecting rescued dogs with loving homes. Your contribution goes directly to food, care, and rehoming efforts.
          </p>
        </header>

        <Card className="gap-0 overflow-hidden rounded-3xl border-slate-200 bg-white p-0 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6 pt-6 px-8">
            <CardTitle className="text-xl font-bold text-slate-900">GCash / Maya</CardTitle>
            <p className="text-sm text-slate-500">
              Send to this number using GCash or Maya. Thank you for supporting our mission.
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
              <div className="min-w-0 flex-1 space-y-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between rounded-2xl bg-slate-50 p-6 border border-slate-100">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Mobile number
                    </p>
                    <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-900">
                      {DONATION_NUMBER}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Account name: <span className="font-semibold text-slate-900">{ACCOUNT_NAME}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900"
                    onClick={copyNumber}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Number
                  </Button>
                </div>

                <div>
                  <p className="mb-4 text-sm font-semibold text-slate-900">Suggested amounts</p>
                  <div className="flex flex-wrap gap-3">
                    {SUGGESTED_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setSelectedAmount(amount)}
                        className={cn(
                          'rounded-full border px-6 py-2.5 text-sm font-semibold transition-all',
                          selectedAmount === amount
                            ? 'border-orange-500 bg-orange-500 text-white shadow-md'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
                        )}
                      >
                        ₱{amount}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    For reference only — choose the same amount in your GCash or Maya app.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100/50">
                  <p className="text-sm leading-relaxed text-slate-600">
                    Open GCash, tap <span className="font-semibold text-slate-900">Scan QR</span>, and point your
                    camera at the code on the right. Maya users can send to the mobile number above.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center lg:sticky lg:top-24 lg:w-[min(100%,280px)] lg:items-stretch">
                <p className="mb-4 w-full text-center text-sm font-semibold text-slate-900 lg:text-left">
                  Scan with GCash
                </p>
                {/* GCash blue matches the asset edges so rounding never shows white letterboxing */}
                <div className="relative w-full max-w-[280px] overflow-hidden rounded-3xl bg-[#0073e6] leading-none shadow-lg ring-1 ring-slate-900/5 lg:max-w-none">
                  <Image
                    src="/support/gcash-qr.png"
                    alt="GCash QR code — scan to send a donation to AmponPH"
                    width={528}
                    height={1024}
                    className="block h-auto w-full align-top"
                    sizes="(max-width: 1024px) 280px, 280px"
                    priority
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 flex items-start gap-5 rounded-3xl border border-orange-100 bg-orange-50 p-6 md:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Heart className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-orange-900 mb-1">Thank you for your kindness</h3>
            <p className="text-base leading-relaxed text-orange-800/80">
              Every small amount helps feed, rescue, and rehome dogs in need. Thank you for being part
              of AmponPH.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
