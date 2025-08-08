'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Supplier {
  _id: string
  name: string
  person_type: 'individual' | 'company'
  tax_id: string
  contact_person?: string
  email?: string
  phone?: string
  status: 'active' | 'inactive'
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    fetch('/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data.data))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Link href="/suppliers/new">
          <Button>Add Supplier</Button>
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Tax ID</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier._id} className="border-t">
                <td className="px-4 py-2">{supplier.name}</td>
                <td className="px-4 py-2 capitalize">{supplier.person_type}</td>
                <td className="px-4 py-2">{supplier.tax_id}</td>
                <td className="px-4 py-2">{supplier.contact_person || '-'}</td>
                <td className="px-4 py-2">
                  <Badge variant={supplier.status === 'active' ? 'default' : 'destructive'}>
                    {supplier.status}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Link href={`/suppliers/${supplier._id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button variant="destructive" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
