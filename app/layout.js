import './globals.css'
import { melodrama, manrope } from '@/Components/Utilities/Fonts/fonts';


export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            dir="ltr"
            className={`${manrope.variable} ${melodrama.variable}`}
        >
            <body className="min-h-screen flex flex-col">
                {children}
            </body>
        </html>
    )
}