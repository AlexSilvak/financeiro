"use client"

import { useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("Erro ao buscar contas", err))
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gerenciamento de Contas</h1>
      <DataTable columns={columns} data={accounts} />
    </div>
  )
}
