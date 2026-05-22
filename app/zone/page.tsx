"use client";

/**
 * app/zone/page.tsx
 * Creator Nexus by Nexfluence — Company Homepage
 *
 * Sections:
 *  1. Header / Nav
 *  2. Hero
 *  3. Stats Bar
 *  4. Services (What We Do)
 *  5. How It Works  [tabbed: Brands | Creators]
 *  6. Featured Creators
 *  7. Partners Marquee
 *  8. Why Nexfluence
 *  9. Final CTA
 * 10. Footer
 *
 * Prerequisites — add to app/globals.css (see bottom comment block).
 */

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────
function useWindowWidth(): number {
  const [w, setW] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const cb = () => setW(window.innerWidth);
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);
  return w;
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  ink:     "#0a0612",
  pink:    "#ff7ac3",
  magenta: "#ff33bc",
  violet:  "#8061ff",
  indigo:  "#6a66ff",
  white:   "#ffffff",
  dim:     "rgba(255,255,255,0.55)",
  dim2:    "rgba(255,255,255,0.72)",
  grad:    "linear-gradient(90deg, #ff33bc, #8061ff)",
  gradD:   "linear-gradient(135deg, #ff33bc, #8061ff)",
  border:  "1px solid rgba(128,97,255,0.35)",
  borderH: "1px solid rgba(255,122,195,0.55)",
  cardBg:  "rgba(128,97,255,0.06)",
} as const;

// ─────────────────────────────────────────────
// LAYOUT HELPERS
// ─────────────────────────────────────────────
type CSSProps = React.CSSProperties;

function pad(w: number): string {
  if (w < 640) return "0 20px";
  if (w < 900) return "0 32px";
  return "0 48px";
}

function outerCss(w: number, mt = 96): CSSProps {
  return {
    maxWidth: "1200px",
    margin: `${mt}px auto 0`,
    padding: pad(w),
  };
}

// ─────────────────────────────────────────────
// REUSABLE ATOMS
// ─────────────────────────────────────────────
function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.pink,
        marginBottom: "16px",
      }}
    >
      <span
        style={{ display: "block", width: "20px", height: "1px", background: C.pink, flexShrink: 0 }}
      />
      {children}
    </span>
  );
}

