'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, XCircle } from 'lucide-react'

interface UploadStatus {
  type: 'success' | 'error'
  message: string
  count?: number
}

export default function ExtratoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!file) {
      alert('Selecione um arquivo OFX')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setStatus(null)

   try {
  const response = await fetch('/api/statements', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (response.ok) {
    setStatus({
      type: 'success',
      message: result.message,
      count: result.count,
    })
  } else {
    setStatus({
      type: 'error',
      message:
        typeof result.error === 'string'
          ? result.error
          : JSON.stringify(result.error),
    })
  }
} catch (error: any) {
  setStatus({
    type: 'error',
    message: error?.message || 'Erro inesperado ao conectar ao servidor',
  })

} finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Importar Extrato OFX</h1>

      <Input
        type="file"
        accept=".ofx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={handleSubmit} disabled={loading || !file}>
        {loading ? 'Processando...' : 'Processar Arquivo'}
      </Button>

      {status && (
        <Alert variant={status.type === 'success' ? 'default' : 'destructive'}>
          {status.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertTitle>{status.type === 'success' ? 'Sucesso!' : 'Erro'}</AlertTitle>
         <AlertDescription>
  {typeof status.message === 'string'
    ? status.message
    : JSON.stringify(status.message)}
  {status.count !== undefined && ` (${status.count} transações)`}
</AlertDescription>

        </Alert>
      )}
    </div>
  )
}
