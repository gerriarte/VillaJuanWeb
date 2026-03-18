'use client'

import { motion } from 'framer-motion'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const Contacto = () => {
  return (
    <section id="contacto" className="py-20 bg-primary relative overflow-hidden">
      {/* High-Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#5E9E16_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 mix-blend-multiply z-0" />
      
      {/* Micro-Decal / HUD Coordinates */}
      <div className="absolute top-12 left-8 font-mono text-[10px] tracking-widest text-text/30 select-none pointer-events-none z-10 hidden md:block">
        NODE: <span className="text-secondary font-bold">#TENJO_GATEWAY</span> | PING: 12ms
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
            Estamos más cerca de lo que creés
          </h2>
          <p className="font-body text-lg text-text/80 max-w-2xl mx-auto leading-relaxed-custom">
            Tenjo, Cundinamarca. A solo unos minutos de Bogotá, pero a un mundo de distancia del ruido.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="glass-organic rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">📍</span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text">Ubicación</h3>
                    <p className="font-body text-text/80">Tenjo, Cundinamarca, Colombia</p>
                  </div>
                </div>
                <p className="font-body text-text/70 text-sm">
                  Vía Tenjo - Tabio, Km 3. Fácil acceso desde Bogotá por la Autopista Norte.
                </p>
              </div>

              <div className="glass-organic rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">📧</span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text">Email</h3>
                    <a 
                      href="mailto:gerencia@villa-juan.com"
                      className="font-body text-accent hover:text-text transition-colors"
                    >
                      gerencia@villa-juan.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-organic rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">📱</span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text">Teléfono</h3>
                    <a 
                      href="tel:+573208689681"
                      className="font-body text-accent hover:text-text transition-colors"
                    >
                      +57 320 868 9681
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-organic bg-green-50/10 border-green-200/30 rounded-2xl p-6"
            >
              <div className="text-center">
                <h4 className="font-heading text-lg font-semibold text-text mb-3">
                  ¿Preferís hablar directamente?
                </h4>
                <motion.a
                  href={generateWhatsAppLink(whatsappMessages.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-organic font-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>💬</span>
                  <span>Escribinos por WhatsApp</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Hours */}
            <div className="glass-organic rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
              <h4 className="font-heading text-lg font-semibold text-text mb-4 flex items-center">
                <span className="mr-3">🕐</span>
                Horarios de Atención
              </h4>
              <div className="space-y-2 font-body text-text/80">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span>7:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span>7:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-full min-h-[500px]"
          >
            <div className="glass-organic rounded-3xl p-4 h-full">
              <div className="w-full h-full bg-gradient-to-br from-atmosphere-trote/30 to-accent/20 organic-fluid flex items-center justify-center p-8 hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <h4 className="font-heading text-xl font-semibold text-text mb-2">
                    Mapa Interactivo
                  </h4>
                  <p className="font-body text-text/70 mb-4">
                    Ubicación exacta de Villa Juan
                  </p>
                  <button className="bg-accent hover:bg-text text-primary px-6 py-3 rounded-organic font-heading font-medium transition-all duration-300">
                    Ver en Google Maps
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Directions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-organic bg-atmosphere-trote/10 rounded-3xl p-8 border-none">
            <h3 className="font-heading text-2xl font-semibold text-text mb-6 text-center">
              ¿Cómo llegar desde Bogotá?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <span className="text-3xl mb-3 block">🚗</span>
                <h4 className="font-heading font-semibold text-text mb-2">En Carro</h4>
                <p className="font-body text-text/80 text-sm">
                  Autopista Norte → Salida Chía → Vía Tenjo-Tabio → Km 3
                </p>
                <p className="font-body text-accent text-sm mt-1">45 minutos aprox.</p>
              </div>
              <div className="text-center">
                <span className="text-3xl mb-3 block">🚌</span>
                <h4 className="font-heading font-semibold text-text mb-2">Transporte Público</h4>
                <p className="font-body text-text/80 text-sm">
                  Portal Norte → Bus Tenjo → Parada Villa Juan
                </p>
                <p className="font-body text-accent text-sm mt-1">1 hora 15 min aprox.</p>
              </div>
              <div className="text-center">
                <span className="text-3xl mb-3 block">🚐</span>
                <h4 className="font-heading font-semibold text-text mb-2">Transporte Privado</h4>
                <p className="font-body text-text/80 text-sm">
                  Organizamos transporte grupal desde Bogotá
                </p>
                <p className="font-body text-accent text-sm mt-1">Consultar disponibilidad</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contacto