import { AppContextProvider } from "@/context/app.context";
import { Metadata } from "next";

// styles
import "@/style/globals.css";
import "@/style/main.scss";
import { Providers } from "@/app/providers";
import siteConfig from "@/config/siteConfig.json";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: siteConfig.site_info.title,
    template: `%s - ${siteConfig.site_info.title}`,
  },
  description: siteConfig.site_info.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        dir="ltr"
        className="root-layout"
        theme-setting="style-12"
      >
        <AppContextProvider>
          <Providers>
            <div className="has-smooth" id="has_smooth"></div>
            {children}
            <Toaster richColors={true} position="top-right" closeButton />
          </Providers>
        </AppContextProvider>
      </body>
    </html>
  );
}
