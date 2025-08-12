import useSWR from 'swr'

type TransactionParams = {
  user_id?: string
  from?: string
  to?: string
}

type Payment = {
  trntype: string
  amount: number
  payment_method?: string
  date: string // ou Date, se fizer conversão
  memo?: string
  fitid: string
  user_id?: string
  _id?: string
}

type UseTransactionsReturn = {
  transactions: Payment[]
  isLoading: boolean
  isError: any
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useTransactions(params?: TransactionParams): UseTransactionsReturn {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  const { data, error, isLoading } = useSWR(`/api/transactions?${query}`, fetcher)

  const transactions = Array.isArray(data) && data.length > 0
    ? data[0].transactions.map((t: Payment) => ({
        ...t,
        date: new Date(t.date), // se quiser como Date
      }))
    : []

  return {
    transactions,
    isLoading,
    isError: error,
  }
}
