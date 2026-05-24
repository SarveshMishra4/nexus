/**
 * app/zone/profile/[handle]/page.tsx
 * SERVER COMPONENT — no "use client" directive.
 *
 * Responsibilities:
 *  1. Fetch creator profile data from your API (mocked below).
 *  2. Export generateMetadata → full Open Graph + Twitter/X + LinkedIn tags.
 *  3. Render the <ProfileView> client component with the profile as a prop.
 *
 * Why two files?
 *  Next.js App Router requires a Server Component to export generateMetadata.
 *  All interactive UI (share button, copy link, animations) lives in ProfileView.tsx.
 *
 * OG image strategy:
 *  - og:image     → creator's profile photo (400×400 min)
 *  - og:image:alt → "{name} — creator profile on Nexfluence"
 *  - twitter:card → "summary_large_image" uses cover image (1200×630)
 *  When shared on Instagram Stories / WhatsApp the profile photo appears.
 *  When shared on Twitter/X the cover banner appears.
 */

import type { Metadata } from "next";
import { ProfileView } from "./profileView";

// ─────────────────────────────────────────────
// PROFILE TYPE  (matches what your API returns)
// ─────────────────────────────────────────────
export interface CreatorProfile {
  name:        string;
  handle:      string;
  bio:         string;
  tagline:     string;
  photo:       string;   // absolute URL in production
  cover:       string;   // absolute URL in production
  verified:    boolean;
  level:       string;
  credibility: number;
  location:    string;
  languages:   string[];
  niche:       string[];
  styles:      string[];
  website?:    string;
  platforms: {
    ig?:  { handle: string; followers: string; url: string };
    tt?:  { handle: string; followers: string; url: string };
    yt?:  { handle: string; subscribers: string; url: string };
    li?:  { handle: string; url: string };
  };
  stats: {
    engRate:   string;
    avgViews:  string;
    campaigns: number;
    avgROI?:   string;
  };
  pastWork: {
    brand:    string;
    platform: string;
    type:     string;
    result:   string;
    url?:     string;
  }[];
  rates: {
    story:       number;
    post:        number;
    video:       number;
    yt:          number;
    currency:    string;
    negotiable:  boolean;
  };
}

// ─────────────────────────────────────────────
// DATA FETCHER
// Replace the mock below with your real API call:
//   const res  = await fetch(`${process.env.API_URL}/profile/${handle}`, { next: { revalidate: 60 } })
//   if (!res.ok) notFound()
//   return res.json()
// ─────────────────────────────────────────────
async function getProfile(handle: string): Promise<CreatorProfile | null> {
  // ── MOCK DATA ── remove when API is live ──
  const MOCK: CreatorProfile = {
    name:        "Marta Kalniņa",
    handle:      "martakalns",
    bio:         "Lifestyle & wellness creator from Riga. I document real life — morning routines, Baltic adventures, and the honest side of building a healthy routine in a city that never slows down.",
    tagline:     "Lifestyle · Wellness · Baltic Living",
    photo:       "/Speaker 1.webp",
    cover:       "/Skyline.webp",
    verified:    true,
    level:       "Elite",
    credibility: 82,
    location:    "Riga, Latvia 🇱🇻",
    languages:   ["Latvian", "English"],
    niche:       ["Lifestyle", "Wellness", "Travel"],
    styles:      ["Aesthetic", "Authentic", "Storytelling", "Short-form"],
    website:     "https://martakalns.lv",
    platforms: {
      ig: { handle: "@martakalns", followers: "18.4K", url: "https://instagram.com/martakalns" },
      tt: { handle: "@martakalns", followers: "8.2K",  url: "https://tiktok.com/@martakalns"  },
    },
    stats: {
      engRate:   "4.8%",
      avgViews:  "22K",
      campaigns: 12,
      avgROI:    "3.1×",
    },
    pastWork: [
      { brand: "Hedonya Spa",   platform: "Instagram", type: "Sponsored Post",  result: "4.2% engagement · 1,240 saves" },
      { brand: "Street Pizza",  platform: "TikTok",    type: "Video Review",    result: "28K views · 6.1% engagement"   },
      { brand: "Skriveŗu",     platform: "Instagram", type: "Story Series",    result: "850 swipe-ups · 3.8% CTR"      },
      { brand: "Red Bull LV",   platform: "Instagram", type: "Event Coverage",  result: "12K reach · 5.4% engagement"   },
    ],
    rates: {
      story:      80,
      post:       220,
      video:      280,
      yt:         0,
      currency:   "EUR",
      negotiable: true,
    },
  };

  // Return mock for any handle in development; return null for 404
  return handle ? MOCK : null;
}

