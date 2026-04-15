import provincesData from 'philippine-administrative-divisions/dist/provinces.json'

type ProvinceRecord = {
  municipalities: Record<
    string,
    {
      barangays: string[]
    }
  >
}

type ProvinceOption = {
  key: string
  label: string
}

const METRO_MANILA_KEY = '__METRO_MANILA__'
const NCR_PREFIX = 'NATIONAL CAPITAL REGION'
const provinceRecords = provincesData as Record<string, ProvinceRecord>

function formatLocationLabel(value: string) {
  return value
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((segment) => {
      if (!segment.trim() || segment === '-') {
        return segment
      }

      if (segment === ' ') {
        return segment
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })
    .join('')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bDe\b/g, 'de')
    .replace(/\bDel\b/g, 'del')
}

const ncrProvinceKeys = Object.keys(provinceRecords).filter((provinceKey) =>
  provinceKey.startsWith(NCR_PREFIX)
)

export const philippineProvinceOptions: ProvinceOption[] = [
  { key: METRO_MANILA_KEY, label: 'Metro Manila' },
  ...Object.keys(provinceRecords)
    .filter((provinceKey) => !provinceKey.startsWith(NCR_PREFIX))
    .sort((left, right) => formatLocationLabel(left).localeCompare(formatLocationLabel(right)))
    .map((provinceKey) => ({
      key: provinceKey,
      label: formatLocationLabel(provinceKey),
    })),
]

export function getProvinceLabel(provinceKey: string) {
  if (provinceKey === METRO_MANILA_KEY) {
    return 'Metro Manila'
  }

  return formatLocationLabel(provinceKey)
}

export function getCityOptionsByProvince(provinceKey: string) {
  if (!provinceKey) {
    return []
  }

  const cityNames =
    provinceKey === METRO_MANILA_KEY
      ? ncrProvinceKeys.flatMap((ncrProvinceKey) =>
          Object.keys(provinceRecords[ncrProvinceKey]?.municipalities ?? {})
        )
      : Object.keys(provinceRecords[provinceKey]?.municipalities ?? {})

  return Array.from(new Set(cityNames))
    .sort((left, right) => formatLocationLabel(left).localeCompare(formatLocationLabel(right)))
    .map((cityName) => ({
      value: formatLocationLabel(cityName),
      label: formatLocationLabel(cityName),
    }))
}
