'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1553281543-2688ec79c6aa?auto=format&fit=crop&w=1920&q=80',
    alt: 'Paisaje de Villa Juan | Cabalgatas y Naturaleza'
  },
  {
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    alt: 'Caballos en Villa Juan'
  },
  {
    url: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&w=1920&q=80',
    alt: 'Gastronomía al Barril'
  },
  {
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80',
    alt: 'Eventos al aire libre'
  }
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000) // Cambia cada 6 segundos para una transición más pausada y orgánica
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Slideshow de Fotografías de Fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${slides[currentSlide].url})` }}
          />
        </AnimatePresence>
        {/* Overlay Oscuro para Legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Decorative Backgound Typography */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-[14vw] font-display font-bold text-white/5 select-none pointer-events-none uppercase tracking-widest z-0">
            Villa Juan
          </div>

          {/* Main Hook */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight relative z-10"
          >
            Desconéctate de la rutina y{' '}
            <span className="text-accent relative inline-block">
              reconectá
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
            </span> con lo que realmente importa
          </motion.h1>

          {/* Sub-hook */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed-custom relative z-10"
          >
            Un espacio donde el aire de Tenjo se mezcla con el aroma del barril y la sabiduría de los caballos. 
            Más que una visita, es una pausa necesaria.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16 relative z-10"
          >
            <motion.a
              href={generateWhatsAppLink(whatsappMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 bg-accent hover:bg-text text-primary px-8 py-4 rounded-organic-lg font-heading font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <span>🌿</span>
              <span>Descubre Villa Juan</span>
            </motion.a>
          </motion.div>

          {/* Service Pillars Navigation - Staggered Offsets */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto relative z-10 px-4 md:px-0"
          >
            {[
              { href: '#eventos', icon: '🎉', title: 'Eventos', subtitle: 'Corporativos y Sociales', className: 'md:-translate-y-4 md:rotate-1' },
              { href: '#restaurante', icon: '🔥', title: 'Restaurante', subtitle: 'Al Barril', className: 'md:translate-y-4 md:-rotate-1' },
              { href: '#salidas', icon: '🎒', title: 'Salidas', subtitle: 'Pedagógicas', className: 'md:-translate-y-2 md:rotate-1' },
              { href: '#coaching', icon: '🐎', title: 'Coach', subtitle: 'Equino', className: 'md:translate-y-6 md:-rotate-2' },
            ].map((pillar, index) => (
              <motion.a
                key={pillar.href}
                href={pillar.href}
                whileHover={{ scale: 1.08, y: -12, rotate: index % 2 === 0 ? 2 : -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 1 + index * 0.1 }}
                className={`organic-fluid glass-organic p-6 text-center hover:bg-white/30 hover:shadow-2xl transition-all duration-500 group flex flex-col items-center justify-center cursor-pointer ${pillar.className}`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  {pillar.icon}
                </div>
                <h3 className="font-heading font-semibold text-text mb-1 text-sm md:text-base leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-accent font-body opacity-80 group-hover:opacity-100 transition-opacity">
                  {pillar.subtitle}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-accent rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-accent rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero