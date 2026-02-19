import type { Metadata } from "next";
import { Archivo, Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Dirty Deedz — Down & Dirty Advertising",
  description: "Sidewalk and wall advertising platform. Guerrilla marketing meets clean streets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${roboto.variable} ${robotoSlab.variable}`}>
        {children}
      </body>
    </html>
  );
}
