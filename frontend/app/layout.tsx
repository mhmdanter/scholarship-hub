import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarship Hub | Find Your Next Opportunity",
  description: "A centralized platform for students to find 500+ academic scholarships in STEM, Research, and more.",
  keywords: ["scholarships", "STEM funding", "student grants", "research opportunities"],
  openGraph: {
    title: "Scholarship Hub",
    description: "Discover global academic opportunities filtered by AI.",
    url: "http://your-domain.com",
    siteName: "ScholarshipHub",
    images: [
      {
        url: "/og-image.png", // Put a nice preview image in your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scholarship Hub",
    description: "Find your next scholarship opportunity today.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}