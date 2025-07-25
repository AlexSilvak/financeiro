'use client'

import useSWR from 'swr'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function FluxogramaCaixa({ usuarioId='64user12345678' }: { usuarioId: string }) {
        
  const { data: entradasData } = useSWR(`/api/contas-receber?usuario_id=${usuarioId}`, fetcher)
  const { data: saidasData } = useSWR(`/api/contas-pagar?usuario_id=${usuarioId}`, fetcher)

  
  const printRef = useRef<HTMLDivElement>(null) 
  const entradas = entradasData?.contas|| []
  const saidas = saidasData?.contas|| []

  const nodes = [
    {
      id: 'entradas',
      type: 'input',
      position: { x: 0, y: 100 },
      data: { label: `Entradas (${entradas.length})` },
    },
    {
      id: 'caixa',
      position: { x: 250, y: 100 },
      data: { label: 'Caixa' },
    },
    {
      id: 'saidas',
      type: 'output',
      position: { x: 500, y: 100 },
      data: { label: `Saídas (${saidas.length})` },
    },
  ]

  const edges = [
    { id: 'e1', source: 'entradas', target: 'caixa', animated: true },
    { id: 'e2', source: 'caixa', target: 'saidas', animated: true },
  ]
const handleExportPDF = async () => {
    const element = printRef.current
    if (!element) return

    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save('fluxo-de-caixa.pdf')
  }

  return (
        <div className="space-y-4">
    <div ref={printRef} className="h-[500px] border rounded-md shadow bg-white" >
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
       <h2 className="text-xl font-bold">Fluxo de Caixa</h2>
        <p>Receitas, despesas, saldo, etc…</p>
        {/* TODO: Substituir pelo gráfico real */}
       <Button onClick={handleExportPDF}>Exportar para PDF</Button>
    </div>
    </div>
  )
}
