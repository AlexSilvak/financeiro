import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { useEffect, useState } from "react"
import axios from "axios"

interface Categoria {
  id: number
  nome: string
}

export default function Search() {
  const [data, setData] = useState<Categoria[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/categorias")
        setData(response.data.categoria) // ✅ agora funciona!
      } catch (error) {
        console.error("Erro ao buscar categorias", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Command className="rounded-lg border shadow-md md:min-w-[200px]">
      <CommandInput placeholder="Procure os itens aqui..." />
      <CommandList>
        <CommandEmpty>não encontrado!</CommandEmpty>
        <CommandGroup>
          {data.map((categoria) => (
            <CommandItem key={categoria.id}>{categoria.nome}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
