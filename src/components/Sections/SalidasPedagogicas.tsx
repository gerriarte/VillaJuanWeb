'use client'

import { motion } from 'framer-motion'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const SalidasPedagogicas = () => {
  const activities = [
    {
      title: 'Bicipaseos Ecológicos',
      description: 'Recorridos guiados por senderos naturales con paradas educativas sobre flora y fauna local.',
      image: '/images/salidas/bicipaseos.png',
      duration: '3 horas',
      ages: '8+ años'
    },
    {
      title: 'Caminatas de Observación',
      description: 'Exploración de ecosistemas locales con identificación de especies y técnicas de conservación.',
      image: '/images/salidas/caminatas.png',
      duration: '2 horas',
      ages: '6+ años'
    },
    {
      title: 'Talleres de Siembra',
      description: 'Experiencia práctica en agricultura orgánica, desde la preparación del suelo hasta la cosecha.',
      image: '/images/salidas/talleres.png',
      duration: '4 horas',
      ages: '5+ años'
    },
    {
      title: 'Programas de Forestación',
      description: 'Participación activa en reforestación con especies nativas y educación ambiental.',
      image: '/images/salidas/forestacion.png',
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
    <section id="salidas" className="py-20 bg-transparent relative overflow-hidden">
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
            Aprender
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-on_surface mb-4 relative z-10">
            Aprender con los Pies en la Tierra
          </h2>
          <div className="flex justify-center mb-6 relative z-10">
            <img src="/VillaJuanLogo.png" className="h-12 w-12 object-contain rounded-full bg-surface_container_low p-1.5 shadow-sm border border-primary/20" alt="Villa Juan" />
          </div>
          <p className="font-body text-lg text-on_surface/80 max-w-3xl mx-auto leading-relaxed-custom">
            Transformamos la teoría en vivencias. Desde bicipaseos y caminatas hasta programas de forestación y siembra. 
            Un espacio seguro en Tenjo donde las instituciones educativas encuentran el equilibrio entre aventura y aprendizaje ambiental.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 px-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-organic rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col h-full border-4 border-primary/20 ${
                index % 2 === 0 ? '-rotate-1 hover:rotate-0' : 'rotate-1 hover:rotate-0'
              }`}
            >
              <div className="relative z-10 w-full aspect-video rounded-xl overflow-hidden mb-5 bg-surface_container_low shadow-md">
                <img 
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // fallback
                  }}
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="font-display font-black text-xl text-on_surface mb-2 uppercase tracking-tight group-hover:text-[#00C2E0] transition-colors">
                  {activity.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-body font-bold">
                    ⏱️ {activity.duration}
                  </span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-body font-bold">
                    👥 {activity.ages}
                  </span>
                </div>

                <p className="font-body text-on_surface/80 leading-relaxed-custom mt-1 flex-1">
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
          className="bg-surface_container_lowest rounded-lg p-8 mb-12 shadow-ambient"
        >
          <h3 className="font-body text-2xl font-semibold text-on_surface mb-6 text-center">
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
                className="flex items-center text-on_surface/90 font-body"
              >
                <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
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
          <div className="bg-surface_container_lowest rounded-lg p-6 shadow-ambient transition-shadow duration-500">
            <h4 className="font-body text-xl font-semibold text-on_surface mb-4 flex items-center">
              <span className="mr-3">🛡️</span>
              Seguridad Garantizada
            </h4>
            <ul className="space-y-2 font-body text-on_surface/80">
              <li>• Guías certificados en primeros auxilios</li>
              <li>• Equipos de seguridad incluidos</li>
              <li>• Seguros de responsabilidad civil</li>
              <li>• Protocolos de emergencia establecidos</li>
            </ul>
          </div>
          
          <div className="bg-surface_container_lowest rounded-lg p-6 shadow-ambient transition-shadow duration-500">
            <h4 className="font-body text-xl font-semibold text-on_surface mb-4 flex items-center">
              <span className="mr-3">📋</span>
              Logística Completa
            </h4>
            <ul className="space-y-2 font-body text-on_surface/80">
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
            className="inline-flex items-center space-x-3 btn-satin px-8 py-4 text-lg"
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