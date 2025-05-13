import axios from "axios";
import type { Autor, CreateLibroDto, Libro } from "../types";

const API_BASE_URL = 'http://localhost:3001/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Intecereptores para manejar errores globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la respuesta de la API:', error);
        return Promise.reject(error);
    }
)


//servicio para libros
export const librosService = {
    getAll: async (): Promise<Libro[]> => {
        const response = await api.get<Libro[]>('/libros');
        return response.data;
    },

    getById: async (id: number): Promise<Libro> => {
        const response = await api.get<Libro>(`/libros/${id}`);
        return response.data;
    },

    create: async (data: CreateLibroDto): Promise<Libro> => {
        const response = await api.post<Libro>('/libros', data);
        return response.data;
    },

    update: async (id: number, data: Partial<CreateLibroDto>): Promise<Libro> => {
        const response = await api.patch<Libro>(`/libros/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/libros/${id}`);
    },

    search: async (query: string): Promise<Libro[]> => {
        const response = await api.get(`/libros/search?q=${query}`);
        return response.data;
    },
};

    // servicio para autores

export const autoresService = {
    getAll: async (): Promise<Autor[]> => {
        const response = await api.get<Autor[]>('/autores');
        return response.data;
    },

    getById: async (id: number): Promise<Autor> => {
        const response = await api.get<Autor>(`/autores/${id}`);
        return response.data;
    },

    create: async (data: Omit<Autor, 'id'>): Promise<Autor> => {
        const response = await api.post<Autor>('/autores', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Omit<Autor, 'id'>>): Promise<Autor> => {
        const response = await api.patch<Autor>(`/autores/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/autores/${id}`);
    },
}