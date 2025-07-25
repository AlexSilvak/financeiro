import useSWR from 'swr'

export function useContasReceber(params?: { from?: string; to?: string }) {
  const query = new URLSearchParams(params || {}).toString()
  const { data, error, isLoading } = useSWR(`/api/contas-receber?${query}`)

  return {
    contas: data?.data || [],
    isLoading,
    isError: error,
  }
}
