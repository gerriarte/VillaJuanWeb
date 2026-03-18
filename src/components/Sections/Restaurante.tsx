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
    <section id="restaurante" className="py-20 bg-gradient-to-br from-atmosphere-trocha/10 to-primary relative overflow-hidden">
      {/* High-Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#5E9E16_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 mix-blend-multiply z-0" />
      
      {/* Micro-Decal / HUD Coordinates */}
      <div className="absolute top-12 left-8 font-mono text-[10px] tracking-widest text-accent/30 select-none pointer-events-none z-10 hidden md:block">
        SYS_ID: <span className="text-secondary">#FB_BARRIL</span> | TEMP_REF: 180°C
      </div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-[12vw] font-display font-bold text-accent/5 select-none pointer-events-none uppercase tracking-widest z-0">
            Gastronomía
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mb-6 relative z-10">
            Sabor a Fuego Lento
          </h2>
          <div className="max-w-3xl mx-auto relative z-10">
            <p className="font-body text-lg text-text/80 mb-8 leading-relaxed-custom">
              La técnica es nuestra firma. Seleccionamos cortes de alta calidad con una maduración controlada 
              para intensificar cada matiz. Cocinamos al barril mediante calor indirecto con carbón vegetal; 
              un proceso de horas que garantiza una jugosidad imposible de lograr en una parrilla convencional.
            </p>
            <div className="glass-organic bg-atmosphere-trocha/10 rounded-2xl p-6 border-none shadow-md">
              <h3 className="font-heading text-xl font-semibold text-text mb-2">La Experiencia:</h3>
              <p className="font-body text-text/90 font-medium">
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
          <h3 className="font-heading text-2xl font-semibold text-text mb-8 text-center">
            El Ritual del Barril
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Selección', description: 'Cortes premium madurados', icon: '🥩' },
              { title: 'Preparación', description: 'Condimentos artesanales', icon: '🧂' },
              { title: 'Cocción', description: 'Barril de carbón vegetal', icon: '🔥' },
              { title: 'Servicio', description: 'Presentación gourmet', icon: '🍽️' }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`text-center ${index % 2 === 0 ? 'md:-translate-y-2' : 'md:translate-y-2'}`}
              >
                <div className="aspect-square organic-fluid glass-organic flex flex-col items-center justify-center p-6 mb-4 cursor-pointer hover:scale-105 hover:rotate-2 transition-all duration-500 group relative overflow-hidden">
                  {/* Background Number */}
                  <div className="absolute -top-8 -left-6 text-[10rem] font-display font-bold text-accent/5 select-none pointer-events-none z-0">
                    {index + 1}
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">{step.icon}</span>
                    <h4 className="font-heading font-semibold text-text mb-1">{step.title}</h4>
                    <p className="font-body text-sm text-text/80">{step.description}</p>
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
          className="glass-organic rounded-3xl p-8 mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="font-display text-3xl font-bold text-text mb-4">Menú Puesto</h3>
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent hover:bg-text text-primary px-6 py-3 rounded-organic font-heading font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
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
                  <h4 className="font-heading text-xl font-semibold text-text mb-4 pb-2 border-b border-accent/30">
                    {category.category}
                  </h4>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="font-body text-text/80 flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
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
            className="inline-flex items-center space-x-3 bg-atmosphere-trocha hover:bg-atmosphere-trocha/80 text-white px-8 py-4 rounded-organic-lg font-heading font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
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