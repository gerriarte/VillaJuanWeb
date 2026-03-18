'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const Footer = () => {
  return (
    <footer className="bg-text text-primary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-14 h-14 bg-white rounded-2xl p-2 flex items-center justify-center">
                <Image 
                  src="/VillaJuanLogo.png" 
                  alt="Villa Juan Logo" 
                  fill 
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">Villa Juan</h2>
                <p className="text-secondary font-heading text-sm">Ecogranja Tenjo, Cundinamarca</p>
              </div>
            </div>
            <p className="text-primary/80 font-body mb-4 max-w-md">
              Un espacio donde el aire de Tenjo se mezcla con el aroma del barril y la sabiduría de los caballos. 
              Más que una visita, es una pausa necesaria.
            </p>
            <motion.a
              href={generateWhatsAppLink(whatsappMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-organic font-heading font-semibold transition-all duration-300"
            >
              <span>💬</span>
              <span>Contáctanos por WhatsApp</span>
            </motion.a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li><Link href="#eventos" className="text-primary/80 hover:text-primary transition-colors">Eventos</Link></li>
              <li><Link href="#restaurante" className="text-primary/80 hover:text-primary transition-colors">Restaurante</Link></li>
              <li><Link href="#salidas" className="text-primary/80 hover:text-primary transition-colors">Salidas Pedagógicas</Link></li>
              <li><Link href="#coaching" className="text-primary/80 hover:text-primary transition-colors">Coach Equino</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contacto</h3>
            <div className="space-y-2 text-primary/80">
              <p>📍 Tenjo, Cundinamarca</p>
              <p>📧 gerencia@villa-juan.com</p>
              <p>📱 +57 320 868 9681</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary/60 text-sm font-body">
            © 2026 Villa Juan Ecogranja. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-primary/60 hover:text-primary text-sm transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="#" className="text-primary/60 hover:text-primary text-sm transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer