import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScrumMate - Tu asistente de Scrum',
  description: 'Asistente virtual para equipos Scrum',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
