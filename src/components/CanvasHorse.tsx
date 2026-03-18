'use client'

import React, { useEffect, useRef } from 'react'

const CanvasHorse = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const points: { x: number; y: number }[] = []

    // Set Dimensions
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 500
      canvas.height = canvas.parentElement?.clientHeight || 500
    }
    resize()
    window.addEventListener('resize', resize)

    // Load Image Silhouette 
    const img = new Image()
    img.src = '/horse_silhouette.png'
    img.onload = () => {
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return
      const sampleWidth = 250
      const sampleHeight = 180
      tempCanvas.width = sampleWidth
      tempCanvas.height = sampleHeight
      tempCtx.drawImage(img, 0, 0, sampleWidth, sampleHeight)
      try {
        const data = tempCtx.getImageData(0, 0, sampleWidth, sampleHeight).data
        
        for (let y = 0; y < sampleHeight; y += 4) { // Slightly optimized step from 3 to 4
          for (let x = 0; x < sampleWidth; x += 4) {
            const index = (y * sampleWidth + x) * 4
            const r = data[index]
            if (r < 50) { // Black silhouette pixel
              points.push({ x: x - sampleWidth / 2, y: y - sampleHeight / 2 })
            }
          }
        }
      } catch (e) {
        console.error("CanvasHorse: Failed to load particle mesh", e)
      }
    }

    // Particle Structure
    class Particle {
      x: number; y: number; homeX: number; homeY: number; vx: number; vy: number; life: number; color: string; size: number;
      constructor(hx: number, hy: number) {
        this.homeX = hx
        this.homeY = hy
        this.x = hx
        this.y = hy
        this.vx = 0
        this.vy = 0
        this.life = Math.random() * 100
        this.color = Math.random() > 0.85 ? '#FFA600' : '#5E9E16' // Secondary / Primary
        this.size = Math.random() * 1.8 + 0.6
      }
      update(time: number, cx: number, cy: number, scale: number) {
        // Continuous running effect - Slight vibration + drift
        const wave = Math.sin(time * 5 + this.homeX * 0.05) * 3
        const gallop = Math.sin(time * 8) * 4 
        
        this.x = cx + this.homeX * scale + wave + Math.cos(time + this.homeY*0.05)*2
        this.y = cy + this.homeY * scale + gallop + Math.sin(time * 10 + this.homeX * 0.02)*1.5

        if (Math.random() > 0.96) {
          this.x -= Math.random() * 60 // larger drift back
        }
      }
      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    let time = 0

    const checkInit = () => {
      if (points.length > 0 && particles.length === 0) {
        for (let i = 0; i < points.length; i++) {
          particles.push(new Particle(points[i].x, points[i].y))
        }
      }
    }

    const render = () => {
      time += 0.04
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      checkInit()

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const scale = canvas.width > 768 ? 3.5 : 2 // dynamic scale

      // Update and Draw
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time, cx, cy, scale)
        particles[i].draw()
      }

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" 
    />
  )
}

export default CanvasHorse
