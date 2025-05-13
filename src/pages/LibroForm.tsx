import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { autoresService, librosService } from '../service/api';
import type { Autor, CreateLibroDto } from '../types';

const schema = yup.object().shape({
  titulo: yup.string().required('El título es obligatorio'),
  isbn: yup.string().required('El ISBN es obligatorio'),
  descripcion: yup.string().optional(),
  precio: yup.number().required('El precio es obligatorio').positive('El precio debe ser positivo'),
  fechaPublicacion: yup.string().optional(),
  stock: yup.number().min(0, 'El stock no puede ser negativo').optional(),
  activo: yup.boolean().optional(),
  autorId: yup.number().required('Debe seleccionar un autor').positive('Debe seleccionar un autor válido'),
});

type FormData = {
  titulo: string;
  isbn: string;
  descripcion?: string;
  precio: number;
  fechaPublicacion?: string;
  stock?: number;
  activo?: boolean;
  autorId: number;
};

const LibroForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const { data: autores = [] } = useQuery<Autor[], Error>({
    queryKey: ['autores'],
    queryFn: autoresService.getAll,
  });

  const { data: libro } = useQuery({
    queryKey: ['libro', id],
    queryFn: () => librosService.getById(Number(id)),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      stock: 0,
      activo: true,
    },
  });

  const createMutation = useMutation<any, Error, CreateLibroDto>({
    mutationFn: librosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      navigate('/libros');
    },
    onError: (error) => {
      console.error('Error al crear libro:', error);
    },
  });

  const updateMutation = useMutation<any, Error, { id: number; libro: Partial<CreateLibroDto> }>({
    mutationFn: ({ id, libro }) => librosService.update(id, libro),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      queryClient.invalidateQueries({ queryKey: ['libro', id] });
      navigate('/libros');
    },
    onError: (error) => {
      console.error('Error al actualizar libro:', error);
    },
  });

  const onSubmit = (data: FormData) => {
    // Transformar FormData a CreateLibroDto si es necesario
    const libroData: CreateLibroDto = {
      titulo: data.titulo,
      isbn: data.isbn,
      descripcion: data.descripcion,
      precio: data.precio,
      fechaPublicacion: data.fechaPublicacion,
      stock: data.stock,
      activo: data.activo,
      autorId: data.autorId,
    };

    if (isEditing) {
      updateMutation.mutate({ id: Number(id), libro: libroData });
    } else {
      createMutation.mutate(libroData);
    }
  };

  useEffect(() => {
    if (libro && isEditing) {
      setValue('titulo', libro.titulo);
      setValue('isbn', libro.isbn);
      setValue('descripcion', libro.descripcion || '');
      setValue('precio', libro.precio);
      setValue('fechaPublicacion', libro.fechaPublicacion || '');
      setValue('stock', libro.stock);
      setValue('activo', libro.activo);
      setValue('autorId', libro.autorId);
    }
  }, [libro, setValue, isEditing]);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Editar Libro' : 'Nuevo Libro'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            {...register('titulo')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.titulo && (
            <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
            ISBN *
          </label>
          <input
            type="text"
            {...register('isbn')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.isbn && (
            <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register('descripcion')}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="autorId" className="block text-sm font-medium text-gray-700">
            Autor *
          </label>
          <select
            {...register('autorId', { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un autor</option>
            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>
                {autor.nombre} {autor.apellido}
              </option>
            ))}
          </select>
          {errors.autorId && (
            <p className="mt-1 text-sm text-red-600">{errors.autorId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
              Precio *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('precio', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.precio && (
              <p className="mt-1 text-sm text-red-600">{errors.precio.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              {...register('stock', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="fechaPublicacion" className="block text-sm font-medium text-gray-700">
            Fecha de Publicación
          </label>
          <input
            type="date"
            {...register('fechaPublicacion')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('activo')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
            Activo
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/libros')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading
              ? 'Guardando...'
              : isEditing
              ? 'Actualizar'
              : 'Crear'}
          </button>
        </div>
      </form>

      {/* Mostrar errores de mutations */}
      {createMutation.error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error al crear libro: {createMutation.error.message}
        </div>
      )}
      {updateMutation.error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error al actualizar libro: {updateMutation.error.message}
        </div>
      )}
    </div>
  );
};

export default LibroForm;