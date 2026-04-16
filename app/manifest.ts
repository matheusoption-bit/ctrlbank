import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CtrlBank Premium',
    short_name: 'CtrlBank',
    description: 'Gestão Financeira Premium',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    // @ts-ignore - share_target is valid in W3C manifest but may not be typed fully in Next.js 14
    share_target: {
      action: '/share',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'image',
            accept: ['image/*', 'application/pdf', 'text/csv']
          }
        ]
      }
    }
  }
}

