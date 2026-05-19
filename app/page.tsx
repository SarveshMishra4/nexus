"use client";
/**
 * Nex · Event Landing Page
 * ─────────────────────────────────────────────────────────────────────
 * IMAGES: Place your files in the /public folder of your Next.js project:
 *
 *   public/
 *   ├── Event Place.webp      ← Full-width top banner image
 *   ├── Nex.webp              ← Logo
 *   ├── Scene 1.webp          ← Gallery square top-left
 *   ├── Scene 2.webp          ← Gallery square top-middle
 *   ├── Recap.mp4             ← Gallery tall reel (right column, both rows)
 *   ├── Scene 3.webp          ← Gallery wide bottom-left
 *   ├── RedBull Image.webp    ← RedBull campaign image
 *   ├── Speaker 1.webp        ← Keynote speaker 1
 *   └── Speaker 2.webp        ← Keynote speaker 2
 *
 * ─────────────────────────────────────────────────────────────────────
 */
import { useEffect } from "react";

const FONT = "'Rubik', var(--font-rubik), sans-serif";

const C = {
  ink:     "#f7f5ff",              // page background — light lavender (in-palette)
  pink:    "#ff7ac3",              // unchanged
  magenta: "#ff33bc",              // unchanged
  violet:  "#8061ff",              // unchanged
  indigo:  "#6a66ff",              // unchanged
  white:   "#1a0a2e",              // now: deep violet-ink used for headings/logo text
  dimText: "rgba(26,10,46,0.55)",  // muted body text on light background
  border:  "rgba(255,122,195,0.35)",
  vBorder: "rgba(128,97,255,0.4)",
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <div style={{ background: C.ink, minHeight: "100vh", fontFamily: FONT }}>
      {/* ── Logo-only nav ── */}
      <header style={{ maxWidth: "calc(380px + 50vw)", margin: "0 auto", padding: "28px 32px" }}>
        <LogoMark />
      </header>
      {/* ── Hero image — same width as content, rounded corners, location overlay ── */}
      <div style={{
        maxWidth: "calc(380px + 50vw)",
        margin: "20px auto 0",
        padding: "0 32px",
      }}>
        <div style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          lineHeight: 0,
        }}>
          <img
            src="/Event Place.webp"
            alt="Nex Event"
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              maxHeight: "520px",
            }}
          />
          {/* Bottom-left overlay — soft cloud, no border, no hard edges */}
          <div style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 340,
            height: 200,
            background: "radial-gradient(ellipse at 28% 70%, rgba(128,97,255,0.55) 0%, rgba(255,51,188,0.3) 35%, transparent 70%)",
            filter: "blur(18px)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: 24,
            left: 24,
          }}>
            {/* Text is always white here — it sits on top of a photo */}
            <div style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              textShadow: "0 1px 12px rgba(128,97,255,0.8), 0 0 30px rgba(255,51,188,0.5)",
            }}>
              Hilton Hotel, Jalian Wala Bagh
            </div>
            <div style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              marginTop: 5,
              letterSpacing: "0.04em",
              textShadow: "0 1px 8px rgba(128,97,255,0.7)",
            }}>
              28 May 2026 · 19:00
            </div>
          </div>
        </div>
      </div>
      {/* ── Main content — constrained width ── */}
      <main style={{ maxWidth: "calc(380px + 50vw)", padding: "0 32px", margin: "0 auto" }}>
        <LastHappenings />
        <Sponsors />
        <KeynoteSpeakers />
        <LumaForm />
        <AboutNex />
        <div style={{ height: 80 }} />
      </main>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <img
        src="/Nex.webp"
        alt="Nex logo"
        style={{
          width: 64,
          height: 64,
          objectFit: "contain",
          display: "block",
        }}
      />
      <div>
        <div style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 650,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: C.white,          // deep violet-ink on light bg
        }}>
          Creator Nexus
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 250,
          letterSpacing: "0.16em",
          color: C.pink,
          marginTop: 3,
        }}>
          Building From Baltics For the Globe
        </div>
      </div>
    </div>
  );
}

// ─── Last Happenings ──────────────────────────────────────────────────────
function LastHappenings() {
  return (
    <section style={{ marginTop: 56 }}>
      <Label text="Gallery" />
      <h2 style={sectionTitle}>Our Last Event</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "200px 220px",
        gap: 12,
        marginTop: 24,
      }}>
        <div style={{ gridColumn: "1", gridRow: "1", ...photoCell }}>
          <img src="/Scene 1.webp" alt="Event photo 1" style={fillImg} />
          <PhotoCaption text="Opening night" />
        </div>
        <div style={{ gridColumn: "2", gridRow: "1", ...photoCell }}>
          <img src="/Scene 2.webp" alt="Event photo 2" style={fillImg} />
          <PhotoCaption text="Casting tables" />
        </div>
        <div style={{ gridColumn: "3", gridRow: "1 / span 2", ...photoCell }}>
          <video
            src="/Recap.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={fillImg}
          />
          <PhotoCaption text="Recap from Last Events" />
        </div>
        <div style={{ gridColumn: "1 / span 2", gridRow: "2", ...photoCell }}>
          <img
            src="/Scene 3.webp"
            alt="Event wide shot"
            style={{ ...fillImg, objectPosition: "top" }}
          />
          <PhotoCaption text="The roster reveal" />
        </div>
      </div>
    </section>
  );
}

// ─── Sponsors ─────────────────────────────────────────────────────────────
function Sponsors() {
  return (
    <section style={{ marginTop: 64 }}>
      <style>{`
        .sponsor-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .sponsor-fog {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(128,97,255,0.65) 0%,
            rgba(255,51,188,0.42) 28%,
            transparent 60%
          );
          filter: blur(26px);
          opacity: 0.15;
          transition: opacity 0.45s ease;
          pointer-events: none;
        }
        .sponsor-card:hover .sponsor-fog {
          opacity: 1;
        }
      `}</style>
      <Label text="Partners" />
      <h2 style={sectionTitle}>Our Sponsors in Baltics</h2>
      {/* ── Main sponsor — RedBull ── */}
      <div className="sponsor-card" style={{
        marginTop: 24,
        borderRadius: 16,
        border: `1px solid ${C.vBorder}`,
        height: 260,
      }}>
        <img
          src="/RedBull Image.webp"
          alt="Red Bull"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div className="sponsor-fog" />
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          {/* Always white — sits on top of a photo */}
          <div style={{
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            textShadow: "0 2px 18px rgba(128,97,255,0.95), 0 0 40px rgba(255,51,188,0.65)",
          }}>
            Red Bull
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.07em",
            textShadow: "0 1px 10px rgba(128,97,255,0.85)",
          }}>
            Headline partner · Baltic creator campaigns
          </div>
        </div>
      </div>
      {/* ── Other sponsors — infinite scrolling strip ── */}
      <BrandMarquee />
      {/* trailing note */}
      <p style={{
        fontFamily: `'Rubik', var(--font-rubik), sans-serif`,
        marginTop: 16,
        fontSize: 12,
        fontWeight: 400,
        color: "rgba(26,10,46,0.4)",   // dark muted on light bg
        letterSpacing: "0.06em",
        textAlign: "center",
      }}>
        And More Participating Brands to be Announced Soon
      </p>
    </section>
  );
}

