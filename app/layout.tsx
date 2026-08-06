import './globals.css';

export const metadata = {
  title: 'Yaoundé Propre',
  description: 'Application de signalement citoyen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
