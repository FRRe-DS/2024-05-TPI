import GoogleMapComponent from "@/components/GoogleMapComponent";
import { MapPin, Mail, Phone } from 'lucide-react';
import { ImageSlider } from "@/components/CarruselDeImg";

function HomePage() {
  const images = [
    "/Escultura1.jpg",
    "/Escultura2.jpg",
    "/Escultura3.jpg",
    "/Escultura4.jpg",
    "/Escultura5.jpg",
    "/Escultura6.jpg",
    "/Escultura7.jpg",
    "/Escultura8.jpg",
    "/Escultura9.jpg",
    "/Escultura10.jpg",
  ];
  return (
    <main
      className="min-h-screen bg-black text-white "
    >
      <section className="relative h-screen">
        <div className="absolute inset-0 ">
        <img
        src="/FU-Bienal2024.jpg"  // Fondo para móviles
        alt="Fondo Bienal Móvil"
        className="w-full h-full object-cover opacity-90 md:hidden"  
      />
      <img
        src="/FU-Bienal2024 editado.jpg"  // Fondo para pantallas grandes
        alt="Fondo Bienal"
        className="w-full h-full object-cover opacity-90 hidden md:block"  
      />
          <div className="absolute inset-0 bg-black bg-opacity-10 md:bg-opacity-0"></div>
        </div>
        <div className="absolute inset-0 flex items-start  md:items-center justify-start md:justify-end px-0 md:px-16 pt-1 text-center md:pt-0">
          <div className="max-w-2xl md:text-right">
            <h1 className="text-5xl md:text-8xl font-bold mb-2 md:mb-4">
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                style={{ WebkitTextStroke: "1px black", textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
              >
                Bienal 2024
              </span>
            </h1>
            <p className="text-xl text-center md:text-xl md:-mt-5 font-semibold text-black shadow-text">
              Una exposición única de arte y escultura contemporánea
            </p>
          </div>
        </div>
      </section>

      {/* Section de fotos de la bienal */}
      <section className="py-16 px-4 md:px-8 bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-12 underline">
          Ediciones Anteriores
        </h2>
        <ImageSlider images={images} />
      </section>

      {/* Seccion de informacion sobre la bienal */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 underline">Sobre la Bienal</h2>
          <p className="text-lg text-gray-300 mb-6">
            La Bienal del Chaco es un evento internacional de escultura que
            reúne a artistas de todo el mundo. Durante este evento, podrás
            explorar una impresionante colección de obras de artistas
            reconocidos y emergentes.
          </p>
          <p className="text-lg text-gray-300">
            Descubre instalaciones, pinturas, esculturas y más, diseñadas para
            desafiar tus sentidos e inspirar nuevas perspectivas sobre el arte
            contemporáneo.
          </p>
        </div>
      </section>

      {/* Seccion de como llegar */}
      <section className="py-16 px-4 md:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          
          <div className="ml-10 text center space-y-6 ">
            <h2 className="text-4xl font-bold text-white underline">
              Cómo Llegar
            </h2>
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-5 w-5 text-gray-400" />
                Avenida de los Inmigrantes 1001, Resistencia, Chaco
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-white">
                  Indicaciones:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Desde el centro, tomar Av. 25 De Mayo</li>
                  <li>Girar a la derecha en la Av. Wilde</li>
                  <li>Seguir derecho hasta el parque 2 de febrero</li>
                  <li>El predio se encuentra a la izquierda</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <GoogleMapComponent />
          </div>
        </div>
      </section>

      {/* Seccion de contacto */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 underline">Contacto</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Teléfono</h3>
              <p className="text-gray-300">+54 362 444-5555</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-300">contacto@bienalchaco.com</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Dirección</h3>
              <p className="text-gray-300">
                Avenida de los Inmigrantes 1001, Resistencia, Chaco
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;

