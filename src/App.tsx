// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layaout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/libros" element={<LibrosList />} />
            <Route path="/libros/nuevo" element={<LibroForm />} />
            <Route path="/libros/:id/editar" element={<LibroForm />} />
            <Route path="/autores" element={<AutoresList />} />
            <Route path="/autores/nuevo" element={<AutorForm />} />
            <Route path="/autores/:id/editar" element={<AutorForm />} /> */}
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;