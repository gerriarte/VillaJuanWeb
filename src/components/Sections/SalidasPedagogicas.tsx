'use client'

import { motion } from 'framer-motion'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const SalidasPedagogicas = () => {
  const activities = [
    {
      title: 'Bicipaseos Ecológicos',
      description: 'Recorridos guiados por senderos naturales con paradas educativas sobre flora y fauna local.',
      icon: '🚴',
      duration: '3 horas',
      ages: '8+ años'
    },
    {
      title: 'Caminatas de Observación',
      description: 'Exploración de ecosistemas locales con identificación de especies y técnicas de conservación.',
      icon: '🥾',
      duration: '2 horas',
      ages: '6+ años'
    },
    {
      title: 'Talleres de Siembra',
      description: 'Experiencia práctica en agricultura orgánica, desde la preparación del suelo hasta la cosecha.',
      icon: '🌱',
      duration: '4 horas',
      ages: '5+ años'
    },
    {
      title: 'Programas de Forestación',
      description: 'Participación activa en reforestación con especies nativas y educación ambiental.',
      icon: '🌳',
      duration: '5 horas',
      ages: '10+ años'
    }
  ]

  const benefits = [
    'Aprendizaje vivencial fuera del aula',
    'Conexión directa con la naturaleza',
    'Desarrollo de conciencia ambiental',
    'Trabajo en equipo y liderazgo',
    'Actividades adaptadas por edades',
    'Material educativo incluido'
  ]

  return (
    <section id="salidas" className="py-20 bg-gradient-to-br from-atmosphere-trote/10 to-primary relative overflow-hidden">
      {/* High-Tech Dot-Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#5E9E16_1px,transparent_1px)] bg-[size:24px_24px] opacity-5 mix-blend-multiply z-0" />
      
      {/* Micro-Decal / HUD Coordinates */}
      <div className="absolute top-12 left-8 font-mono text-[10px] tracking-widest text-text/30 select-none pointer-events-none z-10 hidden md:block">
        ECO_SYS: <span className="text-secondary font-bold">#FLORA_FAUNA</span> | REGEN_RATE: 94%
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
            Aprender
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mb-6 relative z-10">
            Aprender con los Pies en la Tierra
          </h2>
          <p className="font-body text-lg text-text/80 max-w-3xl mx-auto leading-relaxed-custom">
            Transformamos la teoría en vivencias. Desde bicipaseos y caminatas hasta programas de forestación y siembra. 
            Un espacio seguro en Tenjo donde las instituciones educativas encuentran el equilibrio entre aventura y aprendizaje ambiental.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-organic rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group cursor-pointer relative overflow-hidden transform ${
                index % 2 === 0 ? 'md:-translate-y-2 md:rotate-1' : 'md:translate-y-2 md:-rotate-1'
              }`}
            >
              <div className="absolute -top-10 -right-10 text-[10rem] font-display font-bold text-accent/5 select-none pointer-events-none z-0">
                {index + 1}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start mb-4">
                  <span className="text-4xl mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    {activity.icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold text-text mb-2">
                      {activity.title}
                    </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-atmosphere-trote/20 text-atmosphere-trote px-3 py-1 rounded-full text-sm font-body">
                      ⏱️ {activity.duration}
                    </span>
                    <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-body">
                      👥 {activity.ages}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-body text-text/80 leading-relaxed-custom">
                {activity.description}
              </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-organic bg-atmosphere-trote/10 rounded-3xl p-8 mb-12 border-none"
        >
          <h3 className="font-heading text-2xl font-semibold text-text mb-6 text-center">
            Beneficios Educativos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center text-text/90 font-body"
              >
                <span className="w-2 h-2 bg-atmosphere-trote rounded-full mr-3 flex-shrink-0" />
                {benefit}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Safety & Logistics */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <div className="glass-organic rounded-2xl p-6 hover:shadow-xl transition-shadow duration-500">
            <h4 className="font-heading text-xl font-semibold text-text mb-4 flex items-center">
              <span className="mr-3">🛡️</span>
              Seguridad Garantizada
            </h4>
            <ul className="space-y-2 font-body text-text/80">
              <li>• Guías certificados en primeros auxilios</li>
              <li>• Equipos de seguridad incluidos</li>
              <li>• Seguros de responsabilidad civil</li>
              <li>• Protocolos de emergencia establecidos</li>
            </ul>
          </div>
          
          <div className="glass-organic rounded-2xl p-6 hover:shadow-xl transition-shadow duration-500">
            <h4 className="font-heading text-xl font-semibold text-text mb-4 flex items-center">
              <span className="mr-3">📋</span>
              Logística Completa
            </h4>
            <ul className="space-y-2 font-body text-text/80">
              <li>• Transporte desde Bogotá disponible</li>
              <li>• Refrigerios y almuerzo incluidos</li>
              <li>• Material didáctico personalizado</li>
              <li>• Certificados de participación</li>
            </ul>
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
            href={generateWhatsAppLink(whatsappMessages.salidas)}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-3 bg-atmosphere-trote hover:bg-atmosphere-trote/80 text-white px-8 py-4 rounded-organic-lg font-heading font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>🎒</span>
            <span>Planear salida escolar</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default SalidasPedagogicas