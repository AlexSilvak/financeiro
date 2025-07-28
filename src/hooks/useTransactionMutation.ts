import useSWRMutation from 'swr/mutation'

type Transaction = {
  id?: string
  description: string
  payment_method: string
  amount: number
  type: 'expense' | 'income'
  category: string
  due_date: string
  payment_date?: string
  status?: 'pending' | 'paid' | 'received'
  notes?: string
  recurring?: boolean
  created_at?: string
  user_id: string
}

// Helper para requisições POST, PUT e DELETE
async function triggerAPI(url: string, { arg }: { arg: any }) {
  const { method, body } = arg
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Erro na requisição')
  }
  return res.json()
}

// Create transaction
export function useCreateTransaction() {
  return useSWRMutation('/api/transactions', triggerAPI)
}

// Update transaction by ID
export function useUpdateTransaction(id: string | undefined) {
  return useSWRMutation(id ? `/api/transactions/${id}` : null, triggerAPI)
}

// Delete transaction by ID
export function useDeleteTransaction() {
  return useSWRMutation('/api/transactions', async ({ arg }: { arg: { id: string } }) => {
    const res = await fetch(`/api/transactions/${arg.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Erro ao deletar')
    }
    return res.json()
  })
}
