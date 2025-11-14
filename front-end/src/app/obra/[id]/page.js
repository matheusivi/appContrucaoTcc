'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/header';

export default function ObraDetalhe() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [obra, setObra] = useState(null);
  const [fases, setFases] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fases padrão caso API não retorne todas
  const fasesPadrao = [
    {
      nome: 'Fase 1: Fundação',
      peso: 1,
      percentual_concluido: 0,
      data_inicio: null,
      data_fim_previsto: null,
      data_fim_real: null,
    },
    {
      nome: 'Fase 2: Estrutura',
      peso: 1,
      percentual_concluido: 0,
      data_inicio: null,
      data_fim_previsto: null,
      data_fim_real: null,
    },
    {
      nome: 'Fase 3: Acabamento',
      peso: 1,
      percentual_concluido: 0,
      data_inicio: null,
      data_fim_previsto: null,
      data_fim_real: null,
    },
  ];

  useEffect(() => {
    async function carregarEstoque() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `http://localhost:5000/api/estoque-por-obra/obra/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setEstoque(data);
        } else {
          console.error('Erro ao buscar estoque da obra');
        }
      } catch (err) {
        console.error('Erro de conexão:', err);
      }
    }

    if (id) carregarEstoque();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      try {
        const [obraRes, fasesRes, estoqueRes] = await Promise.all([
          fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            }/api/obras/${id}`,
            { headers },
          ),
          fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            }/api/fases/obra/${id}`,
            { headers },
          ),
          fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            }/api/estoque-por-obra/obra/${id}`,
            { headers },
          ),
        ]);

        // Se algum retornar não-ok, log e continua tentando parse (apenas para dev)
        if (!obraRes.ok) {
          console.error('Erro ao buscar obra:', obraRes.status);
        }
        if (!fasesRes.ok) {
          console.error('Erro ao buscar fases:', fasesRes.status);
        }
        if (!estoqueRes.ok) {
          console.error('Erro ao buscar estoque:', estoqueRes.status);
        }

        // Parse seguro de JSON
        const parseSafe = async (res) => {
          try {
            const text = await res.text();
            return text ? JSON.parse(text) : null;
          } catch (err) {
            console.warn('Resposta não-JSON:', err);
            return null;
          }
        };

        const obraData = await parseSafe(obraRes);
        const fasesData = await parseSafe(fasesRes);
        console.log('🧩 Fases recebidas do backend:', fasesData);

        const estoqueData = await parseSafe(estoqueRes);

        setObra(obraData || null);

        // Garantir que temos ao menos as 3 fases principais. Se a API devolve um array, mapear por nome ou id.
        let fasesNorm = Array.isArray(fasesData) ? fasesData.slice() : [];
        // Se não houver nenhuma fase, montar a partir do padrão
        if (!fasesNorm.length) {
          // Mantém id null para fases novas (backend deve criar se usar POST ou aceitar PUT em lote)
          fasesNorm = fasesPadrao.map((f, idx) => ({ ...f, id: null }));
        } else {
          // Se faltam fases (por nome), mesclar com padrão (preservando as retornadas)
          const nomes = fasesNorm.map((f) => f.nome?.toLowerCase());
          fasesPadrao.forEach((padrao) => {
            if (!nomes.includes(padrao.nome.toLowerCase())) {
              fasesNorm.push({ ...padrao, id: null });
            }
          });
          // ordenar pelo nome padrão (fundação, estrutura, acabamento) se possível
          const ordemNomes = fasesPadrao.map((f) => f.nome.toLowerCase());
          fasesNorm.sort((a, b) => {
            const ai = ordemNomes.indexOf((a.nome || '').toLowerCase());
            const bi = ordemNomes.indexOf((b.nome || '').toLowerCase());
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
          });
        }

        setFases(fasesNorm);
        console.log('✅ Fases ajustadas no front:', fasesNorm);
        setEstoque(Array.isArray(estoqueData) ? estoqueData : []);
      } catch (error) {
        console.error('Erro ao carregar dados da obra:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id, router]);

  // Normaliza valor de input (string) para número inteiro
  const numberOrDefault = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
  };

  // Atualiza um campo localmente
  const handleChangeFase = (faseIdOrIndex, campo, valor) => {
    setFases((prev) =>
      prev.map((f, i) => {
        // permitir seleção por id ou por índice quando id for null
        const match =
          f.id !== null ? f.id === faseIdOrIndex : i === faseIdOrIndex;
        if (!match) return f;
        // Para datas, já recebemos 'YYYY-MM-DD' strings; backend espera Date string ok.
        return {
          ...f,
          [campo]:
            campo === 'peso' || campo === 'percentual_concluido'
              ? valor === ''
                ? ''
                : valor
              : valor,
        };
      }),
    );
  };

  // Envia todas as fases em um único PUT para /api/obras/:id/fases
  const handleSalvarAlteracoes = async () => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('Token ausente — faça login novamente.');
      router.push('/login');
      return;
    }

    // Preparar payload: converter strings para tipos esperados
    const payloadFases = fases.map((f) => ({
      id: f.id || undefined, // se null -> undefined
      nome: f.nome || '',
      obra_id: obra?.id || Number(id),
      data_inicio: f.data_inicio || null,
      data_fim_prevista: f.data_fim_previsto || f.data_fim_prevista || null,
      data_fim_real: f.data_fim_real || null,
      percentual_concluido: numberOrDefault(f.percentual_concluido, 0),
      peso: numberOrDefault(f.peso, 1),
    }));

    setSaving(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/obras/${id}/fases`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fases: payloadFases }),
        },
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        console.error('Erro no backend ao salvar fases:', res.status, errBody);
        if (errBody?.errors) {
          const msgs = errBody.errors
            .map((e) => `${e.param}: ${e.msg}`)
            .join('\n');
          alert('Erros de validação:\n' + msgs);
        } else {
          alert('Falha ao salvar alterações. Veja console para detalhes.');
        }
        return;
      }

      const data = await res.json().catch(() => null);
      // Se backend retornou fases atualizadas, podemos atualizar local
      if (data?.fasesAtualizadas) {
        setFases(data.fasesAtualizadas);
      } else if (Array.isArray(data)) {
        setFases(data);
      }

      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar fases:', error);
      alert('Erro ao salvar alterações. Veja console.');
    } finally {
      setSaving(false);
    }
  };

  const handleRegistrarMaterial = () => {
    router.push(`/obra/${id}/movimentacao`);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Carregando dados da obra...
      </p>
    );
  if (!obra)
    return (
      <p className="text-center mt-10 text-red-600">Obra não encontrada.</p>
    );

  return (
    <>
      <Header />

      <main className="flex-1 px-40 py-10 bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl">
          {/* Cabeçalho obra */}
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold">{obra.nome}</h1>
              <p className="text-gray-500">{obra.endereco}</p>
            </div>
            <button className="inline-flex items-center justify-center rounded-md bg-red-600 text-white shadow-sm hover:bg-red-500 h-9 px-4 py-2 gap-2 text-sm font-medium">
              <span className="material-symbols-outlined text-lg">
                {' '}
                Editar Obra
              </span>
            </button>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InfoBox
              label="Data de Início"
              valor={obra.data_inicio}
              tipo="data"
            />
            <InfoBox
              label="Status"
              valor={obra.status}
              classe="text-green-600"
            />
            <InfoBox label="Responsável" valor={obra.usuarios?.nome} />
          </div>

          {/* Progresso */}
          <div className="rounded-lg border bg-white shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Progresso da Obra</h3>
              <p className="text-sm font-medium text-gray-500">
                {calcularProgresso(fases)}% concluído
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-red-600 h-2.5 rounded-full transition-all"
                style={{ width: `${calcularProgresso(fases)}%` }}
              />
            </div>

            <div className="space-y-6">
              {fases.map((fase, idx) => (
                <div
                  key={fase.id ?? `nova-${idx}`}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
                >
                  <div className="md:col-span-1">
                    <h4 className="font-semibold">{fase.nome}</h4>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <Campo
                      label="Peso"
                      tipo="number"
                      valor={fase.peso}
                      onChange={(v) =>
                        handleChangeFase(fase.id ?? idx, 'peso', v)
                      }
                    />
                    <Campo
                      label="Concluído (%)"
                      tipo="number"
                      valor={fase.percentual_concluido}
                      onChange={(v) =>
                        handleChangeFase(
                          fase.id ?? idx,
                          'percentual_concluido',
                          v,
                        )
                      }
                    />
                    <Campo
                      label="Data Início"
                      tipo="date"
                      valor={formatDateInput(fase.data_inicio)}
                      onChange={(v) =>
                        handleChangeFase(fase.id ?? idx, 'data_inicio', v)
                      }
                    />
                    <Campo
                      label="Fim Previsto"
                      tipo="date"
                      valor={formatDateInput(
                        fase.data_fim_prevista ?? fase.data_fim_previsto,
                      )}
                      onChange={(v) =>
                        handleChangeFase(fase.id ?? idx, 'data_fim_previsto', v)
                      }
                    />
                    <Campo
                      label="Fim Real"
                      tipo="date"
                      valor={formatDateInput(fase.data_fim_real)}
                      onChange={(v) =>
                        handleChangeFase(fase.id ?? idx, 'data_fim_real', v)
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSalvarAlteracoes}
                  disabled={saving}
                  className={`inline-flex items-center justify-center rounded-md bg-red-600 text-white shadow hover:bg-red-500 h-9 px-4 py-2 text-lg font-medium ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>

          {/* Estoque */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Estoque da Obra</h2>
            <div className="flex gap-2">
              <button
                onClick={handleRegistrarMaterial}
                className="inline-flex items-center justify-center bg-red-600 text-white shadow hover:bg-red-500 h-9 px-4 py-2 gap-2 text-sm font-medium rounded-md"
              >
                <span className="material-symbols-outlined text-lg">
                  {' '}
                  Registrar Material
                </span>
              </button>
            </div>
          </div>

          <TabelaEstoque estoque={estoque} />
        </div>
      </main>
    </>
  );
}

/* ---------- Helpers / componentes pequenos ---------- */

function InfoBox({ label, valor, tipo, classe }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${classe || ''}`}>
        {tipo === 'data'
          ? valor
            ? new Date(valor).toLocaleDateString('pt-BR')
            : '-'
          : valor || '—'}
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

function TabelaEstoque({ estoque }) {
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
            {estoque.length > 0 ? (
              estoque.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">{item.produtos?.nome}</td>
                  <td className="px-4 py-2 border">
                    {item.produtos?.unidade_medida}
                  </td>
                  <td className="px-4 py-2 border">{item.quantidade}</td>
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

function calcularProgresso(fases) {
  if (!fases || fases.length === 0) return 0;
  const somaPesos =
    fases.reduce((acc, f) => acc + (Number(f.peso) || 0), 0) || 1;
  const total = fases.reduce(
    (acc, f) =>
      acc + (Number(f.percentual_concluido) || 0) * (Number(f.peso) || 0),
    0,
  );
  return Math.round(total / somaPesos);
}

function formatDateInput(value) {
  if (!value) return '';
  // aceita strings ISO ou datetimes; transforma em yyyy-mm-dd
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
}
