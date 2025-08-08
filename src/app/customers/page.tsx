// src/app/customers/page.tsx
import { DataTable } from './data-table'

async function fetchCustomers() {
  const res = await fetch('http://localhost:3000/api/customers', {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Failed to fetch customers')
  return res.json()
}

export default async function CustomersPage() {
  const customers = await fetchCustomers()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <DataTable data={customers} />
    </main>
  )
}
