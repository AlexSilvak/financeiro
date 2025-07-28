import useSWR from 'swr'
 
function Profile ({ userId }) {
  const { data, error, isLoading } = useSWR(`/api/user/${userId}`, fetcher)
 
  if (error) return <div>falhou ao carregar</div>
  if (isLoading) return <div>carregando...</div>
 
  // renderizar dados
  return <div>olá {data.name}!</div>
}