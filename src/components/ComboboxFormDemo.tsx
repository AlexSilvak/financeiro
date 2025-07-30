'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCheckIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Exemplo de dados recebidos da API
const categories = [
  {
    _id: '688398edeee3057d44f1964a',
    name: 'Manutenção',
    description: 'Custo com Manutenção Veicular',
    type: 'expense' 
  },
  {
    _id: '6883a637f31df26a5ccf3c5a',
    name: 'Transporte',
    description: 'Combustível e Uber',
    type: 'expense'
  },
  {
    _id: '6883a65ff31df26a5ccf3c5d',
    name: 'Salário',
    description: 'Renda mensal fixa',
    type: 'income'
  }
]

const FormSchema = z.object({
  category: z.string({ required_error: 'Categoria é obrigatória.' })
})

const CategoryCombobox = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selected = categories.find(c => c._id === data.category)
    toast.custom(() => (
      <Alert className='border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'>
        <CheckCheckIcon />
        <AlertTitle>
          Categoria selecionada: "{selected?.name}" ({selected?.type})
        </AlertTitle>
      </Alert>
    ))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-md space-y-6'>
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='w-full max-w-xs justify-between'
                    >
                      {field.value
                        ? categories.find(c => c._id === field.value)?.name
                        : <span className='text-muted-foreground'>Selecione uma categoria...</span>}
                      <ChevronsUpDownIcon className='opacity-50' />
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className='w-[--radix-popper-anchor-width] p-0'>
                  <Command>
                    <CommandInput placeholder='Buscar categoria...' />
                    <CommandList>
                      <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                      <CommandGroup>
                        {categories.map(category => (
                          <CommandItem
                            key={category._id}
                            value={category._id}
                            onSelect={() => {
                              setSelectedId(category._id)
                              field.onChange(category._id)
                              setOpen(false)
                            }}
                          >
                            {category.name}
                            <CheckIcon
                              className={cn(
                                'ml-auto',
                                selectedId === category._id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Selecione a categoria da transação.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Confirmar</Button>
      </form>
    </Form>
  )
}

export default CategoryCombobox
