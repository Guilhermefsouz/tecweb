import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProdutos } from '../context/ProdutoContext';
import ProdutoCard from '../components/ProdutoCard';
import '../styles/listagem.css';

const CATEGORIAS = ['Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Frios'];

export default function Listagem() {
  const { produtos } = useProdutos();
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [ordenacao, setOrdenacao] = useState('recente');

  const produtosFiltrados = useMemo(() => {
    let lista = [...produtos];
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      lista = lista.filter((p) =>
        p.nome.toLowerCase().includes(termo) || p.descricao?.toLowerCase().includes(termo)
      );
    }
    if (filtroCategoria) lista = lista.filter((p) => p.categoria === filtroCategoria);
    if (ordenacao === 'nome-az') lista.sort((a, b) => a.nome.localeCompare(b.nome));
    if (ordenacao === 'nome-za') lista.sort((a, b) => b.nome.localeCompare(a.nome));
    if (ordenacao === 'preco-asc') lista.sort((a, b) => Number(a.preco) - Number(b.preco));
    if (ordenacao === 'preco-desc') lista.sort((a, b) => Number(b.preco) - Number(a.preco));
    return lista;
  }, [produtos, busca, filtroCategoria, ordenacao]);

  const totalFiltrado = produtosFiltrados.reduce((acc, p) => acc + Number(p.preco), 0);
  const contagemPorCategoria = useMemo(() =>
    CATEGORIAS.reduce((acc, cat) => { acc[cat] = produtos.filter((p) => p.categoria === cat).length; return acc; }, {}),
    [produtos]
  );

  function limparFiltros() { setBusca(''); setFiltroCategoria(''); setOrdenacao('recente'); }
  const filtrouAtivo = busca || filtroCategoria || ordenacao !== 'recente';

  return (
    <div className="listagem">
      <div className="listagem__cabecalho">
        <div>
          <h1 className="listagem__titulo">Produtos cadastrados</h1>
          <p className="listagem__contagem">
            {produtosFiltrados.length === produtos.length
              ? `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} no total`
              : `${produtosFiltrados.length} de ${produtos.length} produtos`}
            {produtosFiltrados.length > 0 && (
              <> · Total: <strong>R$ {totalFiltrado.toFixed(2).replace('.', ',')}</strong></>
            )}
          </p>
        </div>
        <Link to="/cadastro" className="btn btn--primario">+ Novo produto</Link>
      </div>

      <div className="listagem__filtros">
        <input type="search" className="filtro__busca"
          placeholder="🔍 Buscar por nome ou descrição…"
          value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar produto" />
        <select className="filtro__select" value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)} aria-label="Filtrar por categoria">
          <option value="">Todas as categorias</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c} ({contagemPorCategoria[c]})</option>)}
        </select>
        <select className="filtro__select" value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)} aria-label="Ordenar produtos">
          <option value="recente">Mais recente</option>
          <option value="nome-az">Nome (A→Z)</option>
          <option value="nome-za">Nome (Z→A)</option>
          <option value="preco-asc">Menor preço</option>
          <option value="preco-desc">Maior preço</option>
        </select>
        {filtrouAtivo && <button className="btn btn--ghost btn--sm" onClick={limparFiltros}>Limpar filtros</button>}
      </div>

      {produtos.length === 0 ? (
        <div className="listagem__vazio">
          <span className="listagem__vazio-icone">📦</span>
          <h2>Nenhum produto ainda</h2>
          <p>Comece cadastrando seu primeiro produto.</p>
          <Link to="/cadastro" className="btn btn--primario">Cadastrar produto</Link>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="listagem__vazio">
          <span className="listagem__vazio-icone">🔍</span>
          <h2>Nenhum resultado encontrado</h2>
          <p>Tente ajustar a busca ou os filtros.</p>
          <button className="btn btn--ghost" onClick={limparFiltros}>Limpar filtros</button>
        </div>
      ) : (
        <div className="listagem__grid">
          {produtosFiltrados.map((produto) => <ProdutoCard key={produto.id} produto={produto} />)}
        </div>
      )}
    </div>
  );
}