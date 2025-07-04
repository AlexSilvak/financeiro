// src/app/planos/page.tsx
'use client'

import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface Plano {
    id: string
    nome: string
    tipoPlano: 'venda' | 'compra'
    plano: string // pode ser uma descrição ou identificador interno do plano
  }
  
  export type ListaDePlanos = Plano[]

export default function PlanosPage() {
  const { data: planos, isLoading } = useSWR('/api/planos', (url) =>
    fetch(url).then((res) => res.json())
  )

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Planos de Pagamento</h1>

      <Link href="/planos/novo">
        <Button className="mb-4">Novo Plano</Button>
      </Link>

      {isLoading && <p>Carregando...</p>}
       
      <div className="grid gap-4">
        {planos?.map((plano:string) => (
          <div key={plano._id} className="border p-4 rounded-xl shadow-sm">
            <p><strong>Nome:</strong> {plano.nome}</p>
            <p><strong>Tipo:</strong> {plano.tipo_plano}</p>
            <p><strong>Forma de Pagamento:</strong> {plano.forma_pagamento_id?.nome}</p>
            <p><strong>Parcelas:</strong> {plano.parcelas.length}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
