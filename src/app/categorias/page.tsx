
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

export default function Page() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Cadastro de Categoria</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Categoria</DialogTitle>
            <DialogDescription>
             </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Nome</Label>
              <Input id="name-1" name="nome" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Tipo</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Descricao</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Cor</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
            
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
