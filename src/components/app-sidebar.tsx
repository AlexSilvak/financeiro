"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


// This is sample data.
const data = {
  user: {
    name: "ERP",
    email: "erp@gmail.com",
    avatar: "",
  },
  teams: [
    {
      name: "Empresa 1 Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Empresa 2 Inc",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Empresa 3 Inc",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Financeiro",
      url: "#",
      icon: SquareTerminal,
      //isActive: true,
      items: [
        {
          title: "DRE",
          url: "/dre",
        },
        {
          title: "Lançamentos",
          url: "/transactions",
        },
        {
          title: "Categorias",
          url: "/categories",
        },
        {
          title: "Processar Extrato",
          url: "/extratos",
        },
        {
          title: "Fechamentos",
          url: "/fechamentos",
        },
        {
          title: "Planos de Pagamento",
          url: "/planos",
        },
         {
          title: "Contas a Pagar",
          url: "/planos",
        },
         {
          title: "Contas a Receber",
          url: "/planos",
        },
         {
          title: "Bancos",
          url: "/banks",
        },
         {
          title: "Agências",
          url: "/dashboard",
        },
          {
          title: "Contas Bancárias",
          url: "/contas-bancarias",
        },
          {
          title: "Categorias Financeiras",
          url: "/dashboard",
        },
          {
          title: "Lançamentos / Movimentações",
          url: "/dashboard",
        },
         {
          title: "Estratos",
          url: "/dashboard",
        },
         {
          title: "Fluxo de Caixa",
          url: "/fluxo-caixa",
        },
         {
          title: "Fechame",
          url: "/dashboard",
        },
        
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Parâmetros",
          url: "/parametros",
        },
      ],
    },
     {
      title: "Compras",
      url: "#",
      icon: SquareTerminal,
      //isActive: true,
      items: [
        {
          title: "DRE",
          url: "/dre",
        },
        {
          title: "Lançamentos",
          url: "/lancamentos",
        },
        {
          title: "Categorias",
          url: "/categories",
        },
        {
          title: "Processar Extrato",
          url: "/extratos",
        },
        {
          title: "Fechamentos",
          url: "/fechamentos",
        },
        {
          title: "Planos de Pagamento",
          url: "/planos",
        },
         {
          title: "Contas a Pagar",
          url: "/planos",
        },
         {
          title: "Contas a Receber",
          url: "/planos",
        },
         {
          title: "Bancos",
          url: "/bancos",
        },
         {
          title: "Agências",
          url: "/dashboard",
        },
          {
          title: "Contas Bancárias",
          url: "/contas-bancarias",
        },
          {
          title: "Categorias Financeiras",
          url: "/dashboard",
        },
          {
          title: "Lançamentos / Movimentações",
          url: "/dashboard",
        },
         {
          title: "Estratos",
          url: "/dashboard",
        },
         {
          title: "Fluxo de Caixa",
          url: "/dashboard",
        },
         {
          title: "Fechame",
          url: "/dashboard",
        },
        
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Parâmetros",
          url: "/parametros",
        },
      ],
    },
     {
      title: "Fiscal",
      url: "#",
      icon: SquareTerminal,
      //isActive: true,
      items: [
        {
          title: "DRE",
          url: "/dre",
        },
        {
          title: "Lançamentos",
          url: "/lancamentos",
        },
        {
          title: "Categorias",
          url: "/categories",
        },
        {
          title: "Processar Extrato",
          url: "/extratos",
        },
        {
          title: "Fechamentos",
          url: "/fechamentos",
        },
        {
          title: "Planos de Pagamento",
          url: "/planos",
        },
         {
          title: "Contas a Pagar",
          url: "/planos",
        },
         {
          title: "Contas a Receber",
          url: "/planos",
        },
         {
          title: "Bancos",
          url: "/bancos",
        },
         {
          title: "Agências",
          url: "/dashboard",
        },
          {
          title: "Contas Bancárias",
          url: "/contas-bancarias",
        },
          {
          title: "Categorias Financeiras",
          url: "/dashboard",
        },
          {
          title: "Lançamentos / Movimentações",
          url: "/dashboard",
        },
         {
          title: "Estratos",
          url: "/dashboard",
        },
         {
          title: "Fluxo de Caixa",
          url: "/dashboard",
        },
         {
          title: "Fechame",
          url: "/dashboard",
        },
        
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Parâmetros",
          url: "/parametros",
        },
      ],
    },
     {
      title: "Logistica",
      url: "#",
      icon: SquareTerminal,
      //isActive: true,
      items: [
        {
          title: "DRE",
          url: "/dre",
        },
        {
          title: "Lançamentos",
          url: "/lancamentos",
        },
        {
          title: "Categorias",
          url: "/categories",
        },
        {
          title: "Processar Extrato",
          url: "/extratos",
        },
        {
          title: "Fechamentos",
          url: "/fechamentos",
        },
        {
          title: "Planos de Pagamento",
          url: "/planos",
        },
         {
          title: "Contas a Pagar",
          url: "/planos",
        },
         {
          title: "Contas a Receber",
          url: "/planos",
        },
         {
          title: "Bancos",
          url: "/bancos",
        },
         {
          title: "Agências",
          url: "/dashboard",
        },
          {
          title: "Contas Bancárias",
          url: "/contas-bancarias",
        },
          {
          title: "Categorias Financeiras",
          url: "/dashboard",
        },
          {
          title: "Lançamentos / Movimentações",
          url: "/dashboard",
        },
         {
          title: "Estratos",
          url: "/dashboard",
        },
         {
          title: "Fluxo de Caixa",
          url: "/dashboard",
        },
         {
          title: "Fechame",
          url: "/dashboard",
        },
        
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Parâmetros",
          url: "/parametros",
        },
      ],
    },
     {
      title: "Vendas",
      url: "#",
      icon: SquareTerminal,
      //isActive: true,
      items: [
        {
          title: "DRE",
          url: "/dre",
        },
        {
          title: "Lançamentos",
          url: "/lancamentos",
        },
        {
          title: "Categorias",
          url: "/categories",
        },
        {
          title: "Processar Extrato",
          url: "/extratos",
        },
        {
          title: "Fechamentos",
          url: "/fechamentos",
        },
        {
          title: "Planos de Pagamento",
          url: "/planos",
        },
         {
          title: "Contas a Pagar",
          url: "/planos",
        },
         {
          title: "Contas a Receber",
          url: "/planos",
        },
         {
          title: "Bancos",
          url: "/bancos",
        },
         {
          title: "Agências",
          url: "/dashboard",
        },
          {
          title: "Contas Bancárias",
          url: "/contas-bancarias",
        },
          {
          title: "Categorias Financeiras",
          url: "/dashboard",
        },
          {
          title: "Lançamentos / Movimentações",
          url: "/dashboard",
        },
         {
          title: "Estratos",
          url: "/dashboard",
        },
         {
          title: "Fluxo de Caixa",
          url: "/dashboard",
        },
         {
          title: "Fechame",
          url: "/dashboard",
        },
        
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Parâmetros",
          url: "/parametros",
        },
      ],
    },
     {
      title: "CRM",
      url: "#",
      icon: SquareTerminal,
      //isActive: true,
      items: [
        {
          title: "DRE",
          url: "/dre",
        },
        {
          title: "Lançamentos",
          url: "/lancamentos",
        },
        {
          title: "Categorias",
          url: "/categories",
        },
        {
          title: "Processar Extrato",
          url: "/extratos",
        },
        {
          title: "Fechamentos",
          url: "/fechamentos",
        },
        {
          title: "Planos de Pagamento",
          url: "/planos",
        },
         {
          title: "Contas a Pagar",
          url: "/planos",
        },
         {
          title: "Contas a Receber",
          url: "/planos",
        },
         {
          title: "Bancos",
          url: "/bancos",
        },
         {
          title: "Agências",
          url: "/dashboard",
        },
          {
          title: "Contas Bancárias",
          url: "/contas-bancarias",
        },
          {
          title: "Categorias Financeiras",
          url: "/dashboard",
        },
          {
          title: "Lançamentos / Movimentações",
          url: "/dashboard",
        },
         {
          title: "Estratos",
          url: "/dashboard",
        },
         {
          title: "Fluxo de Caixa",
          url: "/dashboard",
        },
         {
          title: "Fechame",
          url: "/dashboard",
        },
        
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Parâmetros",
          url: "/parametros",
        },
      ],
    },
    {
      title: "Dashboards",
      url: "",
      icon: Bot,
      items: [
        {
          title: "Despesas",
          url: "/dashboard",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Cadastros",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Usuários",
          url: "#",
        },
        {
          title: "Clientes",
          url: "#",
        },
        {
          title: "Fornecedores",
          url: "#",
        },
         {
          title: "Terceiros",
          url: "#",
        },
          {
          title: "Colaboradores",
          url: "#",
        },
        {
          title: "Consulta",
          url: "#",
        },
        {
          title: "Cadastro",
          url: "#",
        },
        {
          title: "Status",
          url: "#",
        },
        {
          title: "Logs",
          url: "#",
        },
        {
          title: "Parâmetros",
          url: "#",
        },
      ],
    },
  
    {
      title: "Investimentos",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Fundos Imobiliários",
          url: "#",
        },
        {
          title: "CDB",
          url: "#",
        },
        
      ],
    },
    {
      title: "Inventário",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Produto",
          url: "#",
        },
        {
          title: "Estoque",
          url: "#",
        },
        {
          title: "Categoria",
          url: "#",
        },
        {
          title: "Custo",
          url: "#",
        },
        {
          title: "Preço",
          url: "#",
        },
        {
          title: "Variações",
          url: "#",
        },
        {
          title: "Histórico de movimentações",
          url: "#",
        },
        {
          title: "Veiculos",
          url: "#",
        },
      ],
    }
    ,
    {
      title: "Parâmetros Gerais",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Categorias",
          url: "#",
        },
        {
          title: "Pessoa",
          url: "#",
        },
        {
          title: "Formas de Pagamentos",
          url: "#",
        },
        {
          title: "Juros",
          url: "#",
        },
        {
          title: "Multa",
          url: "#",
        },
        {
          title: "Tipo",
          url: "#",
        },
         {
          title: "Cotação",
          url: "#",
        },
         {
          title: "Feriados",
          url: "#",
        },
        {
          title: "Status",
          url: "#",
        },
        {
          title: "Backup Banco de dados",
          url: "/backup",
        },
      ],
    },
    {
      title: "Automação",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Processar Extratos",
          url: "/extratos",
        },
        {
          title: "Pessoa",
          url: "#",
        },
        {
          title: "Formas de Pagamentos",
          url: "#",
        },
        {
          title: "Juros",
          url: "#",
        },
        {
          title: "Multa",
          url: "#",
        },
        {
          title: "Tipo",
          url: "#",
        },
        {
          title: "Status",
          url: "#",
        },
        {
          title: "Backup Banco de dados",
          url: "/backup",
        },
      ],
    },
    {
      title: "Serviços",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Painel de Serviços",
          url: "/services",
        },
        {
          title: "Pessoa",
          url: "#",
        },
        {
          title: "Formas de Pagamentos",
          url: "#",
        },
        {
          title: "Juros",
          url: "#",
        },
        {
          title: "Multa",
          url: "#",
        },
        {
          title: "Tipo",
          url: "#",
        },
        {
          title: "Status",
          url: "#",
        },
        {
          title: "Backup Banco de dados",
          url: "/backup",
        },
      ],
    },
     {
      title: "IA",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Painel de Serviços",
          url: "/services",
        },
        {
          title: "Criar Serviços",
          url: "#",
        },
      
        {
          title: "Status",
          url: "#",
        },
        {
          title: "Backup Banco de dados",
          url: "/backup",
        },
      ],
    },
     {
      title: "API Externas",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Processar Extratos",
          url: "/extratos",
        },
        {
          title: "Pessoa",
          url: "#",
        },
        {
          title: "Formas de Pagamentos",
          url: "#",
        },
        {
          title: "Juros",
          url: "#",
        },
        {
          title: "Multa",
          url: "#",
        },
        {
          title: "Tipo",
          url: "#",
        },
        {
          title: "Status",
          url: "#",
        },
        {
          title: "Backup Banco de dados",
          url: "/backup",
        },
      ],
    }
  ],
  
  projects: [
    {
      name: "Empresas",
      url: "#",
      icon: Frame,
    },
    {
      name: "Dashboard",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Clientes",
      url: "#",
      icon: Map,
    },
    {
      name: "Documentação",
      url: "/documentacao",
      icon: Map,
    },
    {
      name: "IA",
      url: "#",
      icon: Frame,
    },
    {
      name: "API Externas",
      url: "#",
      icon: Frame,
    },
    {
      name: "Notificações",
      url: "#",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
