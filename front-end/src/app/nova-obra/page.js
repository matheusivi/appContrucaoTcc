"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaObra() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    data_inicio: "",
    foto: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("nome", formData.nome);
    data.append("endereco", formData.endereco);
    data.append("data_inicio", formData.data_inicio);
    if (formData.foto) {
      data.append("foto", formData.foto);
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token ? "Presente" : "Ausente");
   
    console.log("Enviando dados:", {
      nome: formData.nome,
      endereco: formData.endereco,
      data_inicio: formData.data_inicio,
      foto: formData.foto ? "Arquivo selecionado" : "Sem foto",
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/obras`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token JWT
        },
      });

      console.log("Status da resposta:", res.status);

      let responseData = null;
      try {
        responseData = await res.json(); // tenta interpretar como JSON
      } catch (err) {
        console.warn("Resposta não é JSON válido, retornando texto bruto.");
        responseData = null;
      }

      if (res.ok) {
        router.push("/obras");
      } else {
        alert(
          `Erro ao salvar obra: ${
            responseData?.errors?.[0]?.msg ||
            responseData?.error ||
            "Erro desconhecido"
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro de conexão ao salvar obra");
    }
  }

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-lg bg-white p-8 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <h1 className="text-gray-900 text-3xl font-bold mb-2">
            Adicionar Nova Obra
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Preencha os dados abaixo para cadastrar uma nova obra.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Nome */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="nome"
              >
                Nome da Obra
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Ex: Construção Residencial Vila Matilde"
                value={formData.nome}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-red-600 focus:ring-red-600 sm:text-sm h-12 px-4"
                required
              />
            </div>

            {/* Endereço */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="endereco"
              >
                Endereço
              </label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                placeholder="Ex: Rua das Flores, 123, São Paulo - SP"
                value={formData.endereco}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-red-600 focus:ring-red-600 sm:text-sm h-12 px-4"
                required
              />
            </div>

            {/* Data de início */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="data_inicio"
              >
                Data de Início
              </label>
              <input
                id="data_inicio"
                name="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-red-600 focus:ring-red-600 sm:text-sm h-12 px-4"
                required
              />
            </div>

            {/* Foto opcional */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="foto"
              >
                Foto da Obra (opcional)
              </label>
              <input
                id="foto"
                name="foto"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-600 
                  file:mr-4 file:py-2 file:px-4 file:rounded-md 
                  file:border-0 file:text-sm file:font-semibold 
                  file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
              />
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/obras")}
                className="h-12 px-6 rounded-md bg-gray-200 text-gray-800 font-semibold 
                  hover:bg-gray-300 transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="h-12 px-6 rounded-md bg-red-600 text-white font-semibold 
                  hover:bg-red-700 transition-colors"
              >
                Salvar Obra
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
