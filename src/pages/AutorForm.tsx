import * as yup from 'yup';
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {autoresService} from "../service/api.ts";
import {useForm} from "react-hook-form";
import type {CreateAutorDto} from "../types";
import {useEffect} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
// Schema para la validacion

const schema = yup.object().shape({
    nombre: yup.string().required('El nombre es obligatorio'),
    apellido: yup.string('El apellido es obligatorio'),
    biografia: yup.string().optional(),
    nacionaliad: yup.string().optional(),
    fechaNacimiento: yup.string().optional(),
});

// Tipo para el formuario
type FormData = {
    nombre: string;
    apellido: string;
    biografia?: string;
    nacionaliad?: string;
    fechaNacimiento?: string;
};

const AutorForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams< { id:string }>();
    const queryClient = useQueryClient();
    const isEditing = Boolean(id);

    const { data: autor } = useQuery({
        queryKey: ['autor', id],
        queryFn: () => autoresService.getById(Number(id)),
        enabled: isEditing,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const createMutation = useMutation<any, Error, CreateAutorDto>({
        mutationFn: autoresService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autores']});
            navigate('/autores')
        },
        onError: (error) =>{
            console.error('Error al crear autor: ', error);
        }
    });

    const updateMutation = useMutation<any, Error, {id: number, autor: Partial<CreateAutorDto>}> ({
        mutationFn: ({ id, autor }) => autoresService.update(id, autor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autores']});
            queryClient.invalidateQueries(({ queryKey: ['autor', id]}));
            navigate('/autores');
        },
        onError: (error) => {
            console.error('Error al actualizar autor', error)
        }
    });

    const onSubmit = (data: FormData) => {
    //     transformar FormData a CreateDTO

        const autorData: CreateAutorDto = {
            nombre: data.nombre,
            apellido: data.apellido,
            biografia: data.biografia,
            nacionalidad: data.nacionaliad,
            fechaNacimiento: data.fechaNacimiento,
        };

        if (isEditing){
            updateMutation.mutate({ id: Number(id), autor: autorData});
        } else {
            createMutation.mutate(autorData)
        }

        useEffect(() => {
            if (autor && isEditing){
                setValue('nombre', autor.nombre);
                setValue('apellido', autor.apellido);
                setValue('biografia', autor.biografia);
                setValue('nacionalidad', autor.nacionalidad);
                setValue('fechaNacimiento', autor.fechaNacimiento);
            }
        }, [autor, setValue, isEditing]);
    }

    const isLoading =createMutation.isPending || updateMutation.isPending;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                {isEditing ? 'Editar Autor': 'Nuevo Autor'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            {...register('nombre')}
                            className="mt-1 block w-full px-3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                            {errors.nombre && (
                                <p className="mt-1 text-sm text-red-600">{erros.nombre.message}</p>
                            )}
                    </div>
                    <div>
                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            {...register('apellido')}
                            className="mt-1 block w-full px-3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.apellido && (
                            <p className="mt-1 text-sm text-red-600">{erros.apellido.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="nacionalidad" className="block text-sm font-medium text-gray-700">
                            Nacionalidad *
                        </label>
                        <input
                            type="text"
                            {...register('nacionalidad')}
                            className="mt-1 block w-full px-3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.nacionalidad && (
                            <p className="mt-1 text-sm text-red-600">{erros.nacionalidad.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
                            Fecha de Nacimiento *
                        </label>
                        <input
                            type="date"
                            {...register('fechaNacimiento')}
                            className="mt-1 block w-full px-3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.fechaNacimiento && (
                            <p className="mt-1 text-sm text-red-600">{erros.fechaNacimiento.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="biografia" className="block text-sm font-medium text-gray-700">
                            Biografia *
                        </label>
                        <input
                            type="text"
                            {...register('biografia')}
                            className="mt-1 block w-full px-3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.biografia && (
                            <p className="mt-1 text-sm text-red-600">{erros.biografia.message}</p>
                        )}
                    </div>
                </div>
                <div className="felx justify-end sapce-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/autores')}
                        className="bg-gray300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disable: opacity-50"
                    >
                        { isLoading
                            ? 'Guardando...'
                            : isEditing
                                ? 'Actualizar'
                                : 'Crear'
                        }
                    </button>
                </div>
            </form>
        {/*    Mostar erroes de mutations*/}
            {createMutation.error && (
            <div className="mt-4 p-5 bg-red-100 border border-red-400 text-red-700 rounded">
                Error al crear autor: {createMutation.error.message}
            </div>
                )}
            {updateMutation.error && (
                <div className="mt-4 p-5 bg-red-100 border border-red-400 text-red-700 rounded">
                    Error al actualizar autor: {updateMutation.error.message}
                </div>
            )}
        </div>
    )
}

export default  AutorForm;