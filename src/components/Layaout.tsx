import { Link, useLocation } from "react-router-dom";


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
  
    const isActive = (path: string) => location.pathname === path;
  
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold">
                  Biblioteca API
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Inicio
                </Link>
                <Link
                  to="/libros"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/libros') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Libros
                </Link>
                <Link
                  to="/autores"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/autores') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Autores
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {children}
          </div>
        </main>
      </div>
    );
  };
  
  export default Layout;