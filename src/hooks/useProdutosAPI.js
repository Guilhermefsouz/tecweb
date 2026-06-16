import { useState, useEffect } from 'react';

const CATEGORIAS_API = {
  Alimentos: 'cereals',
  Bebidas: 'beverages',
  Limpeza: 'cleaning-products',
  Higiene: 'beauty',
  Frios: 'dairies',
};

export function useProdutosAPI(categoria) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!categoria) {
      setDados([]);
      return;
    }

    const categoriaAPI = CATEGORIAS_API[categoria] || 'food';
    const controller = new AbortController();

    async function buscar() {
      setCarregando(true);
      setErro(null);
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${categoriaAPI}&page_size=6&json=1&fields=product_name,brands,image_small_url`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('Falha ao buscar dados da API');
        const json = await res.json();
        const produtos = (json.products || [])
          .filter((p) => p.product_name && p.brands)
          .slice(0, 6)
          .map((p) => ({
            nome: p.product_name,
            marca: p.brands?.split(',')[0]?.trim() || '—',
            imagem: p.image_small_url || null,
          }));
        setDados(produtos);
      } catch (e) {
        if (e.name !== 'AbortError') setErro('Não foi possível carregar sugestões da API.');
      } finally {
        setCarregando(false);
      }
    }

    buscar();
    return () => controller.abort();
  }, [categoria]);

  return { dados, carregando, erro };
}