// hooks/useCreateTransaction.ts
import useSWRMutation from 'swr/mutation'

export type CreateTransactionInput = {
  description: string
  payment_method: string
  amount: number
  type: 'income' | 'expense'
  category: string
  due_date: string // ISO format
  payment_date: string // ISO format
  status: 'pago' | 'pendente'
  notes?: string
  recurring?: boolean
  user_id: string
}

export function useCreateTransaction() {
  return useSWRMutation(
    '/api/transactions',
    async (url: string, { arg }: { arg: CreateTransactionInput }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao criar transação')
      }

      return res.json()
    }
  )
}
