import type { Metadata } from "next";
import { Montserrat, Baloo_2 } from "next/font/google";
import { ApolloProvider } from "../lib/apollo-provider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Viraaj Seller Central",
  description: "Seller central dashboard for Viraaj ecommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} ${baloo.variable} antialiased`}>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
