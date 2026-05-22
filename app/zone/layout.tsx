/**
 * app/zone/layout.tsx
 *
 * Minimal layout for the /zone route segment.
 * The root app/layout.tsx already handles:
 *   - Rubik font loading
 *   - globals.css import
 *   - <html> / <body> setup
 *
 * This layout just passes children through with a dark background wrapper.
 * When you're ready to graduate /zone to the real homepage, move
 * page.tsx up to app/page.tsx and delete this folder.
 */

export const metadata = {
  title: "Creator Nexus by Nexfluence",
  description:
    "Bringing Impactful Creators Across the Baltics Under One Roof. Latvia's premier influencer marketing platform.",
};

export default function ZoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#0a0612", minHeight: "100vh" }}>
      {children}
    </div>
  );
}