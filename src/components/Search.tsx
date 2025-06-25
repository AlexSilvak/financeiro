
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export default function search() {
    return (
    <>
   
    <Command className="rounded-lg border shadow-md md:min-w-[200px]">
      <CommandInput placeholder="Procure os itens aqui..." />
      <CommandList>
        <CommandEmpty>não encontrado!.</CommandEmpty>
        <CommandGroup >
          <CommandItem>
            <Calendar />
            <span>Internet</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Aluguel</span>
          </CommandItem>
       
        </CommandGroup>
      </CommandList>
    </Command>
     
 
   
    </>
    
    
    )
  }