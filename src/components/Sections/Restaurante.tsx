'use client'

import { motion } from 'framer-motion'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'
import { useState } from 'react'

const Restaurante = () => {
  const [showMenu, setShowMenu] = useState(false)

  const menuItems = [
    { category: 'Carnes al Barril', items: [
      'Lomo de Res Premium - Maduración 21 días',
      'Costillas BBQ - Cocción lenta 4 horas',
      'Pechuga de Pollo Orgánico',
      'Chuleta de Cerdo Artesanal'
    ]},
    { category: 'Acompañamientos', items: [
      'Papas Criollas al Carbón',
      'Yuca Gratinada',
      'Ensalada de la Huerta',
      'Arepa Boyacense'
    ]},
    { category: 'Bebidas', items: [
      'Limonada de Panela',
      'Jugos Naturales',
      'Cerveza Artesanal Local',
      'Vinos Seleccionados'
    ]}
  ]

  return (
    <section id="restaurante" className="py-20 bg-transparent relative overflow-hidden">
      {/* Editorial Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#8D4F00_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 z-0" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-[12vw] font-display font-bold text-secondary/5 select-none pointer-events-none uppercase tracking-widest z-0">
            Gastronomía
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-on_surface mb-4 relative z-10">
            Sabor a Fuego Lento
          </h2>
          <div className="flex justify-center mb-6 relative z-10">
            <img src="/VillaJuanLogo.png" className="h-12 w-12 object-contain rounded-full bg-surface_container_low p-1.5 shadow-sm border border-primary/20" alt="Villa Juan" />
          </div>
          <div className="max-w-3xl mx-auto relative z-10">
            <p className="font-body text-lg text-on_surface/80 mb-8 leading-relaxed-custom">
              La técnica es nuestra firma. Seleccionamos cortes de alta calidad con una maduración controlada 
              para intensificar cada matiz. Cocinamos al barril mediante calor indirecto con carbón vegetal; 
              un proceso de horas que garantiza una jugosidad imposible de lograr en una parrilla convencional.
            </p>
            <div className="bg-surface_container_low rounded-lg p-6 shadow-ambient">
              <h3 className="font-body text-xl font-semibold text-on_surface mb-2">La Experiencia:</h3>
              <p className="font-body text-on_surface/90 font-medium">
                Dorado perfecto por fuera, ternura total por dentro.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Process Gallery */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-body text-2xl font-semibold text-on_surface mb-8 text-center">
            El Ritual del Barril
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Selección', description: 'Cortes premium madurados', image: '/images/restaurante/seleccion.png' },
              { title: 'Preparación', description: 'Condimentos artesanales', image: '/images/restaurante/preparacion.png' },
              { title: 'Cocción', description: 'Barril de carbón vegetal', image: '/images/restaurante/coccion.png' },
              { title: 'Servicio', description: 'Presentación gourmet', image: '/images/restaurante/servicio.png' }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`bg-surface_container_lowest rounded-xl shadow-lg flex flex-col items-center justify-start p-4 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative h-full border-2 border-primary/10 ${
                  index % 2 === 0 ? 'rotate-1 hover:rotate-0' : '-rotate-1 hover:rotate-0'
                }`}>
                  <div className="relative z-10 flex flex-col items-center w-full">
                    {/* Image Container */}
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 relative bg-surface_container_low shadow-sm">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // fallback
                        }}
                      />
                    </div>
                    <h4 className="font-display font-black text-on_surface mb-1 uppercase tracking-tight group-hover:text-[#00C2E0] transition-colors">{step.title}</h4>
                    <p className="font-body text-sm text-on_surface/80">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Menu Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-surface_container_low rounded-lg p-8 mb-12 shadow-ambient"
        >
          <div className="text-center mb-8">
            <h3 className="font-display text-3xl font-bold text-on_surface mb-4">Menú Puesto</h3>
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-full font-body font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {showMenu ? 'Ocultar Menú' : 'Ver el Menú Puesto'}
            </motion.button>
          </div>

          {showMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {menuItems.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h4 className="font-body text-xl font-semibold text-on_surface mb-4 pb-2 border-b border-secondary/30">
                    {category.category}
                  </h4>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="font-body text-on_surface/80 flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mr-3 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.a
            href={generateWhatsAppLink(whatsappMessages.restaurante)}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 bg-gradient-to-br from-secondary to-secondary_container text-white px-8 py-4 rounded-full font-body font-semibold text-lg transition-all duration-300 shadow-ambient hover:shadow-lg"
          >
            <span>🔥</span>
            <span>Reservar mi mesa</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Restaurante