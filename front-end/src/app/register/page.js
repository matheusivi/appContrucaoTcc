"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cargo: "",
    nivel_acesso: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    console.log('URL de API:', process.env.NEXT_PUBLIC_API_URL);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          cargo: formData.cargo || "usuário", // valor default
          nivel_acesso: formData.nivel_acesso || "alto", // valor default
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar usuário.");
      }

      alert("Conta criada com sucesso!");
      router.push("/login"); // redireciona após sucesso
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-red-600">
          StockMaster
        </h1>
        <h2 className="text-xl font-semibold text-center mb-2">Crie sua conta</h2>
        <p className="text-gray-500 text-center mb-4">
          Preencha os campos abaixo para começar.
        </p>

        {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Já tem uma conta?{" "}
          <a href="/login" className="text-red-600 font-semibold">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
