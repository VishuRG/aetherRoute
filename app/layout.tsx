import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { WhatsAppPopup } from '@/components/whatsapp-popup';
import { DownloadAppPopup } from '@/components/download-app-popup';
import { AIAssistantPopup } from '@/components/ai-assistant-popup';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ecoroute.app'),
  title: 'EcoRoute — Travel Smarter. Travel Greener.',
  description:
    'One intelligent platform to compare routes, costs, emissions and real-time travel conditions across Delhi-NCR.',
  openGraph: {
    title: 'EcoRoute — Travel Smarter. Travel Greener.',
    description:
      'Real-time multimodal travel intelligence for Delhi-NCR. Compare routes, costs, emissions and more.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <WhatsAppPopup />
        <DownloadAppPopup />
        <AIAssistantPopup />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
