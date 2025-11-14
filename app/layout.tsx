import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import localFont from "next/font/local";

const stackSans = localFont({
    src: [
        {
            path: '../public/fonts/StackSansHeadline-ExtraLight.ttf',
            weight: '200',
            style: 'extra-light',
        },
        {
            path: '../public/fonts/StackSansHeadline-Light.ttf',
            weight: '300',
            style: 'light',
        },
        {
            path: '../public/fonts/StackSansHeadline-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/StackSansHeadline-Medium.ttf',
            weight: '500',
            style: 'medium',
        },
        {
            path: '../public/fonts/StackSansHeadline-SemiBold.ttf',
            weight: '600',
            style: 'semi-bold',
        },
        {
            path: '../public/fonts/StackSansHeadline-Bold.ttf',
            weight: '700',
            style: 'bold',
        },
    ],
    variable: '--font-stack-sans',
    display: 'swap',
});



export const metadata: Metadata = {
  title: "Linkfloo",
  description: "Twoje centrum linków w jednym miejscu. Developed by Linkfloo Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="pl" className={`${stackSans.variable}`}>
          <body className={`${stackSans.className} antialiased`}>
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  );
}
