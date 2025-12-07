import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function TopProdutosCusto({ entradas, produtos }) {
  const totalPorProduto = entradas.reduce((acc, item) => {
    const valor = Number(item.preco_unitario) * item.quantidade;
    acc[item.produto_id] = (acc[item.produto_id] || 0) + valor;
    return acc;
  }, {});

  const data = Object.keys(totalPorProduto)
    .map((id) => ({
      nome: produtos.find((p) => p.id === Number(id))?.nome || "Desconhecido",
      total: totalPorProduto[id],
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" />
      </BarChart>
    </ResponsiveContainer>
  );
}
