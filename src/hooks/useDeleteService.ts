'use client'

import useSWRMutation from 'swr/mutation'

type Props = {
  id: string
}

async function deleteService(_: string, { arg }: { arg: Props }) {
  const res = await fetch(`/api/services/${arg.id}`, {
    method: 'DELETE',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro ao deletar serviço')
  return data
}

export function useDeleteService() {
  return useSWRMutation('/api/services', deleteService)
}
