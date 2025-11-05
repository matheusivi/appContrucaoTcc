"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ObrasPage() {
  const [obras, setObras] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function carregarObras() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setObras(data);
      } catch (err) {
        console.error("Erro ao carregar obras:", err);
      }
    }
    carregarObras();
  }, []);

  const handleAdicionarNovaObra = () => router.push("/nova-obra");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-3">
        <h2 className="text-red-600 text-xl font-bold">InovaCivi</h2>
        <nav className="flex gap-8">
          <span className="text-gray-900 font-medium border-b-2 border-red-600">Obras</span>
          <span className="text-gray-500 hover:text-gray-900 font-medium">Estoque</span>
          <span className="text-gray-500 hover:text-gray-900 font-medium">Relatórios</span>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-red-600 text-4xl font-bold">Minhas Obras</h1>
            <button
              onClick={handleAdicionarNovaObra}
              className="flex items-center gap-2 rounded-md h-10 px-5 bg-red-600 text-white font-semibold shadow-sm hover:bg-red-500"
            >
              <span className="material-symbols-outlined">add</span>
              Adicionar Nova Obra
            </button>
          </div>

          {/* Listagem de cards */}
          {obras.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-24 text-center">
              <div>
                <h2 className="mt-4 text-xl font-semibold text-gray-700">
                  Nenhuma obra cadastrada ainda.
                </h2>
                <p className="mt-2 text-gray-500">
                  Comece adicionando sua primeira obra para gerenciar o progresso e o estoque.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {obras.map((obra) => (
                <div key={obra.id} className="rounded-lg bg-white shadow hover:shadow-lg transition overflow-hidden">
                  <img
                    src={
                      obra.foto_url
                        ? `${process.env.NEXT_PUBLIC_API_URL}${obra.foto_url}`
                        : "https://via.placeholder.com/400x200?text=Sem+Foto"
                    }
                    alt={obra.nome}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{obra.nome}</h3>
                    <p className="text-gray-600 text-sm">{obra.endereco}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Início: {new Date(obra.data_inicio).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
