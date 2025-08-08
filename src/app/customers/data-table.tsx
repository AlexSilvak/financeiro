// src/app/customers/data-table.tsx
'use client'

import { columns } from './columns'

type Props = {
  data: Array<Record<string, any>>
}

export function DataTable({ data }: Props) {
  return (
    <table className="min-w-full border border-gray-200">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessorKey} className="px-4 py-2 text-left border-b">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.accessorKey} className="px-4 py-2 border-b">
                {row[col.accessorKey]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
