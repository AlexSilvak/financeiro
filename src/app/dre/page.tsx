
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

const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

type MonthlySummary = {
  receitas: number;
  despesas: number;
  saldo: number;
};


async function getTransactionsByMonth(): Promise<Record<number, MonthlySummary>> {
  const res = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-store",
  });
  const json = await res.json();

  const allTransactions: ITransaction[] = json.flatMap(
    (item: any) => item.transactions || []
  );

  const monthlyData = allTransactions.reduce((acc, t) => {
    const date = new Date(t.date); // <- campo da data (ajuste se o nome for diferente)
    const month = date.getMonth(); // 0 = Janeiro, 11 = Dezembro

    if (!acc[month]) {
      acc[month] = { receitas: 0, despesas: 0, saldo: 0 };
    }

    if (t.trntype === "CREDIT") {
      acc[month].receitas += t.amount ?? 0;
    } else if (t.trntype === "DEBIT") {
      acc[month].despesas += Math.abs(t.amount ?? 0);
    }

    // saldo = receitas - despesas
    acc[month].saldo = acc[month].receitas - acc[month].despesas;

    return acc;
  }, {} as Record<number, MonthlySummary>);
Object.entries(monthlyData).map(([mes, valores]) => ({
  mes: meses[+mes],
  receitas: formatCurrency(valores.receitas),
  despesas: formatCurrency(valores.despesas),
  saldo: formatCurrency(valores.saldo),
}));
  return monthlyData;
}



async function getTransactions(): Promise<ITransaction[]> {
  const res = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-store",
  });
  const json = await res.json();

  // Supondo que `json` seja um array de objetos, cada um com um campo transactions[]
  const allTransactions: ITransaction[] = json.flatMap(
    (item: any) => item.transactions || []
  );
allTransactions.forEach(t => {
  console.log("Transação:", t.trntype, t.amount, new Date(t.date).toLocaleDateString());
});
  // Somar apenas as transações de crédito
  const receitas = allTransactions
    .filter((t) => t.trntype === "CREDIT")
    .reduce((acc, t) => acc + (Math.abs(t.amount?? 0) ), 0);
    const despesas = allTransactions
    .filter((t) => t.trntype === "DEBIT")
    .reduce((acc, t) => acc + (Math.abs(t.amount ?? 0)), 0);
  const saldo=despesas-receitas
  console.log("Total de receitas:", formatCurrency(receitas));
  console.log("Total de despesas:", formatCurrency(despesas));
  console.log("Total de despesas:", formatCurrency(saldo));
  return allTransactions;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

function agruparPorCategoriaEMes(transactions: ITransaction[]) {
  const agrupado: Record<string, Record<string, number>> = {};

  for (const t of transactions) {
    const date = new Date(t.date); // ajuste se o campo da data tiver outro nome
    const mes = meses[date.getMonth()];
    const categoria = t.trntype; // "CREDIT" ou "DEBIT"

    if (!agrupado[categoria]) {
      agrupado[categoria] = {};
    }

    if (!agrupado[categoria][mes]) {
      agrupado[categoria][mes] = 0;
    }

    // Se valores de DEBIT já vêm negativos, normalizar com Math.abs()
    agrupado[categoria][mes] += categoria === "DEBIT" ? Math.abs(t.amount ?? 0) : (t.amount ?? 0);
  }

  return agrupado;
}

function agruparPorAnoCategoriaMes(transactions: ITransaction[]) {
  const meses = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
  const agrupado: Record<string, Record<string, Record<string, number>>> = {};

  for (const t of transactions) {
    const date = new Date(t.date);
    const mes = meses[date.getMonth()];
    const ano = date.getFullYear().toString();
    const categoria = t.trntype; // "CREDIT" ou "DEBIT"

    if (!agrupado[ano]) agrupado[ano] = {};
    if (!agrupado[ano][categoria]) agrupado[ano][categoria] = {};
    if (!agrupado[ano][categoria][mes]) agrupado[ano][categoria][mes] = 0;

    agrupado[ano][categoria][mes] += categoria === "DEBIT" 
      ? Math.abs(t.amount ?? 0) 
      : (t.amount ?? 0);
  }

  return agrupado;
}


export default async function TransactionsLancamentosDRE() {
  const transactions = await getTransactions();
 
  const receitas = transactions
    .filter((t) => t.trntype === "CREDIT")
    .reduce((acc, t) => acc + (Math.abs(t.amount?? 0) ), 0);
    const despesas = transactions
    .filter((t) => t.trntype === "DEBIT")
    .reduce((acc, t) => acc + (Math.abs(t.amount ?? 0)), 0);
  const saldo=despesas-receitas
  console.log("Total de receitas:", formatCurrency(receitas));
  console.log("Total de despesas:", formatCurrency(despesas));
  console.log("Total de despesas:", formatCurrency(saldo));

  const agrupado = agruparPorAnoCategoriaMes(transactions);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex grid-cols-2 gap-2">
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Parâmetros
        </Button>
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
              +${formatCurrency(receitas)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
             <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
           
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
          <div className="text-muted-foreground"></div>
        </CardFooter>
      </Card>
      </div>

      {/* Tabela Estilo DRE */}
   
<div className="overflow-auto border rounded-lg">
  <table className="min-w-full text-sm">

    <tbody>
      {Object.entries(agrupado).map(([ano, categorias]) => (
      <div key={ano} className="mt-8">
        <h2 className="text-xl font-bold mb-4 ml-10"></h2>
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-black">
              
                        
            </thead>
            <tbody>
             {Object.entries(agrupado).map(([ano, categorias]) => (
      <div key={ano} className="mt-8">
        <h2 className="text-xl font-bold mb-4">DRE {ano}</h2>
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
              {Object.entries(categorias).map(([categoria, valoresMes]) => {
                const acumulado = Object.values(valoresMes).reduce((s, v) => s + v, 0);
                const isReceita = categoria === "CREDIT";

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
    ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
    </tbody>
  </table>
</div>
    </div>
  );
}
