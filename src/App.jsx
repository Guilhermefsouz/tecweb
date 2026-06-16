import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProdutoProvider } from './context/ProdutoContext';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Cadastro from './pages/Cadastro';
import Listagem from './pages/Listagem';
import './styles/global.css';

export default function App() {
  return (
    <ProdutoProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/listagem" element={<Listagem />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2025 SuperMercado BigBom — Gerenciamento de Produtos</p>
        </footer>
      </Router>
    </ProdutoProvider>
  );
}