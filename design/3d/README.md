# Pipeline 3D → sprite sheet (offline)

Convierte un `.glb` en un **sprite sheet de frames** que el sitio muestra girando con el
scroll (`src/components/ui/SombreroTurntable.astro`). El modelo NO se publica: el `.glb`
del sombrero pesa 20 MB (57k triángulos + 10 texturas sin comprimir) y el sitio sirve
~330 KB de imagen. Cero WebGL y cero librería 3D en runtime.

Esto corre **a mano, solo cuando cambia el modelo**. No está enganchado a `pnpm build`.

## Requisitos

- Node 22+, Chrome de escritorio instalado (se usa headless para rasterizar).
- `npm install` dentro de esta carpeta (three + puppeteer-core, solo para el render).
- El `.glb` fuente en esta carpeta (no se versiona: es pesado).

## Uso

```bash
cd design/3d
npm install

# 1) 36 frames PNG con alpha, giro completo en Y. Tarda unos minutos (swiftshader).
node render.mjs --model sobrero_villajuan.glb --frames 36 --size 800 --elev 20

# 2) recorte del margen común + sprite sheet 6×6 en WebP y AVIF
node sprite.mjs --frame-width 480 --quality 62   # → out/sombrero-sprite.webp
node sprite.mjs --frame-width 480 --quality 52   # → out/sombrero-sprite.avif (mejor a q menor)

# 3) publicar
cp out/sombrero-sprite.webp ../../public/3d/
cp out/sombrero-sprite.avif ../../public/3d/
```

`sprite.mjs` imprime la geometría final (`frameW`, `frameH`, `cols`, `rows`). Si cambia,
hay que actualizar esas constantes en `SombreroTurntable.astro` — el componente las usa
para el `aspect-ratio` y para el desplazamiento del sheet.

## Notas

- `--elev` es la altura de cámara en grados: 20° deja ver copa y ala. A 0° el sombrero se
  lee como una mancha.
- `sprite.mjs` recorta una caja **simétrica respecto al centro** del render: así el eje de
  giro queda centrado y la rotación no cabecea. `--pad` deja aire transparente dentro de
  cada celda para que el frame vecino no asome por redondeo de subpíxeles.
- Más frames = giro más suave y más peso. 36 (10°/frame) es el equilibrio elegido.
- Verificación: `node verify.mjs` (con `pnpm preview` corriendo) scrollea la home en
  headless y reporta el frame activo en desktop y mobile.
