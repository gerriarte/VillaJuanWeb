'use client'

import { motion } from 'framer-motion'
import { useAtmosphereScroll } from '@/lib/hooks'
import { atmosphereColors } from '@/lib/utils'

const AtmosphereBackground = () => {
  const currentAtmosphere = useAtmosphereScroll()
  
  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      animate={{
        backgroundColor: atmosphereColors[currentAtmosphere as keyof typeof atmosphereColors] || atmosphereColors.default
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut"
      }}
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 paper-texture opacity-30" />
      
      {/* Gradient overlay for depth */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: currentAtmosphere === 'default' 
            ? 'radial-gradient(circle at 50% 50%, rgba(249, 244, 240, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.1) 0%, transparent 70%)'
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut"
        }}
      />
      {/* Ambient Floating Orbs for Immersion */}
      {[
        { size: 'w-72 h-72', top: '15%', left: '10%', speed: 7 },
        { size: 'w-64 h-64', top: '65%', left: '75%', speed: 9 },
        { size: 'w-40 h-40', top: '35%', left: '85%', speed: 6 },
        { size: 'w-56 h-56', top: '80%', left: '20%', speed: 8 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.size} rounded-full blur-3xl opacity-10 mix-blend-screen pointer-events-none`}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            y: { duration: orb.speed, repeat: Infinity, ease: "easeInOut" },
            x: { duration: orb.speed + 1, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: orb.speed * 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ 
            top: orb.top, 
            left: orb.left,
            backgroundColor: currentAtmosphere === 'trocha' 
              ? '#FF6B6B' 
              : currentAtmosphere === 'trote' 
                ? '#51CF66' 
                : currentAtmosphere === 'paso-fino' 
                  ? '#FCC419' 
                  : '#FFFFFF'
          }}
        />
      ))}
    </motion.div>
  )
}

export default AtmosphereBackground