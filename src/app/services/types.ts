// types.ts
export interface Service {
  id: string
  name: string
  status: 'stopped' | 'running' | 'restarting'
  created_at: string
  updated_at: string
  log_service: string
}
