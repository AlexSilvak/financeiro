"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { string } from "zod"
export default function newInvoices() {

 
// tuple  
let tuple: [string, number] = ["titulo",30]

enum status_pag{
  pedendete, 
  pago,
  recebido
}
enum recorrencia{
  semanal,
  mensal,
  anual
}
// enum 
enum categoria{
  receita,
  despesa
}

let categoria_financeira : categoria
//union
let id: 123 | string ='Alex'

// intersection
type super_usuario ={role:string}
type usuario={name:string}
type administrador=super_usuario & usuario

let super_usuario: administrador={role:'Gerente', name:'Alex'}

// tipos literais
let status :"Sucesso" | "Error" |"Carregando" | "Sucesso"

 type ID =string | number

let userID : ID ='123'

interface user{
  name:string,
  saldo: number
}

interface Admin extends user{
  role: string
}

let admin : Admin={name:'Alex',saldo: 10000, role: 'Manager'}
    return (
    
    <>
    <div className="flex grid-cols-1 px-100 ml-80 mt-20">
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Novo Lançamento</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Incluir Lançamento</DialogTitle>
           
          </DialogHeader>
          <div className="grid gap-6">
          <div className="grid gap-3">
              <Label htmlFor="name-1">#1564648</Label>
              
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name-1">Descricação</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Categoria</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Pagador</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
        
            <div className="grid gap-3">
              <Label htmlFor="username-1">CPF/CNPJ</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1" >Data da Transação</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte"  type="data"/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">CPF/CNPJ</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Incluir</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
</div>
    </>
    
    )
  }