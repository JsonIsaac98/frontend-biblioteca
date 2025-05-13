import type React from "react";

const Home: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a la Biblioteca API</h1>
            <p className="text-lg">Esta es una aplicación de ejemplo para gestionar libros y autores.</p>
            <p className="text-lg">Utiliza la barra de navegación para explorar las diferentes secciones.</p>
        </div>
    );
}


export default Home;