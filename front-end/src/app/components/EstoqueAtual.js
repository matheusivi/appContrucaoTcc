import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function EstoqueAtual({ estoque, produtos }) {
  const data = estoque.map((item) => ({
    nome: produtos.find((p) => p.id === item.produto_id)?.nome || "Desconhecido",
    quantidade: item.quantidade,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantidade" />
      </BarChart>
    </ResponsiveContainer>
  );
}
