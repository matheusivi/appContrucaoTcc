import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function GastoPorFornecedor({ entradas, fornecedores }) {
  const data = entradas.reduce((acc, item) => {
    const nome = fornecedores.find((f) => f.id === item.fornecedor_id)?.nome || "Desconhecido";
    const total = Number(item.preco_unitario) * item.quantidade;

    acc[nome] = (acc[nome] || 0) + total;
    return acc;
  }, {});

  const chartData = Object.entries(data).map(([nome, total]) => ({ nome, total }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" />
      </BarChart>
    </ResponsiveContainer>
  );
}
