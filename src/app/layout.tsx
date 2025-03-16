import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/toaster";

export const metadata = {
  title: "Thyrocare | Diagnostic & Preventive Health Care Industry in India",
  description: "Thyrocare is one of the leading Diagnostic industry looking at Preventive healthcare with an aim to provide health checkup at your doorsteps",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
