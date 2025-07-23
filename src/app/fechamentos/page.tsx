import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  try {
    const res = await fetch("/api/fluxo-caixa", {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Erro na resposta da API fluxo-caixa:", res.status, await res.text())
      return []
    }

    const data = await res.json()

    return data.map((item: any) => ({
      id: item._id,
      amount: item.valor,
      status: item.status,
      description: item.descricao,
      forma_de_pagamento: item.forma_pagamento,
      type: item.tipo,
      category: item.categoria || "Sem categoria",
    }))
  } catch (error) {
    console.error("Erro ao buscar dados do fluxo de caixa:", error)
    return []
  }
}


export default async function Page() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Lançamentos Financeiros</h2>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
