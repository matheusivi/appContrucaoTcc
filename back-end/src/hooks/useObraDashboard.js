import { useEffect, useState } from "react";
import axios from "axios";

export function useObraDashboard(obraId) {
  const [loading, setLoading] = useState(true);
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const [e, s, es, p, f] = await Promise.all([
          axios.get(`/entradas/obra/${obraId}`, { headers: { Authorization: token } }),
          axios.get(`/saidas/obra/${obraId}`, { headers: { Authorization: token } }),
          axios.get(`/estoque-por-obra/obra/${obraId}`, { headers: { Authorization: token } }),
          axios.get(`/produtos`, { headers: { Authorization: token } }),
          axios.get(`/fornecedores`, { headers: { Authorization: token } })
        ]);

        setEntradas(e.data);
        setSaidas(s.data);
        setEstoque(es.data);
        setProdutos(p.data);
        setFornecedores(f.data);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [obraId]);

  return { loading, entradas, saidas, estoque, produtos, fornecedores };
}
