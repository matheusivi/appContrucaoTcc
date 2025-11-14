'use client';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.replace('/login');
  };

  const linkClass = (path) =>
    pathname.startsWith(path)
      ? 'text-gray-900 font-medium border-b-2 border-red-600'
      : 'text-gray-500 hover:text-gray-900 font-medium';

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-3">
      <h2
        onClick={() => router.push('/obras')}
        className="text-red-600 text-xl font-bold cursor-pointer"
      >
        StockPilot
      </h2>

      <nav className="flex items-center gap-8">
        <button onClick={() => router.push('/obras')} className={linkClass('/obras')}>
          Obras
        </button>

        {/* ⭐ Ajustado: Produtos → /produtos */}
        <button onClick={() => router.push('/produtos')} className={linkClass('/produtos')}>
          Produtos
        </button>

        {/* ⭐ Ajustado: Fornecedores → /fornecedores */}
        <button onClick={() => router.push('/fornecedores')} className={linkClass('/fornecedores')}>
          Fornecedores
        </button>

        <button
          onClick={handleLogout}
          className="ml-6 flex items-center gap-1 rounded-md bg-red-600 text-white px-4 py-1 text-sm font-semibold hover:bg-red-500 transition"
        >
          <span className="material-symbols-outlined text-sm">Sair</span>
        </button>
      </nav>
    </header>
  );
}
