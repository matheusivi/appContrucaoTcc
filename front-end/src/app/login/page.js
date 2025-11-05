"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha: password }),

    });

    const data = await res.json(); // ✅ chama apenas uma vez

    if (!res.ok) {
      setError(data.error || "Erro ao logar");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    window.location.href = "/obras";
  } catch (err) {
    console.error("Erro na requisição:", err);
    setError("Erro de conexão com o servidor");
  }
};


  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + título */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 text-gray-900 mb-6">
              <div className="size-8 text-[#ea2a33]">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                BuildTrack
              </h1>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Acesse sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{" "}
              <Link
                href="/register"
                className="font-medium text-[#ea2a33] hover:text-[#c0262d]"
              >
                crie uma conta nova
              </Link>
            </p>
          </div>

          {/* Erro */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Formulário */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="form-input block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm placeholder-gray-400 focus:border-[#ea2a33] focus:outline-none focus:ring-[#ea2a33] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Sua senha"
                  className="form-input block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm placeholder-gray-400 focus:border-[#ea2a33] focus:outline-none focus:ring-[#ea2a33] sm:text-sm"
                />
              </div>
            </div>

            {/* Link de recuperação */}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  href="/recuperar-senha"
                  className="font-medium text-[#ea2a33] hover:text-[#c0262d]"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            {/* Botão */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-[#ea2a33] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#c0262d] focus:outline-none focus:ring-2 focus:ring-[#ea2a33] focus:ring-offset-2"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