function GradientText({ children, style }: { children: React.ReactNode; style?: CSSProps }) {
  return (
    <span
      style={{
        background: C.grad,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant: "primary" | "ghost";
  children: React.ReactNode;
  style?: CSSProps;
}
function Btn({ href, onClick, variant, children, style }: ButtonProps) {
  const base: CSSProps = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "13px 28px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
    ...style,
  };
  const variants: Record<string, CSSProps> = {
    primary: {
      background: C.grad,
      color: "#fff",
      boxShadow: "0 8px 32px rgba(128,97,255,0.35)",
    },
    ghost: {
      background: "transparent",
      color: C.violet,
      border: `1.5px solid rgba(128,97,255,0.6)`,
    },
  };
  const merged = { ...base, ...variants[variant] };

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.opacity = "0.88";
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.opacity = "1";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    },
  };

  if (href) {
    return (
      <a href={href} style={merged} {...handlers}>
        {children}
      </a>
    );
  }
  return (
    <button style={merged} onClick={onClick} {...handlers}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// 1. HEADER / NAV
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Services",  href: "#services"  },
  { label: "Creators",  href: "#creators"  },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About",     href: "/about"     },
];

function Header() {
  const w         = useWindowWidth();
  const isMobile  = w < 640;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cb = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", cb, { passive: true });
    return () => window.removeEventListener("scroll", cb);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 0.3s, border-color 0.3s",
          background: scrolled ? "rgba(10,6,18,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(128,97,255,0.2)" : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "16px 20px" : "18px 48px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image
              src="/Nex.webp"
              alt="Nexfluence"
              width={isMobile ? 36 : 44}
              height={isMobile ? 36 : 44}
              style={{ borderRadius: "10px" }}
            />
            <div>
              <p style={{ fontSize: isMobile ? "14px" : "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                Nexfluence
              </p>
              <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em", marginTop: "2px" }}>
                CREATOR NEXUS
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          {!isMobile && (
            <nav
              style={{
                display: "flex",
                gap: "32px",
                marginLeft: "48px",
              }}
            >
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)")}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right CTAs */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
            {!isMobile && (
              <Btn href="#how-it-works" variant="ghost" style={{ padding: "10px 20px", fontSize: "13px" }}>
                For Creators
              </Btn>
            )}
            <Btn href="#contact" variant="primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
              {isMobile ? "Get Started" : "Work With Us"}
            </Btn>
            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "#fff",
                  fontSize: "20px",
                }}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobile && menuOpen && (
          <div
            style={{
              background: "rgba(10,6,18,0.97)",
              borderTop: "1px solid rgba(128,97,255,0.2)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

// ─────────────────────────────────────────────
// 2. HERO
// ─────────────────────────────────────────────
function Hero() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background layers */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Dark base gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(128,97,255,0.18) 0%, rgba(255,51,188,0.08) 40%, transparent 70%)",
          }}
        />
        {/* Grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(128,97,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(128,97,255,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black 40%, transparent 80%)",
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(to top, #0a0612, transparent)",
          }}
        />
      </div>

      <div
        style={{
          ...outerCss(w, 0),
          paddingTop: isMobile ? "120px" : "130px",
          paddingBottom: isMobile ? "80px" : "100px",
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
          gap: isMobile ? "56px" : "64px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left — copy */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px 6px 8px",
              borderRadius: "100px",
              background: "rgba(128,97,255,0.12)",
              border: C.border,
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "100px",
                background: C.grad,
                fontSize: "10px",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              New
            </span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
              Latvia's first creator economy platform
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontSize: isMobile ? "36px" : isTablet ? "46px" : "56px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#fff",
              marginBottom: "24px",
            }}
          >
            Where Brands
            <br />
            Meet{" "}
            <GradientText>Baltic</GradientText>
            <br />
            Creators
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: C.dim2,
              lineHeight: 1.75,
              maxWidth: "460px",
              marginBottom: "36px",
            }}
          >
            Nexfluence connects ambitious brands with authentic creators across
            Latvia, Lithuania, and Estonia — on a{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>
              100% performance-based model.
            </span>{" "}
            You only pay when results are delivered.
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Btn href="#contact" variant="primary">
              Start a Campaign →
            </Btn>
            <Btn href="#how-it-works" variant="ghost">
              Join as Creator
            </Btn>
          </div>

          {/* Trust line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "36px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex" }}>
              {["/Speaker 1.webp", "/Speaker 2.webp"].map((src, i) => (
                <div
                  key={i}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #0a0612",
                    marginLeft: i === 0 ? 0 : "-10px",
                    position: "relative",
                  }}
                >
                  <Image src={src} alt="Creator" fill style={{ objectFit: "cover", objectPosition: "top" }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: C.dim }}>
              <span style={{ color: "#fff", fontWeight: 600 }}>500+</span> creators already in the network
            </p>
          </div>
        </div>

        {/* Right — visual card cluster */}
        {!isMobile && (
          <HeroVisual />
        )}
      </div>

      {/* Mobile hero visual below text */}
      {isMobile && (
        <div style={{ width: "100%", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>
          <HeroVisualMobile />
        </div>
      )}
    </section>
  );
}

function HeroVisual() {
  return (
    <div style={{ position: "relative", height: "480px" }}>
      {/* Main photo card */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "0",
          width: "68%",
          height: "340px",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(255,122,195,0.3)",
          boxShadow: "0 32px 80px rgba(128,97,255,0.3)",
        }}
      >
        <Image
          src="/Skyline.webp"
          alt="Riga — Baltic Creator Hub"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(128,97,255,0.4) 0%, rgba(255,51,188,0.2) 50%, transparent 70%)",
          }}
        />

        {/* Floating label */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "rgba(10,6,18,0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p style={{ fontSize: "11px", color: "#fff", fontWeight: 600 }}>📍 Riga, Latvia</p>
        </div>
      </div>

      {/* Creator card — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "0",
          width: "200px",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(128,97,255,0.4)",
          background: "rgba(10,6,18,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 16px 48px rgba(128,97,255,0.25)",
        }}
      >
        <div style={{ position: "relative", height: "120px" }}>
          <Image
            src="/Speaker 1.webp"
            alt="Creator"
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10,6,18,0.9) 0%, transparent 60%)",
            }}
          />
        </div>
        <div style={{ padding: "12px 14px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Cindy Bokāne</p>
          <p style={{ fontSize: "11px", color: C.pink, marginTop: "2px" }}>Travel Creator · 84K</p>
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            {["IG", "TT"].map((p) => (
              <span
                key={p}
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "3px 7px",
                  borderRadius: "4px",
                  background: "rgba(128,97,255,0.25)",
                  color: C.violet,
                  letterSpacing: "0.05em",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats pill — top left */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "30px",
          padding: "12px 16px",
          borderRadius: "12px",
          background: "rgba(10,6,18,0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(128,97,255,0.35)",
          boxShadow: "0 8px 32px rgba(128,97,255,0.2)",
        }}
      >
        <p style={{ fontSize: "22px", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
          <GradientText>3.2×</GradientText>
        </p>
        <p style={{ fontSize: "11px", color: C.dim, marginTop: "2px" }}>avg. campaign ROI</p>
      </div>

      {/* Live badge */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          borderRadius: "100px",
          background: "rgba(10,6,18,0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,51,188,0.35)",
        }}
      >
        <span className="dot-live" />
        <span style={{ fontSize: "12px", color: "#fff", fontWeight: 500 }}>25+ active campaigns</span>
      </div>
    </div>
  );
}

