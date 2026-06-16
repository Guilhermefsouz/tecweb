import { Link } from 'react-router-dom';
import { useProdutos } from '../context/ProdutoContext';
import '../styles/inicio.css';

export default function Inicio() {
  const { produtos } = useProdutos();

  const total = produtos.reduce((acc, p) => acc + Number(p.preco), 0);
  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  return (
    <div className="inicio">
      <section className="inicio__hero">
        <div className="inicio__hero-texto">
          <p className="inicio__eyebrow">Sistema de Gerenciamento</p>
          <h1 className="inicio__titulo">SuperMercado<br /><em>BigBom</em></h1>
          <p className="inicio__subtitulo">
            Cadastre produtos, organize categorias e acompanhe seu estoque
            de forma simples e eficiente.
          </p>
          <div className="inicio__acoes">
            <Link to="/cadastro" className="btn btn--primario">Cadastrar produto</Link>
            <Link to="/listagem" className="btn btn--secundario">Ver listagem</Link>
          </div>
        </div>
        <div className="inicio__hero-visual">
          <span className="inicio__emoji-bg">🛒</span>
        </div>
      </section>

      <section className="inicio__stats">
        <div className="stat-card">
          <span className="stat-card__numero">{produtos.length}</span>
          <span className="stat-card__label">Produtos cadastrados</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__numero">{categorias.length}</span>
          <span className="stat-card__label">Categorias ativas</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__numero">
            R$ {total.toFixed(2).replace('.', ',')}
          </span>
          <span className="stat-card__label">Valor total em estoque</span>
        </div>
      </section>

      <section className="inicio__features">
        <div className="feature-card">
          <span className="feature-card__icone">📝</span>
          <h3>Cadastro rápido</h3>
          <p>Adicione produtos com nome, preço, categoria e descrição com validação em tempo real.</p>
        </div>
        <div className="feature-card">
          <span className="feature-card__icone">🔍</span>
          <h3>Busca e filtros</h3>
          <p>Encontre qualquer produto pela listagem com busca por nome e filtro por categoria.</p>
        </div>
        <div className="feature-card">
          <span className="feature-card__icone">🌐</span>
          <h3>Dados da API</h3>
          <p>Veja sugestões de produtos reais consumidos da Open Food Facts API por categoria.</p>
        </div>
      </section>
    </div>
  );
}