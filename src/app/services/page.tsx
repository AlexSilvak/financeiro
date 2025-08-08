'use client'
import { useEffect } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'
import useSWR from 'swr'
import CreateJobDialog from './create-job-dialog'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ServicesPage() {
  const { data: services = [], mutate } = useSWR('/api/services/list', fetcher)

useEffect(() => {
  const ws = new WebSocket('ws://localhost:3000')
 ws.onmessage = (event) => {
    try {
      const updatedServices = JSON.parse(event.data)
      mutate(updatedServices, { revalidate: false }) // atualiza cache e re-renderiza
    } catch (err) {
      console.error('Erro ao processar dados do WS', err)
    }
  }

  return () => ws.close()
}, [mutate])


  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Serviços</h2>
        <CreateJobDialog onSuccess={mutate} />
      </div>

      <DataTable columns={columns} data={services} />
    </div>
  )
}
