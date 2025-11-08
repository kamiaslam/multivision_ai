import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import AppProtection from "@/components/AppProtection";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Google Fonts - Rajdhani for headings & IBM Plex Sans for body */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                {/* Description no longer than 155 characters */}
                <meta
                    name="description"
                    content="Dashboard - AI-Powered Voice Communication Platform"
                />
                {/* Product Name */}
                <meta
                    name="voiceckae.io"
                    content="Dashboard"
                />
                {/* Twitter Card data */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@voicecake" />
                <meta
                    name="twitter:title"
                    content="Dashboard"
                />
                <meta
                    name="twitter:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
                <meta name="twitter:creator" content="@voicecake" />
                <meta
                    name="twitter:image"
                    content="%PUBLIC_URL%/twitter-card.png"
                />
                {/* Open Graph data for Facebook */}
                <meta
                    property="og:title"
                    content="Dashboard"
                />
                <meta property="og:type" content="Article" />
                <meta
                    property="og:url"
                    content="https://voicecake.com/dashboard"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/fb-og-image.png"
                />
                <meta
                    property="og:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
                <meta
                    property="og:site_name"
                    content="Dashboard"
                />
                <meta property="fb:admins" content="132951670226590" />
                {/* Open Graph data for LinkedIn */}
                <meta
                    property="og:title"
                    content="Dashboard"
                />
                <meta
                    property="og:url"
                    content="https://voicecake.com/dashboard"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/linkedin-og-image.png"
                />
                <meta
                    property="og:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
                {/* Open Graph data for Pinterest */}
                <meta
                    property="og:title"
                    content="Dashboard"
                />
                <meta
                    property="og:url"
                    content="https://voicecake.com/dashboard"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/pinterest-og-image.png"
                />
                <meta
                    property="og:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
            </head>
            <body
                className="bg-b-surface1 text-body-1 text-t-primary antialiased"
            suppressHydrationWarning>
                <Providers>
                    <AppProtection>
                        {children}
                    </AppProtection>
                    <Toaster 
                        position="top-right" 
                        richColors
                        expand={true}
                        closeButton={true}
                        duration={5000}
                        toastOptions={{
                            style: {
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(229, 231, 235, 0.6)',
                                borderRadius: '12px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                color: '#111827',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '16px 20px',
                                maxWidth: '400px',
                                backdropFilter: 'blur(8px)',
                            },
                            className: 'toast-modern',
                            classNames: {
                                title: 'text-gray-900 dark:text-gray-100 font-semibold',
                                description: 'text-gray-600 dark:text-gray-300 text-sm mt-1',
                                actionButton: 'bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors',
                                cancelButton: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors',
                                closeButton: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors',
                            }
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}

export async function generateViewport(): Promise<Viewport> {
    const userAgent = (await headers()).get("user-agent");
    const isiPhone = /iphone/i.test(userAgent ?? "");
    return isiPhone
        ? {
              width: "device-width",
              initialScale: 1,
              maximumScale: 1, // disables auto-zoom on ios safari
          }
        : {};
}
