'use client';
import React, { useState, useEffect } from 'react';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: '',
    descricao: '',
    unidade_medida: '',
    quantidade_atual: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Carrega produtos
  const fetchProdutos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/produtos`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'quantidade_atual' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const method = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `${API_URL}/api/produtos/${form.id}`
      : `${API_URL}/api/produtos`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao salvar produto');

      setMessage('Produto salvo com sucesso!');
      setShowForm(false);
      setForm({
        id: null,
        nome: '',
        descricao: '',
        unidade_medida: '',
        quantidade_atual: 0,
      });
      fetchProdutos();
    } catch (error) {
      setMessage(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produto) => {
    setForm(produto);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    try {
      const response = await fetch(`${API_URL}/api/produtos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 204) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao excluir produto');
      }

      fetchProdutos();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">

        {/* Topo da Página */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h1>

          <div className="flex gap-3">
            {/* Botão Voltar */}
            <button
              onClick={() => window.location.href = '/obras'}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition"
            >
              Voltar para Obras
            </button>

            {/* Novo Produto */}
            <button
              onClick={() => {
                setForm({
                  id: null,
                  nome: '',
                  descricao: '',
                  unidade_medida: '',
                  quantidade_atual: 0,
                });
                setShowForm(true);
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-medium transition shadow-sm"
            >
              + Novo Produto
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 font-medium">Nome</th>
                <th className="p-3 font-medium">Descrição</th>
                <th className="p-3 font-medium">Unidade</th>
                <th className="p-3 font-medium text-center">Qtd Atual</th>
                <th className="p-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length > 0 ? (
                produtos.map((p) => (
                  <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-800">{p.nome}</td>
                    <td className="p-3 text-gray-600">{p.descricao || '—'}</td>
                    <td className="p-3 text-gray-600">{p.unidade_medida}</td>
                    <td className="p-3 text-center text-gray-800 font-medium">
                      {p.quantidade_atual ?? 0}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
                    Nenhum produto cadastrado.
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
              {form.id ? 'Editar Produto' : 'Novo Produto'}
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
                name="unidade_medida"
                value={form.unidade_medida}
                onChange={handleChange}
                placeholder="Unidade (ex: kg, un, m³)"
                required
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              />

              <input
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição (opcional)"
                className="bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition md:col-span-2"
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade Atual
                </label>
                <input
                  name="quantidade_atual"
                  type="number"
                  min="0"
                  value={form.quantidade_atual}
                  onChange={handleChange}
                  className="w-full bg-white p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 mt-4 md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-md font-medium transition shadow-sm disabled:opacity-70"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
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
              <p className={`mt-3 text-sm font-medium ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}