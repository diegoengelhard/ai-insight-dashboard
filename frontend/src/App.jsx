function App() {
  return (
    // Contenedor principal: fondo oscuro, ocupa toda la pantalla y centra su contenido.
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">

      {/* Tarjeta: fondo más claro, padding, esquinas redondeadas, sombra y un ancho máximo. */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-lg w-full max-w-md ring-1 ring-slate-700">

        {/* Título: texto grande, negrita y con un gradiente de color. */}
        <h1 className="text-3xl font-bold text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            ¡Tailwind CSS v4 Funciona!
          </span>
        </h1>

        {/* Párrafo: texto más pequeño, color sutil y un margen superior. */}
        <p className="text-slate-400 text-center mt-4">
          Si ves esta tarjeta estilizada, tu configuración es correcta.
        </p>

        {/* Botón: color de fondo, texto blanco, padding, esquinas redondeadas y efecto al pasar el cursor. */}
        <div className="mt-8 text-center">
          <button className="bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-500 transition-colors focus:ring-4 focus:ring-sky-800">
            Botón de Prueba
          </button>
        </div>

      </div>
    </main>
  )
}

export default App