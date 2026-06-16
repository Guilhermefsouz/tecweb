import { createContext, useContext, useReducer } from 'react';

const ProdutoContext = createContext(null);

const initialState = {
  produtos: [],
  carregando: false,
  erro: null,
};

function produtoReducer(state, action) {
  switch (action.type) {
    case 'ADICIONAR_PRODUTO':
      return {
        ...state,
        produtos: [
          { ...action.payload, id: Date.now(), dataCadastro: new Date().toLocaleDateString('pt-BR') },
          ...state.produtos,
        ],
      };
    case 'REMOVER_PRODUTO':
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ProdutoProvider({ children }) {
  const [state, dispatch] = useReducer(produtoReducer, initialState);

  function adicionarProduto(produto) {
    dispatch({ type: 'ADICIONAR_PRODUTO', payload: produto });
  }

  function removerProduto(id) {
    dispatch({ type: 'REMOVER_PRODUTO', payload: id });
  }

  return (
    <ProdutoContext.Provider value={{ ...state, adicionarProduto, removerProduto }}>
      {children}
    </ProdutoContext.Provider>
  );
}

export function useProdutos() {
  const ctx = useContext(ProdutoContext);
  if (!ctx) throw new Error('useProdutos deve ser usado dentro de ProdutoProvider');
  return ctx;
}