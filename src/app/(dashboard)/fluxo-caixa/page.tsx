// app/(dashboard)/fluxo-caixa/page.tsx
'use client'
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}



import { useSession } from 'next-auth/react' // ou outra forma de pegar o usuário logado
import FluxogramaCaixa from '@/components/FluxogramaCaixa'

export default function FluxoDeCaixaPage() {
  const { data: session } = useSession()
  const usuarioId = (session?.user as SessionUser)?.id; 

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Diagrama de Fluxo de Caixa</h1>
      <FluxogramaCaixa usuarioId={usuarioId} />
    </div>
  )
}
