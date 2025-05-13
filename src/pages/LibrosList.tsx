import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import type { Libro } from '../types';
import { librosService } from '../service/api';

const LibrosList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: libros, isLoading, error } = useQuery<Libro[], Error>(
    'libros',
    librosService.getAll
  );

  const { data: searchResults } = useQuery<Libro[], Error>(
    ['libros-search', searchQuery],
    () => librosService.search(searchQuery),
    {
      enabled: searchQuery.length > 0,
    }
  );

  const deleteLibroMutation = useMutation<void, Error, number>(
    (id: number) => librosService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('libros');
      },
    }
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      try {
        await deleteLibroMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error al eliminar libro:', error);
      }
    }
  };

  const displayLibros = searchQuery ? searchResults : libros;

  if (isLoading) return <div className="text-center">Cargando libros...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Libros</h1>
        <Link
          to="/libros/nuevo"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Nuevo Libro
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar libros..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayLibros?.map((libro: Libro) => (
          <div key={libro.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{libro.titulo}</h3>
            <p className="text-gray-600 mb-2">
              Autor: {libro.autor?.nombre} {libro.autor?.apellido}
            </p>
            <p className="text-gray-600 mb-2">ISBN: {libro.isbn}</p>
            <p className="text-gray-600 mb-2">Precio: ${libro.precio}</p>
            <p className="text-gray-600 mb-4">Stock: {libro.stock}</p>
            <div className="flex space-x-2">
              <Link
                to={`/libros/${libro.id}/editar`}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(libro.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                disabled={deleteLibroMutation.isLoading}
              >
                {deleteLibroMutation.isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayLibros?.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No se encontraron libros.
        </div>
      )}
    </div>
  );
};

export default LibrosList;