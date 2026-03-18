'use client'

import { motion } from 'framer-motion'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const Eventos = () => {
  const eventTypes = [
    {
      title: 'Eventos Corporativos',
      description: 'Team building, jornadas de bienestar y planeación estratégica fuera de la oficina. Capacidad para eventos simultáneos con logística impecable.',
      features: [
        'Espacios para 50-200 personas',
        'Zonas techadas y al aire libre',
        'Actividades de integración',
        'Catering personalizado',
        'Logística completa'
      ],
      icon: '🏢'
    },
    {
      title: 'Celebraciones Sociales',
      description: 'Bodas y 15 años con el encanto del campo y la sofisticación que tu momento merece.',
      features: [
        'Ceremonia en jardines naturales',
        'Salón de recepciones rústico-chic',
        'Decoración con flores locales',
        'Fotografía en paisajes únicos',
        'Coordinación integral del evento'
      ],
      icon: '💒'
    }
  ]

  return (
    <section id="eventos" className="py-20 bg-primary relative overflow-hidden">
      {/* High-Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#5E9E16_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 mix-blend-multiply z-0" />
      
      {/* Micro-Decal / HUD Coordinates */}
      <div className="absolute top-12 left-8 font-mono text-[10px] tracking-widest text-text/30 select-none pointer-events-none z-10 hidden md:block">
        GRID_SYS: <span className="text-secondary font-bold">#MATRIX_ACTIVE</span> | NODE_COUNT: 12
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
            Momentos
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mb-6 relative z-10">
            Celebraciones con Propósito
          </h2>
          <p className="font-body text-lg text-text/80 max-w-3xl mx-auto leading-relaxed-custom relative z-10">
            En la Ecogranja Villa Juan no solo alquilamos un espacio; diseñamos escenarios naturales 
            para fortalecer equipos y celebrar la vida. Contamos con amplias zonas verdes y espacios 
            cubiertos ideales para momentos únicos.
          </p>
        </motion.div>

        {/* Event Types Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 px-4">
          {eventTypes.map((eventType, index) => (
            <motion.div
              key={eventType.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`glass-organic rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer group relative overflow-hidden transform ${
                index % 2 === 0 ? 'md:-translate-y-4 md:rotate-1' : 'md:translate-y-4 md:-rotate-1'
              }`}
            >
              <div className="absolute -top-10 -right-10 text-[10rem] font-display font-bold text-accent/5 select-none pointer-events-none z-0">
                0{index + 1}
              </div>
              <div className="relative z-10 flex items-center mb-6">
                <span className="text-4xl mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{eventType.icon}</span>
                <h3 className="font-display text-2xl font-bold text-text">
                  {eventType.title}
                </h3>
              </div>

              <p className="font-body text-text/80 mb-6 leading-relaxed-custom relative z-10">
                {eventType.description}
              </p>

              <ul className="space-y-3 relative z-10">
                {eventType.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-text/90 font-body"
                  >
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Gallery Placeholder */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-heading text-2xl font-semibold text-text mb-6 text-center">
            Nuestros Espacios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-video bg-gradient-to-br from-accent/20 to-atmosphere-trote/10 organic-fluid glass-organic flex items-center justify-center hover:scale-105 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span className="text-accent/60 font-heading text-sm">Espacio {item}</span>
              </div>
            ))}
          </div>
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
            href={generateWhatsAppLink(whatsappMessages.eventos)}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 bg-accent hover:bg-text text-primary px-8 py-4 rounded-organic-lg font-heading font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>🎉</span>
            <span>Cotizar mi evento ahora</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Eventos