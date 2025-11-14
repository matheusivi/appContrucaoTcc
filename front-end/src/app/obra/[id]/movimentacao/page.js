'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function MovimentacaoPage() {
  const { id } = useParams(); // obra_id
  const [obra, setObra] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  const [formData, setFormData] = useState({
    produto_id: '',
    quantidade: '',
    preco_unitario: '',
    fornecedor_id: '',
    tipo: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Buscar dados da obra
  useEffect(() => {
    const fetchObra = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/obras/${id}`,
        );
        const data = await res.json();
        setObra(data);
      } catch {
        setObra({ nome: 'Obra não encontrada' });
      }
    };
    if (id) fetchObra();
  }, [id]);

  // Buscar produtos e fornecedores
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProdutos = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/produtos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setProdutos(data);
    };
    const fetchFornecedores = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/fornecedores`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setFornecedores(data);
    };
    fetchProdutos();
    fetchFornecedores();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Envio para /entradas ou /saida
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const url =
        formData.tipo === 'entrada'
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/entradas`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/saida`;

      const body = {
        produto_id: Number(formData.produto_id),
        quantidade: Number(formData.quantidade),
        obra_id: Number(id),
        preco_unitario:
          formData.tipo === 'entrada'
            ? Number(formData.preco_unitario || 0)
            : undefined,
        fornecedor_id:
          formData.tipo === 'entrada'
            ? Number(formData.fornecedor_id || 0)
            : undefined,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Erro ao registrar movimentação');

      setMessage(`Movimentação de ${formData.tipo} registrada com sucesso!`);
      setFormData({
        produto_id: '',
        quantidade: '',
        preco_unitario: '',
        fornecedor_id: '',
        tipo: '',
      });
    } catch (error) {
      console.error(error);
      setMessage(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:px-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        {/* Cabeçalho */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Registrar Movimentação
            </h1>
            {obra && (
              <p className="text-sm text-gray-600 mt-1">
                Obra: <span className="font-medium">{obra.nome}</span>
              </p>
            )}
          </div>

          {/* Botão de Voltar */}
          <button
            type="button"
            onClick={() => (window.location.href = `/obra/${id}`)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md shadow-sm transition"
          >
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Produto */}
          <div>
            <label
              htmlFor="produto_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Produto
            </label>
            <select
              id="produto_id"
              value={formData.produto_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.unidade_medida})
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label
              htmlFor="quantidade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantidade
            </label>
            <input
              id="quantidade"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.quantidade}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              placeholder="Ex: 50.00"
              required
            />
          </div>

          {/* Tipo de Movimentação */}
          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de Movimentação
            </label>
            <select
              id="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              required
            >
              <option value="">Selecione</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          {/* Campos condicionais: apenas para Entrada */}
          {formData.tipo === 'entrada' && (
            <div className="space-y-6 pt-2 border-t border-gray-200 animate-fadeIn">
              <div>
                <label
                  htmlFor="fornecedor_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fornecedor
                </label>
                <select
                  id="fornecedor_id"
                  value={formData.fornecedor_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome_fantasia || f.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="preco_unitario"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preço Unitário (R$)
                </label>
                <input
                  id="preco_unitario"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.preco_unitario}
                  onChange={handleChange}
                  placeholder="Ex: 25.90"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Botão de Envio */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-4 rounded-md transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Registrar Movimentação'}
            </button>
          </div>

          {/* Mensagem de feedback */}
          {message && (
            <p
              className={`text-center text-sm font-medium p-3 rounded-md ${
                message.includes('sucesso')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
