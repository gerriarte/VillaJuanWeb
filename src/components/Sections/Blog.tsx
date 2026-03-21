'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import Link from 'next/link'

const Blog = () => {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }
  // Placeholder blog articles based on content.md
  const blogArticles = [
    { id: 1, title: 'Los Beneficios del Coaching Equino para Ejecutivos', category: 'Coaching', date: '2026-03-15', views: 342 },
    { id: 2, title: 'Secretos de la Cocción al Barril: Técnica Artesanal', category: 'Gastronomía', date: '2026-03-10', views: 289 },
    { id: 3, title: 'Educación Ambiental: Aprender en la Naturaleza', category: 'Educación', date: '2026-03-08', views: 156 },
    { id: 4, title: 'Cómo Organizar el Evento Corporativo Perfecto', category: 'Eventos', date: '2026-03-05', views: 423 },
    { id: 5, title: 'La Importancia de la Agricultura Orgánica', category: 'Sostenibilidad', date: '2026-03-01', views: 198 },
    { id: 6, title: 'Tenjo: Un Oasis Natural Cerca de Bogotá', category: 'Turismo', date: '2026-02-28', views: 367 },
    { id: 7, title: 'Mindfulness y Naturaleza: Una Combinación Poderosa', category: 'Bienestar', date: '2026-02-25', views: 234 },
    { id: 8, title: 'Recetas Tradicionales con Ingredientes de la Granja', category: 'Gastronomía', date: '2026-02-20', views: 445 },
    { id: 9, title: 'Team Building: Actividades que Realmente Funcionan', category: 'Coaching', date: '2026-02-18', views: 312 },
    { id: 10, title: 'Flora y Fauna de la Sabana de Bogotá', category: 'Educación', date: '2026-02-15', views: 178 },
    { id: 11, title: 'Sostenibilidad en Eventos: Celebrar sin Dañar', category: 'Sostenibilidad', date: '2026-02-10', views: 267 },
    { id: 12, title: 'El Arte de la Hospitalidad Rural', category: 'Turismo', date: '2026-02-08', views: 389 },
    { id: 13, title: 'Ejercicios de Respiración en Espacios Naturales', category: 'Bienestar', date: '2026-02-05', views: 201 },
    { id: 14, title: 'Historia de la Ganadería en Cundinamarca', category: 'Cultura', date: '2026-02-01', views: 156 },
    { id: 15, title: 'Planificación de Bodas Eco-Friendly', category: 'Eventos', date: '2026-01-28', views: 334 }
  ]

  const categories = ['Todos', 'Coaching', 'Gastronomía', 'Educación', 'Eventos', 'Sostenibilidad', 'Turismo', 'Bienestar', 'Cultura']

  const categoryImages: { [key: string]: string } = {
    Coaching: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=500&q=80',
    Gastronomía: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    Educación: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80',
    Eventos: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80',
    Sostenibilidad: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&q=80',
    Turismo: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80',
    Bienestar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80',
    Cultura: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=500&q=80',
    Default: 'https://images.unsplash.com/photo-1534073136377-2260640fa889?auto=format&fit=crop&w=500&q=80'
  }

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Editorial Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#256D00_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 z-0" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-on_surface mb-6">
            Crónicas de la Tierra
          </h2>
          <p className="font-body text-lg text-on_surface/80 max-w-2xl mx-auto leading-relaxed-custom">
            Tips, beneficios del coaching y secretos de la vida en la granja. 
            Actualidad Villa Juan para mantenerte conectado con la naturaleza y el crecimiento personal.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-body font-medium transition-all duration-300 ${
                index === 0 
                  ? 'bg-primary text-white' 
                  : 'bg-surface_container_lowest text-on_surface hover:bg-primary/10 border-none shadow-sm'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Slider Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-surface_container_lowest p-3 rounded-full shadow-ambient opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-primary/10 text-primary hidden md:block"
          >
            ←
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-surface_container_lowest p-3 rounded-full shadow-ambient opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-primary/10 text-primary hidden md:block"
          >
            →
          </button>

          <div 
            ref={sliderRef} 
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar pb-8 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {blogArticles.map((article, index) => (
              <Link 
                key={article.id} 
                href={`/cronicas/${article.id}`} 
                className="snap-center shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw] focus:outline-none"
              >
                <motion.article
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="w-full bg-surface_container_lowest rounded-lg overflow-hidden shadow-ambient hover:shadow-ambient-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer group/card flex flex-col relative h-full"
                >
                <div className="relative z-10 flex flex-col h-full">
                  {/* Article Image Placeholder */}
                  <div className="p-4">
                    <div className="aspect-video bg-surface_container_low rounded-lg overflow-hidden flex items-center justify-center group-hover/card:scale-[1.03] transition-transform duration-500 relative">
                      <img 
                        src={categoryImages[article.category as keyof typeof categoryImages] || categoryImages.Default}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-body">
                        {article.category}
                      </span>
                      <span className="text-on_surface/60 text-xs font-body">
                        {article.date.split('-').slice(1).reverse().join('/')}
                      </span>
                    </div>

                    <h3 className="font-body text-lg font-semibold text-on_surface mb-3 group-hover/card:text-primary transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="font-body text-on_surface/70 text-sm mb-4 line-clamp-2">
                      Descubre insights únicos sobre {article.category.toLowerCase()} desde Villa Juan.
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="font-body text-primary text-sm font-medium group-hover/card:underline">
                        Leer más →
                      </span>
                      <div className="flex items-center space-x-1 text-on_surface/50">
                        <span className="text-xs">👁️</span>
                        <span className="text-xs font-body">{article.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More Button -> convertido a Acción de Slider opcional */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="btn-satin px-8 py-4 text-base"
          >
            Ver más artículos
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Blog