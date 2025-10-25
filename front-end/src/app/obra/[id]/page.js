'use client';

export default function ObraDetalhe() {
  const fases = [
    {
      nome: "Fase 1: Fundação",
      peso: 1.0,
      percentual: 100,
      inicio: "2024-03-15",
      fimPrevisto: "2024-04-15",
      fimReal: "2024-04-10",
    },
    {
      nome: "Fase 2: Estrutura",
      peso: 1.0,
      percentual: 80,
      inicio: "2024-04-16",
      fimPrevisto: "2024-05-30",
      fimReal: "",
    },
    {
      nome: "Fase 3: Acabamento",
      peso: 1.0,
      percentual: 0,
      inicio: "",
      fimPrevisto: "2024-07-15",
      fimReal: "",
    },
  ];

  const estoque = [
    { material: "Cimento", quantidade: 50, unidade: "Sacos" },
    { material: "Areia", quantidade: 10, unidade: "m³" },
    { material: "Tijolos", quantidade: 1000, unidade: "Unidades" },
    { material: "Ferro", quantidade: 200, unidade: "Kg" },
    { material: "Cal", quantidade: 30, unidade: "Sacos" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-3">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 text-red-600">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 4H34V9H14V4Z" fill="currentColor"/>
              <path d="M4 14H19V34H4V14Z" fill="currentColor"/>
              <path d="M29 14H44V34H29V14Z" fill="currentColor"/>
              <path d="M14 40H34V45H14V40Z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">StockMaster</h2>
        </div>

        <nav className="flex flex-1 justify-center gap-8">
          <a className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors" href="#">Obras</a>
          <a className="text-sm font-medium text-red-600" href="#">Estoque</a>
          <a className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors" href="#">Relatórios</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-40 py-10">
        <div className="mx-auto max-w-5xl">
          {/* Info da obra */}
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold">Residência dos Silvas</h1>
              <p className="text-gray-500">Rua das Acácias, 123, Bairro das Flores, Cidade Jardim - SP</p>
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-red-600 shadow-sm hover:bg-red-500 h-9 px-4 py-2 gap-2">
              <span className="material-symbols-outlined text-lg text-white">Editar Obra</span>
             
            </button>
          </div>

          {/* Dados gerais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Data de Início</p>
              <p className="text-lg font-semibold">15 de Março de 2024</p>
            </div>
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <p className="text-lg font-semibold text-green-600">Em Andamento</p>
            </div>
            <div className="rounded-lg border bg-white shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Responsável</p>
              <p className="text-lg font-semibold">Ana Silva</p>
            </div>
          </div>

          {/* Progresso das fases */}
          <div className="rounded-lg border bg-white shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Progresso da Obra</h3>
              <p className="text-sm font-medium text-gray-500">60% concluído</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
            </div>

            <div className="space-y-6">
              {fases.map((fase, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-1">
                    <h4 className="font-semibold">{fase.nome}</h4>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Peso</label>
                      <input type="number" step="0.1" value={fase.peso} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Concluído (%)</label>
                      <input type="number" value={fase.percentual} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data Início</label>
                      <input type="date" value={fase.inicio} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fim Previsto</label>
                      <input type="date" value={fase.fimPrevisto} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fim Real</label>
                      <input type="date" value={fase.fimReal} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-600 text-white shadow hover:bg-red-500 h-9 px-4 py-2">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>

          {/* Estoque */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Estoque da Obra</h2>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-600 text-white shadow hover:bg-red-500 h-9 px-4 py-2 gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Registrar Material
            </button>
          </div>

          <div className="rounded-lg border bg-white shadow-sm overflow-auto">
            <table className="w-full text-sm caption-bottom">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left font-medium text-gray-500 w-1/3">Material</th>
                  <th className="h-12 px-4 text-left font-medium text-gray-500 w-1/4">Quantidade</th>
                  <th className="h-12 px-4 text-left font-medium text-gray-500 w-1/4">Unidade</th>
                  <th className="h-12 px-4 text-right font-medium text-gray-500 w-[100px]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {estoque.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium">{item.material}</td>
                    <td className="p-4 text-gray-600">{item.quantidade}</td>
                    <td className="p-4 text-gray-600">{item.unidade}</td>
                    <td className="p-4 text-right">
                      <button className="text-red-600 hover:text-red-500 font-medium">Ver Detalhes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
