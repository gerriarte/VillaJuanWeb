'use client'

import { motion } from 'framer-motion'

const stats = [
  {
    value: '1.000+',
    label: 'Eventos Corporativos',
    icon: '🤝',
    bgColor: 'from-atmosphere-trote/20'
  },
  {
    value: '5.000+',
    label: 'Familias Sonrientes',
    icon: '😊',
    bgColor: 'from-accent/20'
  },
  {
    value: '100+',
    label: 'Animales a conocer',
    icon: '🐴',
    bgColor: 'from-secondary/20'
  },
  {
    value: '1',
    label: 'Objetivo: Verte Feliz',
    icon: '❤️',
    bgColor: 'from-atmosphere-trocha/20'
  },
  {
    value: '3',
    label: 'Certificaciones en Turismo y Equino',
    icon: '📜',
    bgColor: 'from-atmosphere-paso-fino/20'
  }
]

const DatosCuriosos = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-primary via-white/50 to-primary relative overflow-hidden">
      {/* High-Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#5E9E16_1px,transparent_1px)] bg-[size:16px_16px] opacity-5 mix-blend-multiply z-0" />
      
      {/* Micro-Decal / HUD Coordinates */}
      <div className="absolute top-4 right-8 font-mono text-[9px] tracking-widest text-text/30 select-none pointer-events-none z-10 hidden md:block">
        SYS: <span className="text-accent font-bold">#STATS_COUNTER</span> | POOL: 5_NODES
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text mb-2">
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
              className={`glass-organic rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-500 group relative overflow-hidden transform ${
                index % 2 === 0 ? 'md:-translate-y-2' : 'md:translate-y-2'
              }`}
            >
              {/* Background Glow Node */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0`} />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-3xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 block">
                  {stat.icon}
                </span>
                
                <h3 className="font-display text-2xl md:text-3xl font-bold text-accent mb-1 font-mono tracking-tight">
                  {stat.value}
                </h3>
                
                <p className="font-heading text-[11px] font-semibold text-text/80 uppercase tracking-wider leading-tight max-w-[120px]">
                  {stat.label}
                </p>
              </div>

              {/* High-Tech Edge Ticks */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-text/20 group-hover:border-secondary transition-colors" />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-text/20 group-hover:border-secondary transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DatosCuriosos
