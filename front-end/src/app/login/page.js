'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // ✅ Se já tiver token válido, redireciona direto para /obras
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          router.replace('/obras');
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao logar');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      router.push('/obras');
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Erro de conexão com o servidor');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden font-[Be_Vietnam_Pro,Noto_Sans,sans-serif]">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + título */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 text-gray-900 mb-6">
              <div className="size-8 text-[#ea2a33]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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
              Ou{' '}
              <Link href="/register" className="font-medium text-[#ea2a33] hover:text-[#c0262d]">
                crie uma conta nova
              </Link>
            </p>
          </div>

          {/* Erro */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Formulário */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-[#ea2a33] focus:ring-[#ea2a33] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Sua senha"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-[#ea2a33] focus:ring-[#ea2a33] sm:text-sm"
              />
            </div>

            {/* Link de recuperação */}
            <div className="flex items-center justify-end">
              <Link href="/recuperar-senha" className="text-sm font-medium text-[#ea2a33] hover:text-[#c0262d]">
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full rounded-md bg-[#ea2a33] py-2 px-4 text-sm font-medium text-white hover:bg-[#c0262d] focus:outline-none focus:ring-2 focus:ring-[#ea2a33] focus:ring-offset-2"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
