'use client'

import { motion } from 'framer-motion'

const Blog = () => {
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

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-atmosphere-paso-fino/10 relative overflow-hidden">
      {/* High-Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#5E9E16_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 mix-blend-multiply z-0" />
      
      {/* Micro-Decal / HUD Coordinates */}
      <div className="absolute top-12 left-8 font-mono text-[10px] tracking-widest text-text/30 select-none pointer-events-none z-10 hidden md:block">
        BLOG_FEED: <span className="text-secondary font-bold">#CHRONICLES</span> | POSTS: 15
      </div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mb-6">
            Crónicas de la Tierra
          </h2>
          <p className="font-body text-lg text-text/80 max-w-2xl mx-auto leading-relaxed-custom">
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
              className={`px-4 py-2 rounded-organic font-heading font-medium transition-all duration-300 ${
                index === 0 
                  ? 'bg-accent text-primary' 
                  : 'glass-organic bg-white/20 text-text hover:bg-accent hover:text-primary border-none shadow-sm'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-organic rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group flex flex-col h-full relative"
            >
              {/* Background Number */}
              <div className="absolute -top-10 -right-12 text-[12rem] font-display font-bold text-accent/5 select-none pointer-events-none z-0">
                {article.id}
              </div>

              <div className="relative z-10 flex flex-col h-full">
              {/* Article Image Placeholder */}
              <div className="p-4">
                <div className="aspect-video bg-gradient-to-br from-accent/30 to-atmosphere-trote/10 organic-fluid flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-500">
                  <span className="text-4xl opacity-60 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">📖</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-body">
                    {article.category}
                  </span>
                  <span className="text-text/60 text-sm font-body">
                    {article.date.split('-').slice(1).reverse().join('/')}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-semibold text-text mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>

                <p className="font-body text-text/70 text-sm mb-4 line-clamp-3">
                  Descubre insights únicos sobre {article.category.toLowerCase()}, 
                  experiencias auténticas y consejos prácticos desde Villa Juan.
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-body text-accent text-sm font-medium group-hover:underline">
                    Leer más →
                  </span>
                  <div className="flex items-center space-x-1 text-text/50">
                    <span className="text-sm">👁️</span>
                    <span className="text-sm font-body">{article.views}</span>
                  </div>
                </div>
              </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent hover:bg-text text-primary px-8 py-4 rounded-organic-lg font-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver más artículos
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Blog