// frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { autoresService, librosService } from '../service/api';

const Home: React.FC = () => {
  const { data: libros = [] } = useQuery({
    queryKey: ['libros'],
    queryFn: librosService.getAll,
  });

  const { data: autores = [] } = useQuery({
    queryKey: ['autores'],
    queryFn: autoresService.getAll,
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">
        Sistema de Gestión de Biblioteca
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Estadísticas</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-medium">Total de libros:</span> {libros.length}
            </p>
            <p className="text-lg">
              <span className="font-medium">Total de autores:</span> {autores.length}
            </p>
            <p className="text-lg">
              <span className="font-medium">Stock total:</span>{' '}
              {libros.reduce((total, libro) => total + libro.stock, 0)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-4">
            <Link
              to="/libros/nuevo"
              className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Agregar Nuevo Libro
            </Link>
            <Link
              to="/autores/nuevo"
              className="block w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Agregar Nuevo Autor
            </Link>
            <Link
              to="/libros"
              className="block w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Ver Todos los Libros
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Libros Recientes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {libros.slice(0, 3).map((libro) => (
            <div key={libro.id} className="border p-4 rounded">
              <h3 className="font-semibold">{libro.titulo}</h3>
              <p className="text-gray-600 text-sm">
                {libro.autor?.nombre} {libro.autor?.apellido}
              </p>
              <p className="text-gray-600 text-sm">Precio: ${libro.precio}</p>
            </div>
          ))}
        </div>
        {libros.length > 3 && (
          <div className="mt-4 text-center">
            <Link
              to="/libros"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Ver todos los libros →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;