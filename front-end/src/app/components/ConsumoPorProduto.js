'use client';
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function ConsumoPorProduto({ idObra }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idObra) return;
    fetchConsumo();
  }, [idObra]);

  async function fetchConsumo() {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${base}/api/saidas/obra/${idObra}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const saidas = await safeParse(res);
      if (!Array.isArray(saidas)) {
        setData([]);
        setLoading(false);
        return;
      }

      // Agrupar por produto
      const agrupado = {};

      saidas.forEach((item) => {
        const nome = item.produtos?.nome || 'Desconhecido';
        agrupado[nome] = (agrupado[nome] || 0) + (item.quantidade || 0);
      });

      const formatado = Object.entries(agrupado).map(([nome, quantidade]) => ({
        nome,
        quantidade,
      }));

      setData(formatado);
    } catch (err) {
      console.error('Erro ao carregar consumo por produto:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="text-gray-500 text-sm">Carregando consumo...</p>;

  if (!data.length)
    return (
      <p className="text-gray-500 text-sm">
        Ainda não há saídas registradas para esta obra.
      </p>
    );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Consumo por Produto</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantidade" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* Utilitário para parse seguro */
async function safeParse(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
