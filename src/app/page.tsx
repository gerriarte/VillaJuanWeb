'use client'

import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import AtmosphereBackground from '@/components/AtmosphereBackground'
import Hero from '@/components/Sections/Hero'
import Eventos from '@/components/Sections/Eventos'
import Restaurante from '@/components/Sections/Restaurante'
import SalidasPedagogicas from '@/components/Sections/SalidasPedagogicas'
import CoachEquino from '@/components/Sections/CoachEquino'
import Contacto from '@/components/Sections/Contacto'
import Blog from '@/components/Sections/Blog'
import DatosCuriosos from '@/components/Sections/DatosCuriosos'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Dynamic Atmosphere Background */}
      <AtmosphereBackground />
      
      {/* Fixed Header */}
      <Header />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* Villa Datos Curiosos - Stats Section */}
        <DatosCuriosos />
        
        {/* Service Sections - Following priority order from content.md */}
        <Eventos />
        <Restaurante />
        <SalidasPedagogicas />
        
        {/* Coach Equino - Special section with atmosphere transitions */}
        <CoachEquino />
        
        {/* Blog Section */}
        <Blog />
        
        {/* Contact Section */}
        <Contacto />
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}