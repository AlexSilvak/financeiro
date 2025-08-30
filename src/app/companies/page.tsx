"use client";

import { useEffect, useState } from "react";
import { columns, Company } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompaniesPage() {
  const [data, setData] = useState<Company[]>([]);
  const [form, setForm] = useState({ name: "", cnpj: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchCompanies() {
    const res = await fetch("/api/companies");
    const json = await res.json();
    setData(json);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/companies/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", cnpj: "", email: "", phone: "" });
    fetchCompanies();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/companies/${id}`, { method: "DELETE" });
    fetchCompanies();
  }

  function handleEdit(company: Company) {
    setForm({
      name: company.name,
      cnpj: company.cnpj,
      email: company.email || "",
      phone: company.phone || "",
    });
    setEditingId(company._id);
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-2xl font-bold">Cadastro de Empresas</h1>

      <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-4">
        <Input
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          required
        />
        <Input
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Telefone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Button type="submit" className="md:col-span-4">
          {editingId ? "Salvar Alterações" : "Cadastrar"}
        </Button>
      </form>

      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
