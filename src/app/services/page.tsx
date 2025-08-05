import { columns } from './columns'
import { DataTable } from './data-table'
import { Service } from './types'

const data: Service[] = [
  {
    id: '1',
    name: 'Auth Service',
    status: 'running',
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-08-05T12:00:00Z',
    log_service: 'Started successfully',
  },
  {
    id: '2',
    name: 'Billing Service',
    status: 'stopped',
    created_at: '2025-07-20T08:30:00Z',
    updated_at: '2025-08-03T09:45:00Z',
    log_service: 'Stopped by admin',
  },
  {
    id: '3',
    name: 'Report Generator',
    status: 'restarting',
    created_at: '2025-06-15T14:45:00Z',
    updated_at: '2025-08-04T15:00:00Z',
    log_service: 'Restarting due to config update',
  },
]

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Service Monitor</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
