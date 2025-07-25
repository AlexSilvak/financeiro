// app/lancamentos/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Settings } from 'lucide-react';
type Lancamento = {
  _id: string
  descricao: string
  forma_de_pagamento: string
  valor: number
  tipo: "receita" | "despesa"
  categoria: string
  data_vencimento: string
}

const meses = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
]

async function getLancamentos(): Promise<Lancamento[]> {
  const res = await fetch("http://localhost:3000/api/lancamentos", {
    cache: "no-store",
  })
  const json = await res.json()
  return json.lancamentos || []
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0
  })
}

function agruparPorMesCategoria(lancamentos: Lancamento[]) {
  const resultado: Record<string, Record<string, number>> = {}

  for (const l of lancamentos) {
    const data = new Date(l.data_vencimento)
    const mes = meses[data.getMonth()]
    const chave = `${l.tipo.toUpperCase()} - ${l.categoria}`

    resultado[chave] = resultado[chave] || {}
    resultado[chave][mes] = (resultado[chave][mes] || 0) + l.valor
  }

  return resultado
}

export default async function LancamentosDRE() {
  const lancamentos = await getLancamentos()

  const receitas = lancamentos.filter(l => l.tipo === "receita").reduce((a, l) => a + l.valor, 0)
  const despesas = lancamentos.filter(l => l.tipo === "despesa").reduce((a, l) => a + l.valor, 0)
  const saldo = receitas - despesas

  const agrupado = agruparPorMesCategoria(lancamentos)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex grid-cols-2 gap-2"><Button><Settings />Parâmetros</Button></div>
      <h1 className="text-2xl font-bold mb-4">Demonstrativo de Resultados</h1>

      {/* Totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total de Receitas</p>
            <p className="text-green-600 text-lg font-semibold">{formatCurrency(receitas)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total de Despesas</p>
            <p className="text-red-600 text-lg font-semibold">{formatCurrency(despesas)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Saldo</p>
            <p className={cn("text-lg font-semibold", saldo >= 0 ? "text-green-700" : "text-red-700")}>
              {formatCurrency(saldo)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Estilo DRE */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 font-bold">CATEGORIAS</th>
              {meses.map(mes => (
                <th key={mes} className="px-2 py-2 font-bold text-center">{mes}</th>
              ))}
              <th className="px-2 py-2 font-bold text-center">ACUMULADO</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(agrupado).map(([categoria, mesesValores]) => {
              const acumulado = Object.values(mesesValores).reduce((s, v) => s + v, 0)
              const isReceita = categoria.startsWith("RECEITA")

              return (
                <tr key={categoria} className="border-t">
                  <td className="px-4 py-2 font-medium">{categoria}</td>
                  {meses.map(mes => (
                    <td key={mes} className="text-center px-2 py-2">
                      {mesesValores[mes]
                        ? <span className={isReceita ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(mesesValores[mes])}
                          </span>
                        : "-"}
                    </td>
                  ))}
                  <td className={cn("text-center px-2 py-2 font-semibold", isReceita ? "text-green-700" : "text-red-700")}>
                    {formatCurrency(acumulado)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
