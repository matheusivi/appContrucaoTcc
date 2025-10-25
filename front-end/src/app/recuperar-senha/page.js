"use client";
import React from "react";

export default function RecuperarSenha() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 font-['Be_Vietnam_Pro',sans-serif]">
      <div className="w-full max-w-md">
        {/* Logo + Título */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <svg
              className="text-[var(--primary-color)] h-8 w-8"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fill="currentColor"
                fillRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">StockMaster</h1>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Recuperar Senha</h2>
            <p className="mt-2 text-gray-600">
              Digite o e-mail associado à sua conta e enviaremos um link para
              redefinir sua senha.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seu.email@exemplo.com"
                className="mt-1 block w-full rounded-md border border-black-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-[red] focus:outline-none focus:ring-[red] sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Enviar Link de Recuperação
              </button>
            </div>
          </form>

          {/* Voltar ao login */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm font-medium text-[var(--primary-color)] hover:text-red-700"
            >
              Voltar ao Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
