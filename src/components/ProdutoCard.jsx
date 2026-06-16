import { useProdutos } from '../context/ProdutoContext';
import '../styles/produtocard.css';

const CATEGORIA_COR = {
  Alimentos: 'verde',
  Bebidas: 'azul',
  Limpeza: 'roxo',
  Higiene: 'coral',
  Frios: 'amarelo',
};

export default function ProdutoCard({ produto }) {
  const { removerProduto } = useProdutos();
  const cor = CATEGORIA_COR[produto.categoria] || 'cinza';

  return (
    <div className={`produto-card produto-card--${cor}`}>
      <div className="produto-card__header">
        <span className={`produto-tag produto-tag--${cor}`}>{produto.categoria}</span>
        <button
          className="produto-card__remover"
          onClick={() => removerProduto(produto.id)}
          aria-label={`Remover ${produto.nome}`}
          title="Remover produto"
        >
          ✕
        </button>
      </div>
      <h3 className="produto-card__nome">{produto.nome}</h3>
      <p className="produto-card__descricao">{produto.descricao || 'Sem descrição.'}</p>
      <div className="produto-card__footer">
        <span className="produto-card__preco">
          R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
        </span>
        <span className="produto-card__data">{produto.dataCadastro}</span>
      </div>
    </div>
  );
}