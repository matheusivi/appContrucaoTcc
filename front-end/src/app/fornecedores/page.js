"use client";
import React, { useState, useEffect } from "react";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    contato_principal: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Carregar fornecedores
  const fetchFornecedores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/fornecedores`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setFornecedores(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const method = form.id ? "PUT" : "POST";
    const url = form.id
      ? `${API_URL}/api/fornecedores/${form.id}`
      : `${API_URL}/api/fornecedores`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar fornecedor");

      setMessage("Fornecedor salvo com sucesso!");
      setShowForm(false);
      setForm({
        id: null,
        nome: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        contato_principal: "",
      });
      fetchFornecedores();
    } catch (err) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (f) => {
    setForm(f);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir este fornecedor?")) return;

    try {
      const res = await fetch(`${API_URL}/api/fornecedores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 204) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }

      fetchFornecedores();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">

        {/* Topo da Página */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Fornecedores</h1>

          <div className="flex gap-3">
            {/* Voltar */}
            <button
              onClick={() => (window.location.href = "/obras")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition"
            >
              Voltar para Obras
            </button>

            {/* Novo Fornecedor */}
            <button
              onClick={() => {
                setForm({
                  id: null,
                  nome: "",
                  cnpj: "",
                  endereco: "",
                  telefone: "",
                  email: "",
                  contato_principal: "",
                });
                setShowForm(true);
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-medium transition shadow-sm"
            >
              + Novo Fornecedor
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 font-medium">Nome</th>
                <th className="p-3 font-medium">CNPJ</th>
                <th className="p-3 font-medium">Telefone</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 text-right font-medium">Ações</th>
              </tr>
            </thead>

            <tbody>
              {fornecedores.length > 0 ? (
                fornecedores.map((f) => (
                  <tr
                    key={f.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-gray-800">{f.nome}</td>
                    <td className="p-3 text-gray-600">{f.cnpj}</td>
                    <td className="p-3 text-gray-600">{f.telefone}</td>
                    <td className="p-3 text-gray-600">{f.email}</td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleEdit(f)}
                        className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    Nenhum fornecedor cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              {form.id ? "Editar Fornecedor" : "Novo Fornecedor"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome"
                required
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              />

              <input
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                placeholder="CNPJ (12.345.678/0001-99)"
                required
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              />

              <input
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Endereço"
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition md:col-span-2"
              />

              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              />

              <input
                name="contato_principal"
                value={form.contato_principal}
                onChange={handleChange}
                placeholder="Contato principal"
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition md:col-span-2"
              />

              {/* Botões */}
              <div className="flex gap-3 mt-4 md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-md font-medium transition shadow-sm disabled:opacity-70"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition"
                >
                  Cancelar
                </button>
              </div>
            </form>

            {message && (
              <p className={`mt-3 text-sm font-medium ${message.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}