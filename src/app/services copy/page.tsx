// src/app/services/page.tsx

import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Service } from './types'
import { CreateServiceButton } from './service-actions'
async function getServices(): Promise<Service[]> {
  const res = await fetch('http://localhost:3000/api/services', {
    next: { revalidate: 5 }, // SSR com cache de 5s (ou use SWR para client-side)
  })

  return res.json()
}

export default async function ServicesPage() {
  const data = await getServices()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Serviços de Importação</h1>
      <DataTable columns={columns} data={data} />
      <CreateServiceButton />
    </div>
  )
}
