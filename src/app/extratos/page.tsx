'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function UploadExtrato() {
  const [file, setFile] = useState<File | null>(null)

  async function handleProcessar() {
    if (!file) return alert('Selecione um arquivo .OFX')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/processar-extrato', {
      method: 'POST',
      body: formData,
    })

    const json = await res.json()
    console.log(json)
    alert('Processado com sucesso! Veja o console.')
  }

  return (
    <div className="p-4 space-y-4">
      <input type="file" accept=".ofx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button onClick={handleProcessar}>Processar Extrato</Button>
    </div>
  )
}
