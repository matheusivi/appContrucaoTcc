'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/header';
import GastoTotalPorMes from "../../components/GastoPorMes";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export default function ObraDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [obra, setObra] = useState(null);
  const [fases, setFases] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fasesPadrao = [
    { nome: 'Fase 1: Fundação', peso: 1, percentual_concluido: 0, data_inicio: null, data_fim_prevista: null, data_fim_real: null },
    { nome: 'Fase 2: Estrutura', peso: 1, percentual_concluido: 0, data_inicio: null, data_fim_prevista: null, data_fim_real: null },
    { nome: 'Fase 3: Acabamento', peso: 1, percentual_concluido: 0, data_inicio: null, data_fim_prevista: null, data_fim_real: null },
  ];

  useEffect(() => {
    if (!id) return;
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchAll() {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) { router.push('/login'); return; }

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      const [obraRes, fasesRes, estoqueRes] = await Promise.all([
        fetch(`${base}/api/obras/${id}`, { headers }),
        fetch(`${base}/api/fases/obra/${id}`, { headers }),
        fetch(`${base}/api/estoque-por-obra/obra/${id}`, { headers }),
      ]);

      const obraData = await safeParse(obraRes);
      const fasesData = await safeParse(fasesRes);
      const estoqueData = await safeParse(estoqueRes);

      setObra(obraData || null);
      setFases(normalizarFases(fasesData, fasesPadrao));
      setEstoque(Array.isArray(estoqueData) ? estoqueData : []);
    } catch (err) {
      console.error('Erro ao buscar dados da obra:', err);
    } finally {
      setLoading(false);
    }
  }

  // Helpers
  function numberOrDefault(v, fallback = 0) {
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
  }

  function handleChangeFase(faseIdOrIndex, campo, valor) {
    setFases(prev =>
      prev.map((f, i) => {
        const match = f.id != null ? f.id === faseIdOrIndex : i === faseIdOrIndex;
        if (!match) return f;
        return {
          ...f,
          [campo]:
            campo === 'peso' || campo === 'percentual_concluido'
              ? valor === '' ? '' : valor
              : valor,
        };
      }),
    );
  }

  async function handleSalvarAlteracoes() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { alert('Token ausente — faça login novamente.'); router.push('/login'); return; }

    const payloadFases = fases.map((f) => ({
      id: f.id || undefined,
      nome: f.nome || '',
      obra_id: obra?.id || Number(id),
      data_inicio: f.data_inicio || null,
      data_fim_prevista: f.data_fim_prevista || f.data_fim_previsto || null,
      data_fim_real: f.data_fim_real || null,
      percentual_concluido: numberOrDefault(f.percentual_concluido, 0),
      peso: numberOrDefault(f.peso, 1),
    }));

    setSaving(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/obras/${id}/fases`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fases: payloadFases }),
      });

      if (!res.ok) {
        const err = await safeParse(res);
        console.error('Erro no backend ao salvar fases:', res.status, err);
        alert('Erro ao salvar fases. Veja console.');
        return;
      }

      const data = await safeParse(res);
      if (data?.fasesAtualizadas) setFases(data.fasesAtualizadas);
      else if (Array.isArray(data)) setFases(data);

      alert('Alterações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar fases:', err);
      alert('Erro ao salvar alterações. Veja console.');
    } finally {
      setSaving(false);
    }
  }

  const handleRegistrarMaterial = () => router.push(`/obra/${id}/movimentacao`);

  if (loading) return <p className="text-center mt-10 text-gray-600">Carregando dados da obra...</p>;
  if (!obra) return <p className="text-center mt-10 text-red-600">Obra não encontrada.</p>;

  // Dados para gráficos
  const linhasProgresso = fases.map(f => ({
    name: f.nome,
    progresso: Number(f.percentual_concluido) || 0,
  }));

  const barrasPeso = fases.map(f => ({
    name: f.nome,
    peso: Number(f.peso) || 0,
  }));

  const estoquePorProduto = estoque.map(item => ({
    name: item.produtos?.nome || '—',
    quantidade: item.quantidade || 0,
  }));

  const estoqueTotal = estoque.reduce((acc, i) => acc + (i.quantidade || 0), 0);
  const estoqueTotalData = [{ name: 'Total Atual', total: estoqueTotal }];

  return (
    <>
      <Header />

      <main className="flex-1 px-10 md:px-20 py-10 bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold">{obra.nome}</h1>
              <p className="text-gray-500">{obra.endereco}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => router.push(`/obra/${id}/editar`)} className="inline-flex items-center justify-center rounded-md bg-red-600 text-white shadow-sm hover:bg-red-500 h-9 px-4 py-2 text-sm font-medium">
                Editar Obra
              </button>
              <button onClick={() => router.push('/obras')} className="inline-flex items-center justify-center rounded-md border h-9 px-4 py-2 text-sm font-medium">
                Voltar
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InfoBox label="Data de Início" valor={obra.data_inicio} tipo="data" />
            <InfoBox label="Status" valor={obra.status} classe="text-green-600" />
            <InfoBox label="Responsável" valor={obra.usuarios?.nome} />
          </div>

          {/* Progresso e Fases */}
          <div className="rounded-lg border bg-white shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Progresso da Obra</h3>
              <p className="text-sm font-medium text-gray-500">{calcularProgresso(fases)}% concluído</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-red-600 h-2.5 rounded-full transition-all" style={{ width: `${calcularProgresso(fases)}%` }} />
            </div>

            <div className="space-y-6">
              {fases.map((fase, idx) => (
                <div key={fase.id ?? `nova-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-1">
                    <h4 className="font-semibold">{fase.nome}</h4>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <Campo label="Peso" tipo="number" valor={fase.peso} onChange={(v) => handleChangeFase(fase.id ?? idx, 'peso', v)} />
                    <Campo label="Concluído (%)" tipo="number" valor={fase.percentual_concluido} onChange={(v) => handleChangeFase(fase.id ?? idx, 'percentual_concluido', v)} />
                    <Campo label="Data Início" tipo="date" valor={formatDateInput(fase.data_inicio)} onChange={(v) => handleChangeFase(fase.id ?? idx, 'data_inicio', v)} />
                    <Campo label="Fim Previsto" tipo="date" valor={formatDateInput(fase.data_fim_prevista ?? fase.data_fim_previsto)} onChange={(v) => handleChangeFase(fase.id ?? idx, 'data_fim_prevista', v)} />
                    <Campo label="Fim Real" tipo="date" valor={formatDateInput(fase.data_fim_real)} onChange={(v) => handleChangeFase(fase.id ?? idx, 'data_fim_real', v)} />
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <button onClick={handleSalvarAlteracoes} disabled={saving} className={`inline-flex items-center justify-center rounded-md bg-red-600 text-white shadow hover:bg-red-500 h-9 px-4 py-2 text-lg font-medium ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>

          {/* Estoque header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Estoque da Obra</h2>
            <div>
              <button onClick={handleRegistrarMaterial} className="inline-flex items-center justify-center bg-red-600 text-white shadow hover:bg-red-500 h-9 px-4 py-2 gap-2 text-sm font-medium rounded-md">
                Registrar Material
              </button>
            </div>
          </div>

          {/* Tabela de Estoque */}
          <PageTabelaEstoque estoque={estoque} />

          {/* --- GRÁFICOS REORGANIZADOS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

           

          <GastoTotalPorMes idObra={id} />

            {/* 3) Estoque Total (Area) — se quiser série temporal no futuro, exponha histórico no backend */}
            <div className="rounded-lg border bg-white shadow-sm p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Estoque Total Acumulado</h3>
              <div className="mb-3 text-sm text-gray-600">Total atual de unidades somadas no estoque desta obra: <strong>{estoqueTotal}</strong></div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={estoqueTotalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" fill="#c53030" stroke="#c53030" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Extra opcional: Estoque por produto (Bar horizontal-like) */}
            <div className="rounded-lg border bg-white shadow-sm p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Estoque por Material (quantidade)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={estoquePorProduto}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </main>
    </>
  );
}

/* ----------------- Componentes auxiliares internos ----------------- */

function PageTabelaEstoque({ estoque }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="relative w-full overflow-auto">
        <table className="min-w-full text-sm text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Produto</th>
              <th className="px-4 py-2 border">Unidade</th>
              <th className="px-4 py-2 border">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {estoque && estoque.length > 0 ? (
              estoque.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">{item.produtos?.nome || '—'}</td>
                  <td className="px-4 py-2 border">{item.produtos?.unidade_medida || '—'}</td>
                  <td className="px-4 py-2 border">{item.quantidade ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  Nenhum material registrado para esta obra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoBox({ label, valor, tipo, classe }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${classe || ''}`}>
        {tipo === 'data' ? (valor ? new Date(valor).toLocaleDateString('pt-BR') : '-') : valor || '—'}
      </p>
    </div>
  );
}

function Campo({ label, tipo, valor, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={tipo}
        value={valor ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
      />
    </div>
  );
}

/* ----------------- Utilitários ----------------- */

function calcularProgresso(fases) {
  if (!fases || fases.length === 0) return 0;
  const somaPesos = fases.reduce((acc, f) => acc + (Number(f.peso) || 0), 0) || 1;
  const total = fases.reduce(
    (acc, f) => acc + (Number(f.percentual_concluido) || 0) * (Number(f.peso) || 0),
    0,
  );
  return Math.round(total / somaPesos);
}

function formatDateInput(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    // corrige para evitar -1 dia por timezone quando usar input type=date
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
}

function normalizarFases(fasesData, padrao) {
  let fasesNorm = Array.isArray(fasesData) ? [...fasesData] : [];
  if (!fasesNorm.length) return padrao.map((f) => ({ ...f, id: null }));
  const nomes = fasesNorm.map((f) => f.nome?.toLowerCase());
  padrao.forEach((p) => {
    if (!nomes.includes(p.nome.toLowerCase())) fasesNorm.push({ ...p, id: null });
  });
  return fasesNorm;
}

async function safeParse(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
