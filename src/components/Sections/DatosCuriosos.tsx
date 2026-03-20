'use client'

import { motion } from 'framer-motion'

const stats = [
  {
    value: '1.000+',
    label: 'Eventos Corporativos',
    icon: '🤝',
    bgColor: 'from-primary_container/10'
  },
  {
    value: '5.000+',
    label: 'Familias Sonrientes',
    icon: '😊',
    bgColor: 'from-secondary_container/10'
  },
  {
    value: '100+',
    label: 'Animales a conocer',
    icon: '🐴',
    bgColor: 'from-tertiary/10'
  },
  {
    value: '1',
    label: 'Objetivo: Verte Feliz',
    icon: '❤️',
    bgColor: 'from-secondary/20'
  },
  {
    value: '3',
    label: 'Certificaciones en Turismo y Equino',
    icon: '📜',
    bgColor: 'from-primary/10'
  }
]

const DatosCuriosos = () => {
  return (
    <section className="py-16 bg-surface relative overflow-hidden">
      {/* Editorial Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#256D00_1px,transparent_1px)] bg-[size:16px_16px] opacity-5 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on_surface mb-2">
            Villa Datos Curiosos
          </h2>
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-organic rounded-lg p-5 text-center flex flex-col items-center justify-center cursor-pointer hover:shadow-ambient transition-all duration-500 group relative overflow-hidden transform ${
                index % 2 === 0 ? 'md:-translate-y-2' : 'md:translate-y-2'
              }`}
            >
              {/* Background Glow Node */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0`} />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-3xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 block">
                  {stat.icon}
                </span>
                
                <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-1 tracking-tight">
                  {stat.value}
                </h3>
                
                <p className="font-body text-[11px] font-semibold text-on_surface/80 uppercase tracking-wider leading-tight max-w-[120px]">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DatosCuriosos
