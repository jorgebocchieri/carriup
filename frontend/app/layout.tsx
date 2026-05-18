import './globals.css'

export const metadata = {
  title: 'Carriup — Comparador de Precios',
  description: 'Compara precios de supermercados y ahorra dinero',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-purple-600 to-purple-800 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  )
}
