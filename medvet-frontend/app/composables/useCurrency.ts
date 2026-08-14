export type CurrencyType = 'USD' | 'VES'

export interface BcvRateInfo {
  rate: number
  lastUpdated: string
  source: string
  loading: boolean
  error: string | null
}

export function useCurrency() {
  const activeCurrency = useState<CurrencyType>('medvet_active_currency', () => 'USD')
  const bcvRate = useState<number>('medvet_bcv_rate', () => 771.0714)
  const bcvLastUpdated = useState<string>('medvet_bcv_updated', () => new Date().toISOString())
  const bcvLoading = useState<boolean>('medvet_bcv_loading', () => false)
  const bcvError = useState<string | null>('medvet_bcv_error', () => null)
  const bcvSource = useState<string>('medvet_bcv_source', () => 'Banco Central de Venezuela (BCV)')

  // Fetch official BCV rate from API
  const fetchBcvRate = async (force: boolean = false) => {
    if (bcvLoading.value) return
    bcvLoading.value = true
    bcvError.value = null

    try {
      // Primary provider: ve.dolarapi.com/v1/dolares/oficial
      const data = await $fetch<{ promedio: number; fechaActualizacion: string }>('https://ve.dolarapi.com/v1/dolares/oficial', {
        timeout: 6000,
        headers: { Accept: 'application/json' }
      })

      if (data && typeof data.promedio === 'number' && data.promedio > 0) {
        bcvRate.value = data.promedio
        bcvLastUpdated.value = data.fechaActualizacion || new Date().toISOString()
        bcvSource.value = 'Banco Central de Venezuela (BCV)'
      }
    } catch (err: any) {
      // Fallback endpoint if primary fails
      try {
        const fallbackData = await $fetch<{ oficial?: number; bcv?: number; rate?: number }>('https://pydolarve.org/api/v1/dollar?page=bcv', {
          timeout: 5000
        })
        const foundRate = fallbackData?.oficial || fallbackData?.bcv || fallbackData?.rate
        if (foundRate && foundRate > 0) {
          bcvRate.value = foundRate
          bcvLastUpdated.value = new Date().toISOString()
        }
      } catch (fallbackErr) {
        // Retain default stable backup rate without breaking UX
        console.warn('Could not fetch latest BCV rate, using standard cached rate:', bcvRate.value)
        bcvError.value = 'No se pudo contactar el servidor del BCV. Usando última tasa registrada.'
      }
    } finally {
      bcvLoading.value = false
    }
  }

  const setCurrency = (currency: CurrencyType) => {
    activeCurrency.value = currency
    if (import.meta.client) {
      try {
        localStorage.setItem('medvet_currency', currency)
      } catch (_) {}
    }
  }

  const toggleCurrency = () => {
    setCurrency(activeCurrency.value === 'USD' ? 'VES' : 'USD')
  }

  const initCurrency = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('medvet_currency') as CurrencyType
        if (saved && (saved === 'USD' || saved === 'VES')) {
          activeCurrency.value = saved
        }
      } catch (_) {}
      fetchBcvRate()
    }
  }

  // Convert USD to VES
  const convertUsdToVes = (usdAmount: number): number => {
    return Number(usdAmount || 0) * bcvRate.value
  }

  // Convert VES to USD
  const convertVesToUsd = (vesAmount: number): number => {
    if (!bcvRate.value) return 0
    return Number(vesAmount || 0) / bcvRate.value
  }

  // Format price according to currency
  const formatPrice = (amountInUsd: number, overrideCurrency?: CurrencyType): string => {
    const targetCurr = overrideCurrency || activeCurrency.value
    const safeUsd = Number(amountInUsd || 0)

    if (targetCurr === 'VES') {
      const ves = safeUsd * bcvRate.value
      return `Bs. ${ves.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return `$${safeUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }

  // Format amount with currency symbol
  const formatDual = (amountInUsd: number, preferredCurr?: CurrencyType) => {
    const mainCurr = preferredCurr || activeCurrency.value
    const safeUsd = Number(amountInUsd || 0)
    const safeVes = safeUsd * bcvRate.value

    const formattedUsd = `$${safeUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD`
    const formattedVes = `Bs. ${safeVes.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    return {
      primary: mainCurr === 'USD' ? formattedUsd : formattedVes,
      secondary: mainCurr === 'USD' ? formattedVes : formattedUsd,
      usd: formattedUsd,
      ves: formattedVes,
      activeCurrency: mainCurr,
      rate: bcvRate.value
    }
  }

  const formatBcvRate = (): string => {
    return `Bs. ${bcvRate.value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return {
    activeCurrency,
    bcvRate,
    bcvLastUpdated,
    bcvLoading,
    bcvError,
    bcvSource,
    fetchBcvRate,
    setCurrency,
    toggleCurrency,
    initCurrency,
    convertUsdToVes,
    convertVesToUsd,
    formatPrice,
    formatDual,
    formatBcvRate
  }
}
