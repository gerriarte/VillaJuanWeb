import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// WhatsApp message generator
export const generateWhatsAppLink = (message: string) => {
  const baseURL = "https://wa.me/573208689681"
  const encodedMessage = encodeURIComponent(message)
  return `${baseURL}?text=${encodedMessage}`
}

// WhatsApp messages from content.md
export const whatsappMessages = {
  general: "Hola Villa Juan, vengo de la web y quiero más información.",
  eventos: "Hola Villa Juan, me interesa recibir una propuesta para un evento en la granja.",
  restaurante: "Hola, quiero reservar una mesa. Vi el menú al barril en la web.",
  salidas: "Hola, quiero información sobre las salidas pedagógicas para mi institución.",
  coachTrote: "Hola, me interesa el Villa Plan Trote (Verde) de Coaching Equino.",
  coachTrocha: "Hola, quiero info del Villa Plan Trocha (Rojo) de Coaching Equino.",
  coachPasoFino: "Hola, me interesa el Villa Plan Paso Fino (Amarillo) de Coaching Equino.",
}

// Scroll utilities for atmosphere transitions
export const getScrollProgress = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const elementHeight = rect.height
  
  // Calculate how much of the element is visible
  const visibleTop = Math.max(0, -rect.top)
  const visibleBottom = Math.min(elementHeight, windowHeight - rect.top)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)
  
  return visibleHeight / elementHeight
}

// Atmosphere color mapping
export const atmosphereColors = {
  default: '#FEF7FF', // Surface
  trote: '#256D00', // Primary (Deep Moss)
  trocha: '#8D4F00', // Secondary (Burnished Clay)
  'paso-fino': '#934B19', // Tertiary (Aged Wood)
} as const

export type AtmosphereType = keyof typeof atmosphereColors