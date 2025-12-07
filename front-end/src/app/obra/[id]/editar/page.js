"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarObra() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    data_inicio: "",
    foto: null,
  });

  // Carregar obra existente
  useEffect(() => {
    async function carregarObra() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/obras/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const obra = await res.json();

        setFormData({
          nome: obra.nome,
          endereco: obra.endereco,
          data_inicio: obra.data_inicio ? formatDate(obra.data_inicio) : "",
          foto: null
        });
      } catch (err) {
        console.error("Erro ao carregar obra:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarObra();
  }, [id]);

  function formatDate(value) {
    const d = new Date(value);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  }

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
    setSaving(true);

    const data = new FormData();
    data.append("nome", formData.nome);
    data.append("endereco", formData.endereco);
    data.append("data_inicio", formData.data_inicio);
    if (formData.foto) data.append("foto", formData.foto);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/obras/${id}`,
        {
          method: "PUT",
          body: data,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.ok) {
        router.push(`/obra/${id}`);
      } else {
        const erro = await res.json();
        alert(
          erro?.errors?.[0]?.msg ||
          erro?.error ||
          "Erro ao atualizar a obra."
        );
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro de conexão ao editar obra.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Carregando dados da obra...
      </p>
    );

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-lg bg-white p-8 rounded-lg shadow">
        <div className="flex flex-col items-center">
          <h1 className="text-gray-900 text-3xl font-bold mb-2">
            Editar Obra
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Atualize os dados da obra abaixo.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Obra
              </label>
              <input
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-red-600 focus:ring-red-600 sm:text-sm h-12 px-4"
                required
              />
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                name="endereco"
                type="text"
                value={formData.endereco}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-red-600 focus:ring-red-600 sm:text-sm h-12 px-4"
                required
              />
            </div>

            {/* Data de início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                name="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-red-600 focus:ring-red-600 sm:text-sm h-12 px-4"
                required
              />
            </div>

            {/* Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto da Obra (opcional)
              </label>
              <input
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
                onClick={() => router.push(`/obra/${id}`)}
                className="h-12 px-6 rounded-md bg-gray-200 text-gray-800 font-semibold 
                hover:bg-gray-300 transition-colors"
              >
                Voltar
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`h-12 px-6 rounded-md bg-red-600 text-white font-semibold 
                hover:bg-red-700 transition-colors ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
