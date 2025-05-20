import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { autoresService } from '../service/api';
import type { Autor } from '../types';

const AutoresList: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: autores = [], isLoading, error } = useQuery<Autor[], Error>({
        queryKey: ['autores'],
        queryFn: autoresService.getAll,
    });

    const deleteAutorMutation = useMutation<void, Error, number>({
        mutationFn: (id: number) => autoresService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autores'] });
        },
        onError: (error) => {
            console.error('Error al eliminar autor:', error);
        },
    });

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este autor?')) {
            try {
                await deleteAutorMutation.mutateAsync(id);
            } catch (error) {
                console.error('Error al eliminar autor:', error);
            }
        }
    };

    if (isLoading) return <div className="text-center">Cargando autores...</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Autores</h1>
                <Link
                    to="/autores/nuevo"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nuevo Autor
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {autores.map((autor: Autor) => (
                    <div key={autor.id} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">
                            {autor.nombre} {autor.apellido}
                        </h3>
                        {autor.nacionalidad && (
                            <p className="text-gray-600 mb-2">Nacionalidad: {autor.nacionalidad}</p>
                        )}
                        {autor.fechaNacimiento && (
                            <p className="text-gray-600 mb-2">
                                Fecha de nacimiento: {new Date(autor.fechaNacimiento).toLocaleDateString()}
                            </p>
                        )}
                        {autor.biografia && (
                            <p className="text-gray-600 mb-4 text-sm line-clamp-3">{autor.biografia}</p>
                        )}
                        <div className="flex space-x-2">
                            <Link
                                to={`/autores/${autor.id}/editar`}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                                Editar
                            </Link>
                            <button
                                onClick={() => handleDelete(autor.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                disabled={deleteAutorMutation.isPending}
                            >
                                {deleteAutorMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {autores.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No se encontraron autores.
                </div>
            )}
        </div>
    );
};

export default AutoresList;