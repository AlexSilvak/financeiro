// src/app/transactions/page.tsx
'use client' // Necessário para usar useSWR aqui!

import { useTransactions } from '@/hooks/useTransactions'
import { DataTable } from './data-table'
import { columns } from './columns'
import Loading from "@/components/Loading";
 
export default function Page() {

  const { transactions, isLoading, isError ,mutate} = useTransactions()

  return (
   
   
 <div className="p-4">
      
      <DataTable columns={columns} data={transactions}  mutate={mutate} />
       <div className='ml-200 mt-20'>
      {isLoading && <Loading/>}
    </div>
      
    </div> 
  ) 
}
