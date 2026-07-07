# Imágenes del sitio — dónde y cómo dejarlas

## Regla de oro
Deja cada imagen en la subcarpeta de su sección. **Aparece sola**, sin tocar código:
Astro la optimiza (AVIF/WebP, responsive, lazy) y el componente reemplaza el placeholder gris.

- Formatos: `.webp`, `.avif`, `.png`, `.jpg` (idealmente `.webp`/`.avif` por peso/CWV).
- El nombre **ignora mayúsculas, acentos, espacios y guiones**. Da igual
  `Cumpleaños_Villa_Juan.png`, `cumpleanos-villa-juan.webp` o `CUMPLEANOSVILLAJUAN.avif`.
- Si el archivo no existe todavía, se muestra el placeholder gris (nada se rompe).

## Nombres esperados por carpeta (los que ya están cableados)

### celebraciones/
`Cumpleaños_Villa_Juan` · `XV_Anos_y_Grados` · `Bodas_Campestres` · `Reencuentros_Familiares` · `Primeras_comuniones`

### empresas/
`dia_de_la_familia` · `Fiestas_de_fin` · `Fiestas_de_Halloween` · `Festival_de_cometas`
`Bicipaseos_Villa_Juan` · `Caminatas_de_observacion` · `Talleres_de_siembra`

### colegios/
`Granjeritos_por_un_dia` · `Exploradores_por_un_dia` · `Agricultor_por_un_dia` · `Ecologista_por_un_dia`

### gastronomia/
`Seleccion_y_Maduracion` · `Sazonado_Artesanal` · `Coccion_al_barril` · `Espectaculo_en_vivo`

### home/ y villa-planes/ y shared/
Imágenes de hero, banners y fondos (Asador, Bienvenida, hojas de fondo, etc.).
Estas van cableadas a mano cuando lleguen — avísame y las conecto (hero, carrusel, secciones full-bleed).

## ¿Cómo se referencia en código?
Vía `img('Nombre')` de `src/lib/images.ts`. Los componentes `ServiceCard` e `InfoCard`
aceptan `imageName="Nombre"` y resuelven solos.
