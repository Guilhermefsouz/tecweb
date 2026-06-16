import '../styles/apicard.css';

export default function APICard({ produto }) {
  return (
    <div className="api-card">
      {produto.imagem ? (
        <img src={produto.imagem} alt={produto.nome} className="api-card__img" />
      ) : (
        <div className="api-card__img-placeholder">📦</div>
      )}
      <div className="api-card__info">
        <p className="api-card__nome">{produto.nome}</p>
        <p className="api-card__marca">{produto.marca}</p>
      </div>
    </div>
  );
}