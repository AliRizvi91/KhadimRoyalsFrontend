import '../../globals.css';
import ClientLayout from '@/Components/Main/ClientLayout';

export const metadata = {
  title: 'Khadim Royals Dashboard',
  description: 'Luxury hotel experience with premium services',
};

export default function RootLayout({ children }) {
  return (
    <body className={`min-h-screen flex flex-col`}>
      <ClientLayout>
        {children}
      </ClientLayout>
    </body>
  );
}