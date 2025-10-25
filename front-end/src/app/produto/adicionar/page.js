"use client";

import React from "react";

export default function AdicionarProdutoPage() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-gray-50"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white px-10 py-3">
          <div className="flex items-center gap-4 text-gray-900">
            <div className="size-8 text-[#ea2a33]">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em]">
              StockPilot
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-4 items-center">
            <button className="flex items-center justify-center rounded-full size-10 hover:bg-gray-100 text-gray-600">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex justify-center py-10">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Adicionar Produto
                </h1>
                <p className="text-gray-500 mt-1">
                  Preencha os detalhes do novo produto.
                </p>
              </div>

              {/* Form */}
              <form className="p-6 space-y-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="product-name"
                  >
                    Nome do Produto
                  </label>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea2a33] focus:border-transparent border-2 border-solid border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-base"
                    id="product-name"
                    placeholder="Ex: Cimento"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="unit-of-measure"
                  >
                    Unidade de Medida
                  </label>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea2a33] focus:border-transparent border-2 border-solid border-gray-300 bg-white h-12 placeholder:text-gray-400 p-3 text-base"
                    id="unit-of-measure"
                    placeholder="Ex: kg, unidades, metros"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="description"
                  >
                    Descrição (Opcional)
                  </label>
                  <textarea
                    className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea2a33] focus:border-transparent border-2 border-solid border-gray-300 bg-white min-h-32 placeholder:text-gray-400 p-3 text-base"
                    id="description"
                    placeholder="Detalhes adicionais sobre o produto"
                  ></textarea>
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-4 p-6 bg-gray-50/50 border-t border-gray-200 rounded-b-lg">
                <button
                  type="button"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <span className="truncate">Cancelar</span>
                </button>
                <button
                  type="submit"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-[#ea2a33] text-white text-sm font-bold shadow-sm hover:bg-red-700 transition-colors"
                >
                  <span className="truncate">Salvar</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}