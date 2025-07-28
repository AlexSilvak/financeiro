// src/app/transactions/page.tsx
'use client' // Necessário para usar useSWR aqui!

import { useTransactions } from '@/hooks/useTransactions'
import { DataTable } from './data-table'
import { columns } from './columns'

export default function Page() {
  const { transactions, isLoading, isError } = useTransactions()

  if (isLoading) return <div>Carregando...</div>
  if (isError) return <div>Erro ao carregar dados</div>

  return (
    <div className="p-4">
      <DataTable columns={columns} data={transactions} />
    </div>
  )
}
