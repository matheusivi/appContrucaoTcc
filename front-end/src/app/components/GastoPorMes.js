'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function GastoTotalPorMes({ idObra }) {
  const [dados, setDados] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);

  useEffect(() => {
    if (!idObra) return;

    async function fetchData() {
      try {
        const token = typeof window !== 'undefined'
          ? localStorage.getItem('token')
          : null;

        if (!token) {
          console.warn('Sem token para buscar gastos mensais');
          return;
        }

        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const res = await fetch(`${base}/api/gastos/obra/${idObra}/mensal`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const erroTexto = await res.text();
          console.error('Erro ao buscar gastos mensais:', res.status, erroTexto);
          return;
        }

        const json = await res.json();

        const mensal = json.mensal || [];
        const total = Number(json.total_geral || 0);

        const formatado = mensal.map((m) => ({
          mes: m.mes,
          total: Number(m.total_gasto || 0),
        }));

        setDados(formatado);
        setTotalGeral(total);

      } catch (err) {
        console.error('Erro ao calcular GastoTotalPorMes:', err);
      }
    }

    fetchData();
  }, [idObra]);

  return (
    <div className="w-full h-96 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">
        Gasto Total por Mês
      </h2>

      <p className="text-sm text-gray-700 mb-4">
         Total gasto na obra:
        <span className="font-bold"> R$ {totalGeral.toFixed(2)}</span>
      </p>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={dados} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
