'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Bank = {
  id: string
  name: string
}

interface BankSelectProps {
  value: string | undefined
  onChange: (value: string) => void
}

export function BankSelect({ value, onChange }: BankSelectProps) {
  const [banks, setBanks] = useState<Bank[]>([])

  useEffect(() => {
    const fetchBanks = async () => {
      const res = await fetch('/api/banks')
      const data = await res.json()
      setBanks(data)
    }
    fetchBanks()
  }, [])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um banco" />
      </SelectTrigger>
      <SelectContent>
        {banks.map((bank) => (
          <SelectItem key={bank.id} value={bank.id}>
            {bank.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
