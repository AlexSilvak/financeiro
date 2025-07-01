import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      description: "Internet",
      forma_de_pagamento:'Pix',
      type:'Despesa',
      category:'Internet'
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10  ">
      <DataTable columns={columns} data={data}  />
    </div>
  )
}