function HeroVisualMobile() {
  return (
    <div
      style={{
        position: "relative",
        height: "220px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(128,97,255,0.3)",
      }}
    >
      <Image src="/Skyline.webp" alt="Riga" fill style={{ objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(128,97,255,0.5) 0%, rgba(255,51,188,0.25) 50%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          display: "flex",
          gap: "8px",
        }}
      >
        {[
          { value: "500+", label: "Creators" },
          { value: "25+",  label: "Brands"   },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "rgba(10,6,18,0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(128,97,255,0.3)",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>
              <GradientText>{s.value}</GradientText>
            </p>
            <p style={{ fontSize: "10px", color: C.dim }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. STATS BAR
// ─────────────────────────────────────────────
const STATS = [
  { value: "500+",  label: "Vetted Creators",      icon: "✦" },
  { value: "25+",   label: "Brand Partners",        icon: "✦" },
  { value: "3",     label: "Baltic Countries",      icon: "✦" },
  { value: "100%",  label: "Performance-Based",     icon: "✦" },
  { value: "3.2×",  label: "Average Campaign ROI",  icon: "✦" },
];

function StatsBar() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <div
      style={{
        borderTop: "1px solid rgba(128,97,255,0.18)",
        borderBottom: "1px solid rgba(128,97,255,0.18)",
        background: "rgba(128,97,255,0.04)",
        padding: isMobile ? "28px 20px" : "36px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr 1fr"
            : `repeat(${STATS.length}, 1fr)`,
          gap: isMobile ? "24px 16px" : "0",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            style={{
              textAlign: "center",
              position: "relative",
              padding: "0 16px",
            }}
          >
            {/* Divider (desktop) */}
            {!isMobile && i < STATS.length - 1 && (
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "40px",
                  width: "1px",
                  background: "rgba(128,97,255,0.25)",
                }}
              />
            )}
            <p
              style={{
                fontSize: isMobile ? "26px" : "32px",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                background: C.grad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                marginBottom: "6px",
              }}
            >
              {s.value}
            </p>
            <p style={{ fontSize: "12px", color: C.dim, fontWeight: 500, letterSpacing: "0.02em" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. SERVICES — WHAT WE DO
// ─────────────────────────────────────────────
interface Service {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
}

const SERVICES: Service[] = [
  {
    icon: "🔍",
    title: "Creator Discovery",
    desc: "We identify the right creators for your brand from our verified network of 500+ Baltic influencers — matched by niche, audience demographics, engagement quality, and brand fit.",
    tags: ["Niche Matching", "Audience Audit", "Engagement Rate", "Brand Safety"],
    accent: C.violet,
  },
  {
    icon: "🚀",
    title: "Campaign Management",
    desc: "End-to-end campaign execution from creative brief to final report. We handle contracts, briefing, content review, scheduling, and post-performance analysis — so you don't have to.",
    tags: ["Brief & Strategy", "Content Review", "Publishing", "Reporting"],
    accent: C.magenta,
  },
  {
    icon: "📊",
    title: "Performance Analytics",
    desc: "Every campaign is tracked with real data — impressions, clicks, conversions, and revenue. Our performance-based pricing means brands pay only for confirmed results.",
    tags: ["Real-Time Tracking", "Conversion Data", "ROI Reports", "UTM Links"],
    accent: C.pink,
  },
  {
    icon: "🤝",
    title: "Affiliate Programs",
    desc: "Set up long-term affiliate relationships with your best-performing creators. Promo codes, tracked links, and tiered commission structures — all managed on one platform.",
    tags: ["Promo Codes", "Tiered Payouts", "Long-Term Deals", "Auto-Tracking"],
    accent: C.indigo,
  },
];

function ServiceCard({ service }: { service: Service }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "20px",
        padding: "28px 28px 24px",
        background: hovered ? "rgba(128,97,255,0.1)" : C.cardBg,
        border: hovered ? C.borderH : C.border,
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 20px 60px rgba(128,97,255,0.2)` : "none",
        transition: "all 0.22s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: `${service.accent}22`,
          border: `1px solid ${service.accent}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
        }}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: "14px", color: C.dim, lineHeight: 1.75, flex: 1 }}>
        {service.desc}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {service.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "11px",
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: "6px",
              background: `${service.accent}18`,
              color: service.accent,
              letterSpacing: "0.02em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Services() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section id="services" style={outerCss(w)}>
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <PillLabel>What We Do</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? "28px" : "38px",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "#fff",
            marginBottom: "16px",
          }}
        >
          Everything You Need to{" "}
          <GradientText>Run Influence</GradientText>
        </h2>
        <p
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: C.dim,
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          From creator discovery to post-campaign reporting — we manage the full lifecycle
          of influencer marketing for Baltic brands.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        {SERVICES.map((s) => (
          <ServiceCard key={s.title} service={s} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. HOW IT WORKS  (tabbed: Brands | Creators)
// ─────────────────────────────────────────────
interface Step {
  num: string;
  title: string;
  desc: string;
  icon: string;
}

const BRAND_STEPS: Step[] = [
  { num: "01", icon: "🎯", title: "Define Your Goals",      desc: "Tell us your product, target audience, and campaign goals. We build the strategy around what success looks like for you."  },
  { num: "02", icon: "🔍", title: "We Source Creators",     desc: "Our team hand-picks creators from our verified network that align with your brand values, niche, and audience demographics."  },
  { num: "03", icon: "📝", title: "Brief & Approve",        desc: "Review creator profiles and content briefs before anything goes live. Full approval control stays with your team."           },
  { num: "04", icon: "📈", title: "Track & Pay on Results", desc: "Content goes live, conversions are tracked in real-time. You pay only on confirmed sales, sign-ups, or agreed KPIs."       },
];

const CREATOR_STEPS: Step[] = [
  { num: "01", icon: "📋", title: "Apply & Get Verified",   desc: "Submit your profile. We review your content, engagement quality, and audience authenticity — not just follower count."        },
  { num: "02", icon: "🎁", title: "Get Matched to Campaigns", desc: "Receive campaign invitations that match your niche and audience. You choose what to accept — no pressure, no lock-ins."  },
  { num: "03", icon: "✍️", title: "Create Authentic Content", desc: "Work within a creative brief that protects your voice. We give direction without killing your authenticity."             },
  { num: "04", icon: "💸", title: "Earn on Performance",    desc: "Get paid for actual results — clicks, codes used, or sales driven. The better you perform, the more you earn."               },
];

function HowItWorks() {
  const w          = useWindowWidth();
  const isMobile   = w < 640;
  const [tab, setTab] = useState<"brands" | "creators">("brands");
  const steps      = tab === "brands" ? BRAND_STEPS : CREATOR_STEPS;

  return (
    <section id="how-it-works" style={outerCss(w)}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <PillLabel>How It Works</PillLabel>
        <h2
          style={{
            fontSize: isMobile ? "28px" : "38px",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "#fff",
            marginBottom: "32px",
          }}
        >
          Simple by Design,{" "}
          <GradientText>Powerful by Outcome</GradientText>
        </h2>

        {/* Tab toggle */}
        <div
          style={{
            display: "inline-flex",
            borderRadius: "12px",
            background: "rgba(128,97,255,0.1)",
            border: C.border,
            padding: "4px",
          }}
        >
          {(["brands", "creators"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 32px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                background: tab === t ? C.grad : "transparent",
                color: tab === t ? "#fff" : C.dim,
                textTransform: "capitalize",
              }}
            >
              For {t === "brands" ? "Brands" : "Creators"}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gap: isMobile ? "0" : "0",
          position: "relative",
        }}
      >
        {/* Connector line (desktop) */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: "calc(12.5% + 24px)",
              right: "calc(12.5% + 24px)",
              height: "1px",
              background: "linear-gradient(90deg, rgba(128,97,255,0.5), rgba(255,51,188,0.5))",
              zIndex: 0,
            }}
          />
        )}

        {steps.map((step, i) => (
          <div
            key={step.num}
            style={{
              position: "relative",
              zIndex: 1,
              padding: isMobile ? "0 0 32px 0" : "0 20px",
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? "16px" : "0",
              textAlign: isMobile ? "left" : "center",
            }}
          >
            {/* Number bubble */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: C.grad,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
                boxShadow: "0 8px 24px rgba(128,97,255,0.4)",
                marginBottom: isMobile ? 0 : "20px",
              }}
            >
              {step.icon}
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.violet,
                  letterSpacing: "0.12em",
                  marginBottom: "6px",
                }}
              >
                STEP {step.num}
              </p>
              <h3
                style={{
                  fontSize: isMobile ? "16px" : "15px",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>

            {/* Mobile connector */}
            {isMobile && i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: "27px",
                  top: "60px",
                  width: "1px",
                  height: "calc(100% - 30px)",
                  background: "linear-gradient(180deg, rgba(128,97,255,0.5), rgba(255,51,188,0.3))",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: "56px",
          textAlign: "center",
        }}
      >
        <Btn
          href={tab === "brands" ? "#contact" : "#apply"}
          variant="primary"
        >
          {tab === "brands" ? "Start a Campaign →" : "Apply to Join →"}
        </Btn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. FEATURED CREATORS
// ─────────────────────────────────────────────
interface CreatorProfile {
  name: string;
  handle: string;
  niche: string;
  photo: string;
  followers: string;
  platforms: string[];
  location: string;
}

const CREATORS: CreatorProfile[] = [
  {
    name: "Cindy Bokāne",
    handle: "@cindywanderlust",
    niche: "Travel & Lifestyle",
    photo: "/Speaker 1.webp",
    followers: "84K",
    platforms: ["IG", "YT"],
    location: "Riga, LV",
  },
  {
    name: "Armands Simsons",
    handle: "@armandssimsons",
    niche: "Business & Startups",
    photo: "/Speaker 2.webp",
    followers: "61K",
    platforms: ["IG", "LI"],
    location: "Riga, LV",
  },
  {
    name: "Event Creator",
    handle: "@nexcreator",
    niche: "Food & Hospitality",
    photo: "/Food.webp",
    followers: "32K",
    platforms: ["IG", "TT"],
    location: "Tallinn, EE",
  },
  {
    name: "Space Creator",
    handle: "@spacecreator",
    niche: "Design & Architecture",
    photo: "/Space.webp",
    followers: "47K",
    platforms: ["IG"],
    location: "Vilnius, LT",
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  IG: "#ff33bc",
  TT: "#8061ff",
  YT: "#ff7a7a",
  LI: "#6a66ff",
};

function CreatorCard({ creator }: { creator: CreatorProfile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        border: hovered ? C.borderH : C.border,
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? "0 20px 56px rgba(128,97,255,0.25)" : "none",
        transition: "all 0.2s ease",
        background: C.cardBg,
        cursor: "pointer",
      }}
    >
      {/* Photo */}
      <div style={{ position: "relative", height: "220px" }}>
        <Image
          src={creator.photo}
          alt={creator.name}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? "linear-gradient(to top, rgba(10,6,18,0.97) 0%, rgba(10,6,18,0.3) 60%, transparent 80%)"
              : "linear-gradient(to top, rgba(10,6,18,0.85) 0%, transparent 60%)",
            transition: "background 0.2s",
          }}
        />
        {/* Location tag */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            fontSize: "10px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "6px",
            background: "rgba(10,6,18,0.75)",
            backdropFilter: "blur(6px)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {creator.location}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "4px" }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            {creator.name}
          </p>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
            {creator.followers}
          </span>
        </div>
        <p style={{ fontSize: "12px", color: C.pink, marginBottom: "10px" }}>{creator.handle}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: "12px",
              color: C.dim,
              background: "rgba(128,97,255,0.12)",
              padding: "3px 10px",
              borderRadius: "6px",
            }}
          >
            {creator.niche}
          </span>
          <div style={{ display: "flex", gap: "5px" }}>
            {creator.platforms.map((p) => (
              <span
                key={p}
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: "5px",
                  background: `${PLATFORM_COLORS[p] ?? "#8061ff"}22`,
                  color: PLATFORM_COLORS[p] ?? "#8061ff",
                  letterSpacing: "0.04em",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedCreators() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section id="creators" style={outerCss(w)}>
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <div>
          <PillLabel>Creator Network</PillLabel>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "38px",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            Meet the Voices That
            <br />
            <GradientText>Move the Baltics</GradientText>
          </h2>
        </div>
        <Btn href="#how-it-works" variant="ghost" style={{ flexShrink: 0 }}>
          Join the Network →
        </Btn>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {CREATORS.map((c) => (
          <CreatorCard key={c.handle} creator={c} />
        ))}
      </div>

      {/* Teaser row */}
      <div
        style={{
          marginTop: "24px",
          padding: "20px 28px",
          borderRadius: "16px",
          background: "rgba(128,97,255,0.05)",
          border: C.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex" }}>
            {["/Speaker 1.webp", "/Speaker 2.webp", "/Food.webp"].map((src, i) => (
              <div
                key={i}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #0a0612",
                  marginLeft: i === 0 ? 0 : "-10px",
                  position: "relative",
                }}
              >
                <Image src={src} alt="Creator" fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: "14px", color: C.dim }}>
            <span style={{ color: "#fff", fontWeight: 600 }}>496+ more creators</span> across
            food, fashion, tech, fitness, and more
          </p>
        </div>
        <Btn href="#contact" variant="primary" style={{ padding: "10px 22px", fontSize: "13px" }}>
          Browse Full Roster
        </Btn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 7. PARTNERS MARQUEE
// ─────────────────────────────────────────────
const BRANDS = [
  { name: "Artisan Street Bakery", img: "/Artisan Street Bakery.webp" },
  { name: "Molberts",              img: "/Molberts.webp"              },
  { name: "Gardu Muti",            img: "/Gardu Muti.webp"            },
  { name: "Street Pizza",          img: "/Street Pizza.webp"          },
  { name: "Street Burgers",        img: "/Street Burgers.webp"        },
  { name: "Skriveŗu",             img: "/Skriveru.webp"              },
  { name: "Hedonya",               img: "/Hedonya.webp"               },
];

function PartnersMarquee() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={{ marginTop: "96px" }}>
      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          marginBottom: "32px",
        }}
      >
        Trusted by Baltic Brands
      </p>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: isMobile ? "80px" : "120px",
          borderTop: "1px solid rgba(128,97,255,0.15)",
          borderBottom: "1px solid rgba(128,97,255,0.15)",
          background: "rgba(128,97,255,0.03)",
        }}
      >
        {/* Edge fades */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #0a0612 0%, transparent 12%, transparent 88%, #0a0612 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Track */}
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <div className="marquee-track" style={{ alignItems: "center" }}>
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div
                key={`${b.name}-${i}`}
                style={{
                  flexShrink: 0,
                  margin: isMobile ? "0 20px" : "0 32px",
                  display: "flex",
                  alignItems: "center",
                  height: isMobile ? "48px" : "72px",
                }}
              >
                <Image
                  src={b.img}
                  alt={b.name}
                  width={isMobile ? 80 : 120}
                  height={isMobile ? 48 : 72}
                  style={{
                    objectFit: "contain",
                    opacity: 0.65,
                    filter: "brightness(0) invert(1)",
                    transition: "opacity 0.2s, filter 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.opacity = "1";
                    el.style.filter = "none";
                    el.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.opacity = "0.65";
                    el.style.filter = "brightness(0) invert(1)";
                    el.style.transform = "scale(1)";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 8. WHY NEXFLUENCE
// ─────────────────────────────────────────────
interface Differentiator {
  icon: string;
  title: string;
  desc: string;
}

const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: "⚡",
    title: "Pay Only for Results",
    desc: "Our performance-based pricing model means you're never paying for vanity metrics. Every spend is tied to a real business outcome — sales, sign-ups, or agreed KPIs.",
  },
  {
    icon: "🌍",
    title: "Baltic-Native Expertise",
    desc: "We're not a global agency trying to fit the Baltics into a template. We live here, we know the creators, the culture, and the consumer behaviour intimately.",
  },
  {
    icon: "🎯",
    title: "Audience Quality Over Quantity",
    desc: "Every creator in our network is verified for genuine engagement and authentic audience composition. We reject 70% of applicants to protect brand safety.",
  },
  {
    icon: "🔗",
    title: "One Platform, Full Transparency",
    desc: "Brands and creators both get a single dashboard — briefs, approvals, content, tracking links, and payouts all in one place. No spreadsheets, no email chains.",
  },
  {
    icon: "🤖",
    title: "Data-Driven Matching",
    desc: "We don't just go by follower count. Our matching considers engagement rate, audience demographics, past campaign performance, and brand alignment score.",
  },
  {
    icon: "♻️",
    title: "Built for Long-Term Value",
    desc: "We help brands build ongoing affiliate relationships with their best creators — not just one-off posts. Recurring partnerships drive compounding returns.",
  },
];

function WhyNexfluence() {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;

  return (
    <section style={outerCss(w)}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
          gap: "64px",
          alignItems: "start",
        }}
      >
        {/* Left — heading */}
        <div style={{ position: isMobile ? "static" : "sticky", top: "100px" }}>
          <PillLabel>Why Nexfluence</PillLabel>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "38px",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "20px",
            }}
          >
            Influencer Marketing
            <br />
            That Actually{" "}
            <GradientText>Converts</GradientText>
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: C.dim,
              lineHeight: 1.8,
              marginBottom: "32px",
              maxWidth: "420px",
            }}
          >
            The influencer marketing industry is broken — brands overpay for
            reach, creators undercut their value, and nobody tracks real ROI. We
            built Nexfluence to fix that, specifically for the Baltic market.
          </p>
          <Btn href="#contact" variant="primary">
            See How We Do It →
          </Btn>

          {/* Quote / testimonial */}
          <div
            style={{
              marginTop: "40px",
              padding: "20px 24px",
              borderRadius: "16px",
              background: C.cardBg,
              border: C.border,
              borderLeft: `3px solid ${C.violet}`,
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: C.dim2,
                lineHeight: 1.75,
                fontStyle: "italic",
              }}
            >
              "Working with Nexfluence was the first time we actually knew where
              every euro of our influencer budget went — and it came back 3× over."
            </p>
            <p style={{ fontSize: "12px", color: C.violet, marginTop: "12px", fontWeight: 600 }}>
              — Brand Partner, Riga F&B Sector
            </p>
          </div>
        </div>

        {/* Right — differentiator grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "16px",
          }}
        >
          {DIFFERENTIATORS.map((d) => (
            <div
              key={d.title}
              style={{
                padding: "22px",
                borderRadius: "16px",
                background: C.cardBg,
                border: C.border,
                transition: "border-color 0.18s, transform 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,122,195,0.45)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(128,97,255,0.35)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <p style={{ fontSize: "24px", marginBottom: "10px" }}>{d.icon}</p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {d.title}
              </p>
              <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.7 }}>
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 9. FINAL CTA
// ─────────────────────────────────────────────
function FinalCTA() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <section style={{ ...outerCss(w, 96), marginBottom: "0" }}>
      <div
        id="contact"
        style={{
          position: "relative",
          borderRadius: "28px",
          overflow: "hidden",
          padding: isMobile ? "48px 28px" : "72px 80px",
          background: "rgba(128,97,255,0.07)",
          border: C.border,
          textAlign: "center",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(128,97,255,0.22) 0%, rgba(255,51,188,0.12) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(128,97,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(128,97,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <PillLabel>Get Started</PillLabel>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "44px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            Ready to Grow
            <br />
            <GradientText>Through Authentic Influence?</GradientText>
          </h2>
          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color: C.dim,
              maxWidth: "480px",
              margin: "0 auto 40px",
              lineHeight: 1.75,
            }}
          >
            Whether you're a brand looking to scale or a creator ready to monetize —
            there's a place for you in the Nexfluence network.
          </p>

          {/* Dual CTA */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Btn href="mailto:brands@nexfluence.eu" variant="primary">
              I'm a Brand →
            </Btn>
            <Btn href="mailto:creators@nexfluence.eu" variant="ghost">
              I'm a Creator →
            </Btn>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "20px" }}>
            No commitment required · Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 10. FOOTER
