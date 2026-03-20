'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function CronicaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id ? Number(params.id) : 1

  // Mock articles dataset to pull details
  const blogArticles = [
    { id: 1, title: 'Los Beneficios del Coaching Equino para Ejecutivos', category: 'Coaching', date: '2026-03-15', views: 342 },
    { id: 2, title: 'Secretos de la Cocción al Barril: Técnica Artesanal', category: 'Gastronomía', date: '2026-03-10', views: 289 },
    { id: 3, title: 'Educación Ambiental: Aprender en la Naturaleza', category: 'Educación', date: '2026-03-08', views: 156 },
    { id: 4, title: 'Cómo Organizar el Evento Corporativo Perfecto', category: 'Eventos', date: '2026-03-05', views: 423 },
    { id: 5, title: 'La Importancia de la Agricultura Orgánica', category: 'Sostenibilidad', date: '2026-03-01', views: 198 },
    { id: 6, title: 'Tenjo: Un Oasis Natural Cerca de Bogotá', category: 'Turismo', date: '2026-02-28', views: 367 },
    { id: 7, title: 'Mindfulness y Naturaleza: Una Combinación Poderosa', category: 'Bienestar', date: '2026-02-25', views: 234 }
  ]

  const categoryImages: { [key: string]: string } = {
    Coaching: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80',
    Gastronomía: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    Educación: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    Eventos: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    Sostenibilidad: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    Turismo: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    Bienestar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    Cultura: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
    Default: 'https://images.unsplash.com/photo-1534073136377-2260640fa889?auto=format&fit=crop&w=1200&q=80'
  }

  const article = blogArticles.find(a => a.id === id) || blogArticles[0]
  const coverImage = categoryImages[article.category as keyof typeof categoryImages] || categoryImages.Default

  return (
    <main className="bg-surface min-h-screen text-on_surface overflow-hidden relative">
      {/* Article Hero */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-surface_container_low flex items-end">
        <img 
          src={coverImage} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt={article.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Float Controls */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all font-body text-sm flex items-center space-x-2">
            <span>←</span> <span>Volver</span>
          </Link>
        </div>

        <div className="container mx-auto px-6 pb-12 z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-primary text-white text-xs font-heading font-semibold px-4 py-1.5 rounded-full shadow-sm">
              {article.category}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mt-4 mb-3 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center space-x-4 text-white/80 text-sm font-body">
              <span>Por Equipo Villa Juan</span>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <span>{article.date.split('-').slice(1).reverse().join('/')}</span>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <span>👁️ {article.views} views</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Body */}
      <section className="container mx-auto px-6 py-16 max-w-3xl relative">
        {/* Dot grid decoration suttle background watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#256D00_1px,transparent_1px)] bg-[size:32px_32px] opacity-5 z-0" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 font-body text-on_surface/90 leading-relaxed-custom prose prose-green max-w-none"
        >
          <p className="text-xl font-medium text-on_surface mb-6">
            Descubre insights únicos sobre {article.category.toLowerCase()} desde Villa Juan, 
            experiencias auténticas y consejos prácticos para el crecimiento personal.
          </p>

          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed eros varius, 
            sagittis diam sit amet, vulputate leo. Nullam feugiat orci id ante facilisis, 
            nec elementum lorem sollicitudin. Proin facilisis lectus ac dolor ornare facilisis. 
            Phasellus varius erat id orci aliquet sodales.
          </p>

          <div className="bg-surface_container_low p-6 rounded-lg my-8 border-l-4 border-primary shadow-sm">
            <h3 className="text-lg font-bold mb-2">Una pausa necesaria</h3>
            <p className="italic text-on_surface/80">
              "En Villa Juan unimos la respiración de la naturaleza con nuestro barril artesanal 
              para crear momentos inexplicables en una tarde rústica tranquila."
            </p>
          </div>

          <p className="mb-6">
            Fusce quis lacus vel tellus pellentesque vehicula pretium ut massa. 
            Donec quis sem vitae metus condimentum gravida nec quis mauris. 
            Nullam a ipsum vel eros sollicitudin viverra. Curabitur vel accumsan dui. 
            Nullam ut justo nec nulla aliquam rhoncus id sed nulla.
          </p>

          <p className="mb-6">
            Cras non interdum elit, eget molestie sem. Quisque vitae nisl nec purus 
            vestibulum sollicitudin quis vel nisl. Mauris scelerisque sapien vel 
            purus ornare feugiat. Sed vitae dui scelerisque, facilisis neque ac, 
            dictum elit.
          </p>
        </motion.div>
      </section>
    </main>
  )
}
