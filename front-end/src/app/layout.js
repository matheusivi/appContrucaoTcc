import "./globals.css";
import { Be_Vietnam_Pro, Noto_Sans } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-bevietnam",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
});

export const metadata = { title: "BuildTrack" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${beVietnam.variable} ${noto.variable} font-sans bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
