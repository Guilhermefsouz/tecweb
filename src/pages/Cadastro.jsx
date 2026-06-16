import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutos } from '../context/ProdutoContext';
import { useProdutosAPI } from '../hooks/useProdutosAPI';
import APICard from '../components/APICard';
import '../styles/cadastro.css';

const CATEGORIAS = ['Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Frios'];

const estadoInicial = { nome: '', preco: '', categoria: '', descricao: '' };

function validar(campos) {
  const erros = {};
  if (!campos.nome.trim()) erros.nome = 'Nome é obrigatório.';
  else if (campos.nome.trim().length < 3) erros.nome = 'Nome deve ter ao menos 3 caracteres.';
  if (!campos.preco) erros.preco = 'Preço é obrigatório.';
  else if (Number(campos.preco) <= 0) erros.preco = 'Preço deve ser maior que zero.';
  if (!campos.categoria) erros.categoria = 'Selecione uma categoria.';
  if (campos.descricao && campos.descricao.length > 200)
    erros.descricao = 'Descrição deve ter no máximo 200 caracteres.';
  return erros;
}

export default function Cadastro() {
  const [campos, setCampos] = useState(estadoInicial);
  const [erros, setErros] = useState({});
  const [tocados, setTocados] = useState({});
  const [sucesso, setSucesso] = useState(false);

  const { adicionarProduto } = useProdutos();
  const navigate = useNavigate();
  const { dados: sugestoes, carregando: carregandoAPI, erro: erroAPI } = useProdutosAPI(campos.categoria);

  function handleChange(e) {
    const { name, value } = e.target;
    const novosCampos = { ...campos, [name]: value };
    setCampos(novosCampos);
    if (tocados[name]) setErros(validar(novosCampos));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
    setErros(validar(campos));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const todosTocados = Object.fromEntries(Object.keys(campos).map((k) => [k, true]));
    setTocados(todosTocados);
    const errosAtual = validar(campos);
    setErros(errosAtual);
    if (Object.keys(errosAtual).length === 0) {
      adicionarProduto(campos);
      setSucesso(true);
      setCampos(estadoInicial);
      setTocados({});
      setErros({});
      setTimeout(() => { setSucesso(false); navigate('/listagem'); }, 1500);
    }
  }

  function handleLimpar() {
    setCampos(estadoInicial);
    setErros({});
    setTocados({});
    setSucesso(false);
  }

  const errosAtivos = validar(campos);
  const formularioValido = Object.keys(errosAtivos).length === 0 && campos.nome && campos.preco && campos.categoria;

  return (
    <div className="cadastro">
      <div className="cadastro__container">
        <div className="cadastro__form-area">
          <h1 className="cadastro__titulo">Cadastrar produto</h1>
          <p className="cadastro__subtitulo">Preencha os campos abaixo para adicionar um novo produto ao estoque.</p>

          {sucesso && (
            <div className="alerta alerta--sucesso" role="alert">
              ✅ Produto cadastrado! Redirecionando para a listagem…
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="form">
            <div className={`form__grupo ${erros.nome && tocados.nome ? 'form__grupo--erro' : ''} ${!erros.nome && tocados.nome ? 'form__grupo--ok' : ''}`}>
              <label htmlFor="nome" className="form__label">Nome do produto *</label>
              <input id="nome" name="nome" type="text" className="form__input"
                placeholder="Ex.: Arroz Tipo 1" value={campos.nome}
                onChange={handleChange} onBlur={handleBlur} aria-invalid={!!erros.nome} />
              {erros.nome && tocados.nome && <span className="form__erro" role="alert">{erros.nome}</span>}
            </div>

            <div className="form__linha">
              <div className={`form__grupo ${erros.preco && tocados.preco ? 'form__grupo--erro' : ''} ${!erros.preco && tocados.preco ? 'form__grupo--ok' : ''}`}>
                <label htmlFor="preco" className="form__label">Preço (R$) *</label>
                <input id="preco" name="preco" type="number" className="form__input"
                  placeholder="0,00" min="0" step="0.01" value={campos.preco}
                  onChange={handleChange} onBlur={handleBlur} aria-invalid={!!erros.preco} />
                {erros.preco && tocados.preco && <span className="form__erro" role="alert">{erros.preco}</span>}
              </div>

              <div className={`form__grupo ${erros.categoria && tocados.categoria ? 'form__grupo--erro' : ''} ${!erros.categoria && tocados.categoria ? 'form__grupo--ok' : ''}`}>
                <label htmlFor="categoria" className="form__label">Categoria *</label>
                <select id="categoria" name="categoria" className="form__select"
                  value={campos.categoria} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!erros.categoria}>
                  <option value="">Selecione…</option>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {erros.categoria && tocados.categoria && <span className="form__erro" role="alert">{erros.categoria}</span>}
              </div>
            </div>

            <div className={`form__grupo ${erros.descricao && tocados.descricao ? 'form__grupo--erro' : ''}`}>
              <label htmlFor="descricao" className="form__label">
                Descrição
                <span className="form__contador">{campos.descricao.length}/200</span>
              </label>
              <textarea id="descricao" name="descricao" className="form__textarea"
                placeholder="Descreva o produto (opcional)" rows={3} maxLength={200}
                value={campos.descricao} onChange={handleChange} onBlur={handleBlur} />
              {erros.descricao && tocados.descricao && <span className="form__erro" role="alert">{erros.descricao}</span>}
            </div>

            <div className="form__acoes">
              <button type="submit" className="btn btn--primario" disabled={!formularioValido}>
                Cadastrar produto
              </button>
              <button type="button" className="btn btn--ghost" onClick={handleLimpar}>
                Limpar
              </button>
            </div>
          </form>
        </div>

        <div className="cadastro__api-area">
          <div className="api-sugestoes">
            <h2 className="api-sugestoes__titulo">
              {campos.categoria ? `Produtos similares — ${campos.categoria}` : 'Selecione uma categoria'}
            </h2>
            <p className="api-sugestoes__subtitulo">
              {campos.categoria ? 'Dados da Open Food Facts API' : 'Sugestões aparecerão aqui ao escolher uma categoria.'}
            </p>
            {carregandoAPI && (
              <div className="api-sugestoes__loading">
                <span className="spinner" aria-hidden="true" /> Buscando sugestões…
              </div>
            )}
            {erroAPI && !carregandoAPI && <p className="api-sugestoes__erro">{erroAPI}</p>}
            {!carregandoAPI && !erroAPI && sugestoes.length > 0 && (
              <div className="api-sugestoes__grid">
                {sugestoes.map((p, i) => <APICard key={i} produto={p} />)}
              </div>
            )}
            {!carregandoAPI && !erroAPI && campos.categoria && sugestoes.length === 0 && (
              <p className="api-sugestoes__vazio">Nenhuma sugestão encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}