// ─────────────────────────────────────────────
// GENERATE METADATA  — the whole reason this
// file exists as a server component
// ─────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> }
): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfile(handle);

  // 404 fallback metadata
  if (!profile) {
    return {
      title: "Creator Not Found — Nexfluence",
      description: "This creator profile doesn't exist or hasn't been set up yet.",
    };
  }

  const displayName = `${profile.name} (@${profile.handle})`;
  const ogTitle     = `${profile.name} — ${profile.tagline}`;
  const ogDesc      = `${profile.bio.slice(0, 155)}…`;

  // In production, photo/cover should be absolute URLs.
  // For local assets (/Speaker 1.webp), prefix with your domain:
  //   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nexfluence.eu"
  //   const photoUrl = `${baseUrl}${profile.photo}`
  //   const coverUrl = `${baseUrl}${profile.cover}`
  const photoUrl = profile.photo;
  const coverUrl = profile.cover;

  return {
    // ── Page title (browser tab + search engines) ──
    title: `${displayName} — Creator on Nexfluence`,
    description: ogDesc,

    // ── Open Graph (Facebook, LinkedIn, WhatsApp, iMessage, Slack) ──
    openGraph: {
      type:        "profile",
      title:       ogTitle,
      description: ogDesc,
      url:         `https://nexfluence.eu/profile/${handle}`,
      siteName:    "Nexfluence",
      locale:      "en_EU",
      images: [
        // Primary: cover image (1200×630) — shown as large card
        {
          url:    coverUrl,
          width:  1200,
          height: 630,
          alt:    `${profile.name} — creator profile on Nexfluence`,
        },
        // Fallback: profile photo (square) — used when cover isn't suitable
        {
          url:    photoUrl,
          width:  400,
          height: 400,
          alt:    `${profile.name} — @${profile.handle}`,
        },
      ],
      // OG profile-specific tags
      firstName: profile.name.split(" ")[0],
      lastName:  profile.name.split(" ").slice(1).join(" "),
      username:  profile.handle,
    },

    // ── Twitter / X card ──
    twitter: {
      card:        "summary_large_image",
      site:        "@nexfluence",
      creator:     `@${profile.handle}`,
      title:       ogTitle,
      description: ogDesc,
      images:      [coverUrl],
    },

    // ── Canonical + alternate ──
    alternates: {
      canonical: `https://nexfluence.eu/profile/${handle}`,
    },

    // ── Robots ──
    robots: {
      index:  true,
      follow: true,
    },

    // ── Additional meta for rich previews ──
    other: {
      // WhatsApp and Telegram use og: tags but also these
      "og:image:type":  "image/webp",
      // LinkedIn additional
      "article:author": `https://nexfluence.eu/profile/${handle}`,
      // Instagram deep-link (when someone shares on IG stories)
      "al:ios:url":     `nexfluence://profile/${handle}`,
      "al:android:url": `nexfluence://profile/${handle}`,
    },
  };
}

// ─────────────────────────────────────────────
// PAGE  (renders the client component)
// ─────────────────────────────────────────────
export default async function ProfilePage(
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const profile = await getProfile(handle);

  if (!profile) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0612",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "16px", fontFamily: "var(--font-rubik), sans-serif",
      }}>
        <p style={{ fontSize: "48px" }}>👻</p>
        <p style={{ fontSize: "20px", fontWeight: 800, color: "#fff" }}>Profile not found</p>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          This creator hasn't set up their profile yet.
        </p>
        <a href="/zone" style={{
          marginTop: "8px", padding: "10px 24px",
          borderRadius: "8px", background: "linear-gradient(90deg,#ff33bc,#8061ff)",
          color: "#fff", fontSize: "14px", fontWeight: 700, textDecoration: "none",
        }}>
          Go to Nexfluence
        </a>
      </div>
    );
  }

  return <ProfileView profile={profile} />;
}