// ─── Brand Marquee ────────────────────────────────────────────────────────
const MARQUEE_BRANDS = [
  "Artisan Street Bakery", "Molberts", "Fizio Line",
  "Street Burgers", "Gardu Muti", "Street Pizza",
];
function BrandMarquee() {
  const items = [...MARQUEE_BRANDS, ...MARQUEE_BRANDS];
  return (
    <div style={{
      marginTop: 10,
      borderRadius: 14,
      border: `1px solid ${C.vBorder}`,
      height: 72,
      overflow: "hidden",
      position: "relative",
      background: "rgba(128,97,255,0.06)",
    }}>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .brand-track {
          display: inline-flex;
          align-items: center;
          height: 100%;
          white-space: nowrap;
          animation: marquee 18s linear infinite;
          will-change: transform;
        }
        .brand-track:hover { animation-play-state: paused; }
      `}</style>
      {/* Ambient fog */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, rgba(128,97,255,0.3) 0%, rgba(255,51,188,0.18) 35%, transparent 65%)",
        filter: "blur(22px)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      {/* Edge fades — fade to the light page background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(90deg,
          ${C.ink} 0%,
          transparent 12%,
          transparent 88%,
          ${C.ink} 100%)`,
        pointerEvents: "none",
        zIndex: 2,
      }} />
      {/* Scrolling track */}
      <div className="brand-track" style={{ zIndex: 3, position: "relative" }}>
        {items.map((brand, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 700,
              color: C.white,          // deep violet-ink — readable on light strip
              letterSpacing: "0.02em",
              padding: "0 32px",
              textShadow: "0 1px 8px rgba(128,97,255,0.35)",
            }}>
              {brand}
            </span>
            <span style={{
              display: "inline-block",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: C.magenta,
              opacity: 0.7,
              flexShrink: 0,
            }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Keynote Speakers ─────────────────────────────────────────────────────
function KeynoteSpeakers() {
  const speakers = [
    {
      src: "/Speaker 1.webp",
      name: "Cindy Bokāne",
      role: "@cindywanderlust · 31K Followers",
    },
    {
      src: "/Speaker 2.webp",
      name: "Armands Simsons",
      role: "@armandssimsons · 38.7K Followers",
    },
  ];
  return (
    <section style={{ marginTop: 64 }}>
      <Label text="On Stage" />
      <h2 style={sectionTitle}>Keynote Speakers</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 260px",
        justifyContent: "center",
        gap: 48,
        marginTop: 24,
      }}>
        {speakers.map((s, i) => (
          <div key={i} style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            height: 300,
            background: "rgba(128,97,255,0.08)",
            border: `1px solid ${C.vBorder}`,   // visible border on light bg
          }}>
            <img
              src={s.src}
              alt={s.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                display: "block",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: "100%",
              height: 200,
              background: "radial-gradient(ellipse at 30% 85%, rgba(128,97,255,0.65) 0%, rgba(255,51,188,0.32) 38%, transparent 68%)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute",
              bottom: 20,
              left: 18,
            }}>
              {/* Always white — sits on top of a photo */}
              <div style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                textShadow: "0 1px 12px rgba(128,97,255,0.9), 0 0 28px rgba(255,51,188,0.55)",
              }}>
                {s.name}
              </div>
              <div style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 400,
                color: "rgba(255,255,255,0.8)",
                marginTop: 5,
                letterSpacing: "0.04em",
                textShadow: "0 1px 8px rgba(128,97,255,0.8)",
              }}>
                {s.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Luma Form ────────────────────────────────────────────────────────────
function LumaForm() {
  useEffect(() => {
    const el = document.getElementById("apply");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.gtag?.("event", "signup_section_viewed", {
            event_category: "engagement",
            event_label: "luma_form",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="apply"
      style={{ marginTop: 64 }}
      onClick={() => {
        window.gtag?.("event", "signup_section_clicked", {
          event_category: "engagement",
          event_label: "luma_form",
        });
      }}
    >
      <Label text="Apply" />
      <h2 style={sectionTitle}>Sign Up</h2>
      <p style={{
        fontFamily: `'Rubik', var(--font-rubik), sans-serif`,
        marginTop: 10,
        marginBottom: 0,
        fontSize: 13,
        fontWeight: 500,
        color: C.magenta,           // vivid magenta pops on light bg
        letterSpacing: "0.04em",
        textAlign: "center",
      }}>
        Free for creators — no ticket, no fee, ever
      </p>
      <div style={{
        marginTop: 24,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        lineHeight: 0,
      }}>
        <iframe
          src="https://lu.ma/embed/event/evt-guA9zHzcVg5vgdw/simple"
          width="100%"
          height="600"
          scrolling="no"
          frameBorder="0"
          style={{
            display: "block",
            border: "none",
            width: "calc(100% + 17px)",
            marginBottom: "-4px",
          }}
          allow="fullscreen; payment"
          title="Apply to attend Nex"
        />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────
function AboutNex() {
  return (
    <section style={{ marginTop: 64 }}>
      <Label text="Our Story" />
      <h2 style={sectionTitle}>About Nex</h2>
      <p style={{
        fontFamily: FONT,
        marginTop: 16,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.9,
        color: C.dimText,           // dark muted on light bg
      }}>
        Nex is the platform built in the Baltics, for the Baltics. We connect
        creators with the brands that actually operate here — not global
        campaigns adapted for a regional afterthought, but campaigns written
        for Latvian, Estonian, and Lithuanian audiences from day one.
        Building From Baltics For Baltics means every partnership, every
        campaign, and every creator on our roster is rooted in the culture
        we live in. We earn when creators earn — so every decision we make
        points in the same direction. Building From Baltics For Baltics.
      </p>
    </section>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────
function Label({ text }: { text: string }) {
  return (
    <div className="section-label" style={{ fontFamily: FONT, textAlign: "center" }}>
      {text}
    </div>
  );
}

function PhotoCaption({ text }: { text: string }) {
  return (
    <>
      <div style={{
        position: "absolute",
        bottom: -20,
        left: -20,
        width: "120%",
        height: 120,
        background: "radial-gradient(ellipse at 25% 80%, rgba(128,97,255,0.6) 0%, rgba(255,51,188,0.28) 40%, transparent 70%)",
        filter: "blur(14px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 500,
        color: "rgba(255,255,255,0.9)",   // always white — on top of photo
        letterSpacing: "0.05em",
        textShadow: "0 1px 10px rgba(128,97,255,0.9), 0 0 20px rgba(255,51,188,0.5)",
      }}>
        {text}
      </div>
    </>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────
const sectionTitle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 28,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "#1a0a2e",               // deep violet-ink on light bg
  marginTop: 8,
  textAlign: "center",
};

const photoCell: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 12,
  background: "rgba(128,97,255,0.07)",
  border: "1px solid rgba(128,97,255,0.2)",  // visible on light bg
};

const fillImg: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

// ─── Type augmentation ────────────────────────────────────────────────────
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}