// ─────────────────────────────────────────────
const FOOTER_LINKS = {
  Platform: ["Creator Discovery", "Campaign Management", "Analytics", "Affiliate Programs"],
  Company:  ["About Us", "Blog", "Careers", "Press"],
  Contact:  ["brands@nexfluence.eu", "creators@nexfluence.eu", "Instagram", "LinkedIn"],
};

function Footer() {
  const w        = useWindowWidth();
  const isMobile = w < 640;

  return (
    <footer
      style={{
        marginTop: "96px",
        borderTop: "1px solid rgba(128,97,255,0.15)",
        padding: isMobile ? "48px 20px 32px" : "64px 48px 40px",
        maxWidth: "1200px",
        margin: "96px auto 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? "36px 24px" : "40px",
          marginBottom: "56px",
          padding: pad(w),
        }}
      >
        {/* Brand column */}
        <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Image src="/Nex.webp" alt="Nexfluence" width={40} height={40} style={{ borderRadius: "10px" }} />
            <div>
              <p style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Nexfluence
              </p>
              <p style={{ fontSize: "10px", color: C.pink, letterSpacing: "0.08em" }}>CREATOR NEXUS</p>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.75, maxWidth: "240px" }}>
            Latvia's first performance-based influencer marketing platform connecting brands with
            authentic Baltic creators.
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {["IG", "LI", "TT"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: C.cardBg,
                  border: C.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.dim,
                  textDecoration: "none",
                  transition: "color 0.18s, border-color 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,122,195,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = C.dim;
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(128,97,255,0.35)";
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "16px",
              }}
            >
              {col}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontSize: "13px",
                    color: C.dim,
                    textDecoration: "none",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.dim)}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          padding: `0 ${isMobile ? "0" : "0"}`,
          borderTop: "1px solid rgba(128,97,255,0.1)",
          paddingTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
          © 2026 Nexfluence SIA. Registered in Latvia. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms of Service"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function ZonePage() {
  return (
    <div style={{ background: "#0a0612", overflowX: "hidden" }}>
      <Header />
      <Hero />
      <StatsBar />
      <Services />
      <HowItWorks />
      <FeaturedCreators />
      <PartnersMarquee />
      <WhyNexfluence />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * MERGE INTO app/globals.css
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @layer utilities {
 *   .dot-live {
 *     display: inline-block;
 *     width: 7px; height: 7px;
 *     border-radius: 9999px;
 *     background: #ff33bc;
 *     box-shadow: 0 0 0 0 rgba(255,51,188,0.5);
 *     animation: dot-pulse 1.8s ease-out infinite;
 *     flex-shrink: 0;
 *   }
 *   .marquee-track {
 *     display: flex;
 *     width: max-content;
 *     animation: marquee-left 28s linear infinite;
 *   }
 *   .marquee-track:hover { animation-play-state: paused; }
 * }
 *
 * @keyframes dot-pulse {
 *   0%   { box-shadow: 0 0 0 0   rgba(255,51,188,0.5); }
 *   70%  { box-shadow: 0 0 0 9px rgba(255,51,188,0);   }
 *   100% { box-shadow: 0 0 0 0   rgba(255,51,188,0);   }
 * }
 * @keyframes marquee-left {
 *   from { transform: translateX(0); }
 *   to   { transform: translateX(-50%); }
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */