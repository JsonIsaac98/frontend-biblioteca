import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Router, Routes } from 'react-router-dom'

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/libros" element={<LibrosList />} />
            <Route path="/libros/nuevo" element={<LibroForm />} />
            <Route path="/libros/:id/editar" element={<LibroForm />} />
            <Route path="/autores" element={<AutoresList />} />
            <Route path="/autores/nuevo" element={<AutorForm />} />
            <Route path="/autores/:id/editar" element={<AutorForm />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App
