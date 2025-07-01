'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Categoria {
  _id: string
  nome: string
}

interface CategoriaDropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function CategoriaDropdown({ value, onChange }: CategoriaDropdownProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("/api/categorias")
        setCategorias(res.data.categorias) // <-- garante que é um array
        axios.get("/api/categorias").then(res => console.log(res.data))
        console.log(res.data.categorias)

      } catch (error) {
        console.error("Erro ao buscar categorias", error)
      }
    }

    fetchCategorias()
  }, [])

  return (
    <div className="space-y-2">
      <Label>Categoria</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          {categorias.map((cat) => (
            <SelectItem key={cat._id} value={cat.nome}>
              {cat.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
