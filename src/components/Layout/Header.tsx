'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { generateWhatsAppLink, whatsappMessages } from '@/lib/utils'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { href: '#eventos', label: 'Eventos' },
    { href: '#restaurante', label: 'Restaurante' },
    { href: '#salidas', label: 'Salidas Pedagógicas' },
    { href: '#coaching', label: 'Coach Equino' },
    { href: '#contacto', label: 'Contacto' },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 bg-transparent"
      >
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group z-50">
            <div className="relative w-20 h-20 bg-surface_container_lowest rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 p-2 border-2 border-primary/20 transform hover:scale-110">
              <div className="relative w-full h-full">
                <Image 
                  src="/VillaJuanLogo.png" 
                  alt="Villa Juan Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Floating Burger Trigger - Always visible */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="z-50 flex flex-col items-center justify-center w-14 h-14 bg-white hover:bg-surface_container_low rounded-full shadow-lg border border-primary/10 transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col space-y-1.5 w-6">
              <motion.span
                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7.5 : 0 }}
                className="block w-6 h-0.5 bg-primary group-hover:bg-secondary transition-all"
              />
              <motion.span
                animate={{ opacity: isMenuOpen ? 0 : 1 }}
                className="block w-6 h-0.5 bg-primary group-hover:bg-secondary transition-all"
              />
              <motion.span
                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7.5 : 0 }}
                className="block w-6 h-0.5 bg-primary group-hover:bg-secondary transition-all"
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 pointer-events-auto"
            />

            {/* Sidebar with Accent Color (Yellow typical of the style) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: "easeInOut", duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[350px] md:w-[450px] bg-[#FFF200] z-40 shadow-2xl flex flex-col p-8 pt-28 pointer-events-auto"
            >
              {/* Decorative Floating Asset backing the menu style */}
              <div className="absolute inset-0 bg-[radial-gradient(#00C2E0_2px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />

              <nav className="flex flex-col space-y-4 font-display font-black text-2xl md:text-3xl text-on_surface uppercase mt-12 relative z-10 px-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    className="group"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-block relative transition-all duration-300 transform group-hover:scale-105 group-hover:-rotate-2 text-[#1a1a1a] hover:text-[#00C2E0]"
                    >
                      <span className="relative">
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#00C2E0] transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto border-t border-[#1a1a1a]/10 pt-6 px-4 relative z-10">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/60">Síguenos</p>
                <div className="flex items-center space-x-4 mt-3 text-[#1a1a1a]">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00C2E0] transition-all transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00C2E0] transition-all transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00C2E0] transition-all transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 1 4 4H9"/> <path d="M13 16V4a4 4 0 0 0 4 4"/></svg>
                  </a>
                </div>
                
                {/* CTA Button Inside Sidebar */}
                <motion.a
                  href={generateWhatsAppLink(whatsappMessages.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-body font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 mt-6 uppercase tracking-wider"
                >
                  <span>Reservar</span>
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header