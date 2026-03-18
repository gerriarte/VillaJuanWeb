'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const CoachEquino = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const plans = [
    {
      id: 'trote',
      atmosphere: 'trote',
      color: 'atmosphere-trote',
      title: 'Villa Plan Trote',
      subtitle: 'Verde - Estabilidad y Primeros Pasos',
      description: 'Foco: Estabilidad y primeros pasos en el autoconocimiento.',
      features: [
        'Sesiones individuales de 90 minutos',
        'Introducción al lenguaje equino',
        'Ejercicios de respiración y presencia',
        'Reflexión guiada post-sesión'
      ],
      message: whatsappMessages.coachTrote,
      icon: '🌱'
    },
    {
      id: 'trocha',
      atmosphere: 'trocha',
      color: 'atmosphere-trocha',
      title: 'Villa Plan Trocha',
      subtitle: 'Rojo - Energía y Superación',
      description: 'Foco: Energía, toma de decisiones y superación de obstáculos.',
      features: [
        'Sesiones de 2 horas con desafíos',
        'Trabajo con obstáculos físicos y mentales',
        'Técnicas de liderazgo asertivo',
        'Plan de acción personalizado'
      ],
      message: whatsappMessages.coachTrocha,
      icon: '🔥'
    },
    {
      id: 'paso-fino',
      atmosphere: 'paso-fino',
      color: 'atmosphere-paso-fino',
      title: 'Villa Plan Paso Fino',
      subtitle: 'Amarillo - Excelencia y Liderazgo',
      description: 'Foco: Excelencia, liderazgo consciente y comunicación asertiva.',
      features: [
        'Programa intensivo de 3 sesiones',
        'Coaching ejecutivo especializado',
        'Técnicas avanzadas de comunicación',
        'Seguimiento y mentoría continua'
      ],
      message: whatsappMessages.coachPasoFino,
      icon: '👑'
    }
  ]

  return (
    <section id="coaching" className="py-20 relative overflow-hidden">
      {/* High-Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#5E9E16_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 mix-blend-multiply z-0" />
      
      {/* Micro-Decal / HUD Coordinates */}
      <div className="absolute top-12 left-8 font-mono text-[10px] tracking-widest text-text/30 select-none pointer-events-none z-10 hidden md:block">
        MODE: <span className="text-secondary font-bold">#BIO_FEEDBACK</span> | STATUS: ACTIVE
      </div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Coach Equino: El Espejo del Alma
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-organic-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🐎</span>
                  </div>
                </div>
                <p className="text-white/90 font-body italic text-lg leading-relaxed-custom">
                  "Hola, soy tu guía en este proceso. Los caballos no juzgan, solo reflejan quién sos hoy para ayudarte a ser quien querés ser mañana."
                </p>
              </div>
              <p className="text-white/80 font-body leading-relaxed-custom">
                Una metodología vivencial para reconocer patrones, fortalecer el liderazgo y mejorar la gestión emocional. 
                El caballo, con su sensibilidad única, actúa como un facilitador natural bajo nuestra filosofía de "verse al espejo".
              </p>
            </div>
          </motion.div>
        </div>

        {/* Interactive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10 px-4">
          {/* Dashboard Nav Controllers - Left Col */}
          <div className="space-y-4 flex flex-col justify-center">
            {plans.map((plan, index) => (
              <motion.button
                key={plan.id}
                onClick={() => setActiveIndex(index)}
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full glass-organic rounded-2xl p-6 text-left transition-all duration-500 flex items-center space-x-4 group border relative overflow-hidden backdrop-blur-md ${
                  activeIndex === index 
                    ? 'border-secondary/60 bg-white/10 shadow-lg shadow-secondary/10' 
                    : 'border-white/10 hover:border-accent/40 bg-white/5'
                }`}
              >
                {/* Active Indicator Tech Line */}
                {activeIndex === index && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-secondary shadow-[0_0_10px_#FFA600]"
                  />
                )}
                <span className={`text-4xl transition-transform duration-500 ${activeIndex === index ? 'scale-110 rotate-6' : 'group-hover:rotate-6'}`}>
                  {plan.icon}
                </span>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg text-white group-hover:text-secondary transition-colors">
                    {plan.title.split(' ').slice(-1)[0]}
                  </h4>
                  <p className="text-xs text-white/60 font-mono">
                    {plan.subtitle.split(' - ')[1]}
                  </p>
                </div>
                <div className={`text-secondary transition-all duration-300 ${activeIndex === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                  →
                </div>
              </motion.button>
            ))}
          </div>

          {/* Dashboard Dynamic Viewer Pane - Right Cols */}
          <div className="lg:col-span-2 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={plans[activeIndex].id}
                data-atmosphere={plans[activeIndex].atmosphere}
                initial={{ opacity: 0, x: 30, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="glass-organic rounded-3xl p-8 md:p-12 relative overflow-hidden hover:shadow-2xl transition-all duration-700 h-full flex flex-col justify-center border border-white/10"
              >
                {/* Tech HUD Accents inside Card */}
                <div className="absolute top-6 right-6 font-mono text-[10px] tracking-widest text-white/30 select-none">
                  PLAN_ID: <span className="text-secondary uppercase">#{plans[activeIndex].id}</span>
                </div>
                
                {/* Background Index Decorator */}
                <div className="absolute -top-12 -left-8 text-[14rem] font-display font-bold text-white/5 select-none pointer-events-none z-0">
                  0{activeIndex + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10 h-full">
                  {/* Content View */}
                  <div className="flex flex-col justify-center h-full">
                    <div className="flex items-center mb-4">
                      <span className="text-5xl mr-4">{plans[activeIndex].icon}</span>
                      <div>
                        <h3 className="font-display text-4xl font-semibold text-white mb-1">
                          {plans[activeIndex].title}
                        </h3>
                        <p className="text-white/80 font-heading font-semibold text-sm">
                          {plans[activeIndex].subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-white/90 font-body text-base mb-6 leading-relaxed-custom">
                      {plans[activeIndex].description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {plans[activeIndex].features.map((feature: string, fIndex: number) => (
                        <motion.li
                          key={fIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + fIndex * 0.1 }}
                          className="flex items-center text-white/80 font-body text-sm"
                        >
                          <span className="w-2 h-2 bg-secondary rounded-full mr-3 shadow-[0_0_8px_#FFA600]" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    <motion.a
                      href={generateWhatsAppLink(plans[activeIndex].message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-3 bg-secondary hover:bg-white text-text hover:text-accent px-6 py-4 rounded-organic font-heading font-semibold transition-all duration-300 hover:shadow-xl w-fit"
                    >
                      <span>💬</span>
                      <span>Elegir {plans[activeIndex].title.split(' ').slice(-1)[0]}</span>
                    </motion.a>
                  </div>

                  {/* Visual Node Element View with Orbit Connectors */}
                  <div className="flex justify-center items-center">
                    <div className="relative aspect-square w-full max-w-[260px] flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-secondary/20 rounded-full border-dashed"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border border-white/10 rounded-full border-dotted"
                      />
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [0.95, 1, 0.95] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-10 organic-fluid glass-organic flex flex-col items-center justify-center cursor-pointer group hover:scale-105 transition-transform duration-500 shadow-inner border border-white/20"
                      >
                        <span className="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                          {plans[activeIndex].icon}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoachEquino