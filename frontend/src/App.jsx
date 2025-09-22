import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

// Componentes principales
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Cursos from "./pages/Cursos";
import Profile from "./pages/Profile";
import AdminCursos from "./pages/AdminCursos";

function App() {
  // Estado global del usuario (lee desde localStorage al iniciar)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // eliminar token
    localStorage.removeItem("user");  // eliminar datos de usuario
    setUser(null);                     // actualizar estado
  };

  return (
    <Router>
      <div className="app-container">
        {/* Navbar siempre visible */}
        <header className="navbar">
          <div className="brand">
            <Link to="/" className="brand-link">Portal Capacitaciones</Link>
          </div>

          <nav className="nav-links">
            {user && (
              <>
                <Link to="/cursos">Cursos</Link>
                <Link to="/profile">Perfil</Link>
                {/* Solo mostrar link de admin si el usuario es administrador */}
                {user.is_admin && <Link to="/admin">Admin</Link>}
              </>
            )}
          </nav>

          <div className="user-actions">
            {!user ? (
              <Link to="/login" className="login-link">Iniciar sesión</Link>
            ) : (
              <>
                <span className="user-greeting">Hola, <strong>{user.name}</strong></span>
                <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
              </>
            )}
          </div>
        </header>

        {/* Contenido principal */}
        <main className="content-main">
          <Routes>
            {/* Rutas de autenticación y redirección según estado */}
            <Route
              path="/login"
              element={!user ? <LoginForm onLogin={setUser} /> : <Navigate to="/cursos" />}
            />
            <Route
              path="/register"
              element={!user ? <RegisterForm onRegister={setUser} /> : <Navigate to="/cursos" />}
            />

            {/* Rutas protegidas solo para usuarios logueados */}
            <Route
              path="/cursos"
              element={user ? <Cursos /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />

            {/* Ruta por defecto según si el usuario está logueado */}
            <Route
              path="/"
              element={<Navigate to={user ? "/cursos" : "/login"} />}
            />

            {/* Ruta de admin, solo si el usuario es admin */}
            <Route
              path="/admin"
              element={user && user.is_admin ? <AdminCursos /> : <Navigate to="/cursos" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
