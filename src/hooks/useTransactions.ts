import useSWR from 'swr' // ✅ CERTA


type TransactionParams = {
  user_id?: string
  from?: string
  to?: string
}

type Transaction = {
  id: string
  description: string
  payment_method: string
  amount: number
  type: 'expense' | 'income'
  category: string
  due_date: string
  payment_date?: string
  status: 'pending' | 'paid' | 'received'
  notes?: string
  recurring?: boolean
  created_at: string
  user_id: string
}

type UseTransactionsReturn = {
  transactions: Transaction[]
  isLoading: boolean
  isError: any
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useTransactions(params?: TransactionParams): UseTransactionsReturn {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  const { data, error, isLoading } = useSWR(`/api/transactions?${query}`, fetcher)

  return {
    transactions: data?.transactions || [],
    isLoading,
    isError: error,
  }
}
