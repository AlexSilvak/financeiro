// app/(dashboard)/statements/page.tsx
'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function StatementPage() {
  const { data: banks } = useSWR('/api/banks', fetcher)
  const [selectedBankId, setSelectedBankId] = useState<string | undefined>(undefined)
  
  const { data: statements } = useSWR(
    selectedBankId ? `/api/statements?bank_id=${selectedBankId}` : '/api/statements',
    fetcher
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select onValueChange={setSelectedBankId}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Filtrar por banco" />
          </SelectTrigger>
          <SelectContent>
            {banks?.map((bank: any) => (
              <SelectItem key={bank._id} value={bank.bank_id}>
                {bank.name}
                
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={statements || []} />
    </div>
  )
}
