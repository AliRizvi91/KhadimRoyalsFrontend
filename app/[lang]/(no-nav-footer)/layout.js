
import { melodrama, manrope } from '@/Components/Utilities/Fonts/fonts';
import ClientLayout from '@/Components/Main/ClientLayout';
import '../../globals.css'


export const metadata = {
  title: 'Khadim Royals',
  description: 'Luxury hotel experience with premium services',
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      className={`${manrope.variable} ${melodrama.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}