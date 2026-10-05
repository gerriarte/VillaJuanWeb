// Copia al sitio, en el build, los PDF que viven en Directus (planes y menú).
// Así el visor los embebe desde el MISMO origen (sin CORS ni frame-ancestors del CMS)
// y la URL es del sitio: /pdf/villa-plan-trote.pdf, /pdf/menu.pdf.
// Solo se generan los que vienen del CMS; los de la semilla local los sirve astro:assets.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPlanes, getMenuPdf } from '../../lib/planes';
import { assetRaw } from '../../lib/directus';

export const getStaticPaths = (async () => {
  const refs = [
    ...(await getPlanes()).map((p) => p.pdf),
    await getMenuPdf(),
  ].filter((r) => r?.cmsId);
  return refs.map((r) => ({
    params: { name: r!.url.replace(/^\/pdf\//, '') },
    props: { id: r!.cmsId! },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const res = await fetch(assetRaw(props.id as string));
  if (!res.ok) throw new Error(`PDF ${props.id}: Directus respondió ${res.status}`);
  return new Response(await res.arrayBuffer(), { headers: { 'Content-Type': 'application/pdf' } });
};
