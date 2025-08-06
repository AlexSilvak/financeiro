export interface Service {
  _id: string
  name: string
  status: 'running' | 'stopped' | 'pending'
  created_at: string
  updated_at: string
  log_service: string
  statement_id: string
  user_id: string
}
