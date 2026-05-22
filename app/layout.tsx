import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invite.nexfluence.eu"),

  title: "Nex · You're Invited — May 28, 2026",

  description:
    "A private gathering for the Baltics' next generation of creators. By invitation only. 100 seats.",

  openGraph: {
    title: "You're Invited · Creator Nexus",

    description:
      "May 28 · Riga, Latvia · A private gathering for the Baltics' next generation of creators.",

    url: "https://invite.nexfluence.eu",

    siteName: "Nex",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/Event Place.webp",
        width: 1200,
        height: 630,
        alt: "You're Invited — Creator Nexus",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "You're Invited · Creator Nexus",

    description:
      "May 28 · Riga, Latvia · Invitation only · 100 seats",

    images: ["/Event Place.webp"],
  },

  alternates: {
    canonical: "https://invite.nexfluence.eu",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.variable}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K5Z3FTDGZP"
          strategy="afterInteractive"
        />

        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-K5Z3FTDGZP');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1719750505873027');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>

      <body>{children}</body>
    </html>
  );
}