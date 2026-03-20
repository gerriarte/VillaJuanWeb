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
      image: '/images/eventos/corporativos.png'
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
      image: '/images/eventos/sociales.png'
    }
  ]

  return (
    <section id="eventos" className="py-20 bg-surface_container_low relative overflow-hidden">
      {/* Editorial Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#256D00_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 z-0" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-[12vw] font-display font-bold text-primary/5 select-none pointer-events-none uppercase tracking-widest z-0">
            Momentos
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-on_surface mb-4 relative z-10">
            Celebraciones con Propósito
          </h2>
          <div className="flex justify-center mb-6 relative z-10">
            <img src="/VillaJuanLogo.png" className="h-12 w-12 object-contain rounded-full bg-surface_container_low p-1.5 shadow-sm border border-primary/20" alt="Villa Juan" />
          </div>
          <p className="font-body text-lg text-on_surface/80 max-w-3xl mx-auto leading-relaxed-custom relative z-10">
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
              className="glass-organic rounded-lg p-6 hover:shadow-ambient hover:-translate-y-1 transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col h-full"
            >
              <div className="relative z-10 w-full aspect-video rounded-lg overflow-hidden mb-6 bg-surface_container_low">
                <img 
                  src={eventType.image}
                  alt={eventType.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // fallback
                  }}
                />
              </div>

              <div className="relative z-10 flex items-center mb-4">
                <h3 className="font-display text-2xl font-bold text-on_surface">
                  {eventType.title}
                </h3>
              </div>

              <p className="font-body text-on_surface/80 mb-6 leading-relaxed-custom relative z-10">
                {eventType.description}
              </p>

              <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
                {eventType.features.map((feature, featureIndex) => (
                  <motion.span
                    key={featureIndex}
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: featureIndex * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-primary/5 text-primary text-xs font-body px-3 py-1.5 rounded-full border border-primary/20 tracking-wide shadow-sm"
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>
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
          <h3 className="font-body text-2xl font-semibold text-on_surface mb-6 text-center">
            Nuestros Espacios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 1, title: 'Jardines de la Granja', image: '/images/espacios/jardines.png', span: 'text-primary/60' },
              { id: 2, title: 'Salón Rústico Principal', image: '/images/espacios/salon.png', span: 'text-primary/60' },
              { id: 3, title: 'Zona de Barril y Fogata', image: '/images/espacios/fogata.png', span: 'text-primary/60' }
            ].map((item) => (
              <div
                key={item.id}
                className="aspect-video bg-surface_container_lowest rounded-lg shadow-ambient overflow-hidden hover:scale-105 transition-all duration-500 cursor-pointer group relative"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1518005020810-69288f3beaf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // fallback
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-body font-medium text-sm">{item.title}</span>
                </div>
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
            className="inline-flex items-center space-x-3 btn-satin px-8 py-4 text-lg"
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