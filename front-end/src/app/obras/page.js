"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ObrasPage() {
  const [obras, setObras] = useState([]);
  const router = useRouter();

  function adicionarObra() {
    setObras((prev) => [
      ...prev,
      {
        nome: `Obra Exemplo ${prev.length + 1}`,
        descricao: "Descrição da obra...",
        imagem: "", // pode colocar URL real
      },
    ]);
  }

  const handleAdicionarNovaObra = () => {
    router.push("/nova-obra");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-3">
        <div className="flex items-center gap-4 text-gray-800">
          <div className="size-8 text-[var(--primary-color)]">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-red-600 text-xl font-bold">InovaCivi</h2>
        </div>
        <nav className="flex flex-1 justify-center gap-8">
          {/* Link ativo */}
          <a className="relative text-gray-500 hover:text-gray-900 font-medium pb-1 group cursor-pointer">
            Obras
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </a>

          {/* Links inativos */}
          <a className="relative text-gray-500 hover:text-gray-900 font-medium pb-1 group cursor-pointer">
            Estoque
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </a>

          <a className="relative text-gray-500 hover:text-gray-900 font-medium pb-1 group cursor-pointer">
            Relatórios
            <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Título e botão */}
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

          {/* Container */}
          {obras.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-24 text-center">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl text-gray-400">
                  InovaCivi
                </span>
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
              {obras.map((obra, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={
                      obra.imagem ||
                      "https://via.placeholder.com/400x200?text=Sem+Foto"
                    }
                    alt={obra.nome}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {obra.nome}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {obra.descricao || "Sem descrição"}
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