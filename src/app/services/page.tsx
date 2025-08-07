'use client'

import { columns } from './columns'
import { DataTable } from './data-table'
import useSWR from 'swr'
import CreateJobDialog from './create-job-dialog'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ServicesPage() {
  const { data: services = [], mutate } = useSWR('/api/services/list', fetcher)

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
