
// app/lancamentos/page.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Settings,TrendingDown,TrendingUp  } from "lucide-react";


import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent 
} from "@/components/ui/card"

interface ITransaction {
  _id: string;
  description: string;
  payment_method: string;
  amount: number;
  trntype: "DEBIT" | "CREDIT";
  category: string;
  date: string; // string para compatibilidade com fetch
}

const meses = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
];

async function getTransactions(): Promise<ITransaction[]> {
  const res = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-store",
  });
  const json = await res.json();
  const receitas = json

  // filtros
    const c = json.flatMap((c: any) =>
  c.transactions
    .filter((t: any) => t.trntype === "CREDIT")
    .map((t: any) => ({

      value: t.amount,

    }))
);
// filtros   
const d = json.flatMap((c: any) =>
  c.transactions
    .filter((t: any) => t.trntype === "DEBIT")
    .map((t: any) => ({

      value: t.amount,

    }))
);
  // Função de formatação
function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Exemplo com seu código
const totalD = d.reduce((acc, n) => acc +  Math.abs(n.value), 0);
const totalC = c.reduce((acc, n) => acc + n.value, 0);
const s = totalC - totalD;

 console.log("Débitos:", formatCurrency(totalD));
console.log("Créditos:", formatCurrency(totalC));
console.log("Saldo:", formatCurrency(s));

function calcularPorMes(transactions: any[], ano: number, mes: number) {
  // mes é 1-12 (ex: Janeiro = 1, Fevereiro = 2, etc.)
  const filtradas = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getUTCFullYear() === ano && d.getUTCMonth() + 1 === mes;
  });

  const totalC = filtradas
    .filter((t) => t.trntype === "CREDIT")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalD = filtradas
    .filter((t) => t.trntype === "DEBIT")
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const saldo = totalC - totalD;
  console.log("Débitos:", formatCurrency(totalD));
console.log("Créditos:", formatCurrency(totalC));
console.log("Saldo:", formatCurrency(saldo));
  return {saldo,totalC,totalD};
}


// 👉 Exemplo: Agosto/2024
const resultado = calcularPorMes(receitas, 2025, 7);
//console.log(resultado);
  return json.transactions || [];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

function agruparPorMesCategoria(transactions: ITransaction[]) {
  const resultado: Record<string, Record<string, number>> = {};

  for (const l of transactions) {
    const data = new Date(l.date);
    const mes = meses[data.getMonth()];
    const chave = `${l.trntype.toUpperCase()} - ${l.category}`;

    resultado[chave] = resultado[chave] || {};
    resultado[chave][mes] = (resultado[chave][mes] || 0) + l.amount;
  }

  return resultado;
}

export default async function TransactionsLancamentosDRE() {
  const transactions = await getTransactions();
  console.log(transactions)
  const receitas = transactions
    .filter((l) => l.trntype === "DEBIT")
    .reduce((total, l) => total + l.amount, 0);

  const despesas = transactions
    .filter((l) => l.trntype === "CREDIT")
    .reduce((total, l) => total + l.amount, 0);

  const saldo = receitas - despesas;

  const agrupado = agruparPorMesCategoria(transactions);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex grid-cols-2 gap-2">
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Parâmetros
        </Button>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    
     
 
  
    </div>

      <h1 className="text-2xl font-bold mb-4">Demonstrativo de Resultados</h1>

      {/* Totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
     
         <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Receitas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
            ${formatCurrency(receitas)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
         <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Despesas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-60 text-red-600">
            {formatCurrency(despesas)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
        <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo</CardDescription>
          <CardTitle className={cn("text-2xl font-semibold tabular-nums @[250px]/card:text-3xl", saldo >= 0 ? "text-green-700" : "text-red-700")}>
          {formatCurrency(saldo)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      </div>

      {/* Tabela Estilo DRE */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-black">
            <tr>
              <th className="text-left px-4 py-2 font-bold">CATEGORIAS</th>
              {meses.map((mes) => (
                <th key={mes} className="px-2 py-2 font-bold text-center">{mes}</th>
              ))}
              <th className="px-2 py-2 font-bold text-center">ACUMULADO</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(agrupado).map(([categoria, valoresMes]) => {
              const acumulado = Object.values(valoresMes).reduce((s, v) => s + v, 0);
              const isReceita = categoria.startsWith("INCOME");

              return (
                <tr key={categoria} className="border-t">
                  <td className="px-4 py-2 font-medium">{categoria}</td>
                  {meses.map((mes) => (
                    <td key={mes} className="text-center px-2 py-2">
                      {valoresMes[mes]
                        ? <span className={isReceita ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(valoresMes[mes])}
                          </span>
                        : "-"}
                    </td>
                  ))}
                  <td className={cn(
                    "text-center px-2 py-2 font-semibold",
                    isReceita ? "text-green-700" : "text-red-700"
                  )}>
                    {formatCurrency(acumulado)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
