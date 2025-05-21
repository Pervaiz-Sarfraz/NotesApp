import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ProductsDashboard from './pages/Home';
import CreateProduct from './pages/CreateNotes';
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import { useState, useEffect } from 'react';
import { ToastContainer } from "react-toastify";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const authPages = ['/login', '/register'];
    const isAuthPage = authPages.includes(location.pathname);

    if (token) {
      setIsAuthenticated(true);
      if (isAuthPage) {
        navigate('/');
      }
    } else {
      setIsAuthenticated(false);
      if (!isAuthPage) {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
      <div className={isAuthenticated ? "flex" : ""}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <ProductsDashboard /> : <LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/create" element={isAuthenticated ? <CreateProduct /> : <LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/edit-note/:id" element={isAuthenticated ? <CreateProduct /> : <LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterForm setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
