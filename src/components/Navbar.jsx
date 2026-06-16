import { NavLink } from 'react-router-dom';
import { useProdutos } from '../context/ProdutoContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { produtos } = useProdutos();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🛒</span>
        <span className="navbar-nome">BigBom</span>
      </div>
      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Início
        </NavLink>
        <NavLink to="/cadastro" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Cadastro
        </NavLink>
        <NavLink to="/listagem" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Listagem
          {produtos.length > 0 && (
            <span className="nav-badge">{produtos.length}</span>
          )}
        </NavLink>
      </nav>
    </header>
  );
}