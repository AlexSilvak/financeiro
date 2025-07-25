import useSWR from 'swr'

export function useContasPagar(params?: { from?: string; to?: string }) {
  const query = new URLSearchParams(params || {}).toString()
  const { data, error, isLoading } = useSWR(`/api/contas-pagar?${query}`)

  return {
    contas: data?.data || [],
    isLoading,
    isError: error,
  }
}
