/**
 * Nex · Event Landing Page
 * ─────────────────────────────────────────────────────────────────────
 * IMAGES: Place your files in the /public folder of your Next.js project:
 *
 *   public/
 *   ├── hero.jpg              ← Full-width top banner image
 *   ├── event-1.jpg           ← Gallery square top-left
 *   ├── event-2.jpg           ← Gallery square top-middle
 *   ├── event-reel.mp4        ← Gallery tall reel (right column, both rows)
 *   ├── event-wide.jpg        ← Gallery wide bottom-left
 *   ├── sponsor-redbull.jpg   ← RedBull campaign image
 *   ├── sponsor-2.jpg         ← Second sponsor logo/image
 *   └── sponsor-3.jpg         ← Third sponsor logo/image
 *
 * Then replace the <img src="..."> paths below with your actual filenames.
 * All images use standard <img> tags so no width/height props are required.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─── Inline style constants ───────────────────────────────────────────────
// Keeping styles as inline objects so this is fully self-contained
// and there are zero className-resolution errors.

const FONT = "'Rubik', var(--font-rubik), sans-serif";

const C = {
  ink:     "#0a0612",
  pink:    "#ff7ac3",
  magenta: "#ff33bc",
  violet:  "#8061ff",
  indigo:  "#6a66ff",
  white:   "#ffffff",
  dimText: "rgba(255,255,255,0.5)",
  border:  "rgba(255,122,195,0.22)",
  vBorder: "rgba(128,97,255,0.3)",
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div style={{ background: C.ink, minHeight: "100vh", fontFamily: FONT }}>

      {/* ── Logo-only nav ── */}
      <header style={{ maxWidth: "calc(380px + 50vw)", margin: "0 auto", padding: "28px 32px" }}>
        <LogoMark />
      </header>

      {/* ── Full-width hero image — no rounding, no border, full bleed ── */}
      {/* Replace /hero.jpg with your actual image path in /public */}
      <div style={{ width: "100%", lineHeight: 0 }}>
        <img
          src="/hero.jpg"
          alt="Nex Event"
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            /* Remove maxHeight if you want the full natural image height */
            maxHeight: "520px",
          }}
        />
      </div>

      {/* ── Main content — constrained width, left-aligned ── */}
      <main style={{ maxWidth: "calc(380px + 50vw)", padding: "0 32px", margin: "0 auto" }}>

        <LastHappenings />
        <Sponsors />
        <LumaForm />
        <AboutNex />

        {/* Bottom breathing room */}
        <div style={{ height: 80 }} />
      </main>

    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%"   stopColor="#FF7AC3" />
            <stop offset="50%"  stopColor="#FF33BC" />
            <stop offset="100%" stopColor="#8061FF" />
          </linearGradient>
        </defs>
        <rect x="20" y="1" width="27" height="27" rx="5"
          transform="rotate(45 20 1)" fill="url(#lg)" />
      </svg>

      <div>
        <div style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: C.white,
        }}>
          Nex
        </div>
        <div style={{
          fontFamily: FONT,
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: C.pink,
          marginTop: 3,
        }}>
          Building From Baltics For Baltics
        </div>
      </div>
    </div>
  );
}

// ─── Last Happenings ──────────────────────────────────────────────────────
// Bento grid — matches wireframe exactly:
//   [sq 1]  [sq 2]  | [tall reel — spans 2 rows]
//   [wide ────────] | [continued]

function LastHappenings() {
  return (
    <section style={{ marginTop: 56 }}>
      <Label text="Gallery" />
      <h2 style={sectionTitle}>Our Last Event</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "180px 200px",
        gap: 10,
        marginTop: 24,
      }}>

        {/* Square 1 — replace src with your image */}
        <div style={{ gridColumn: "1", gridRow: "1", ...photoCell }}>
          <img
            src="/event-1.jpg"
            alt="Event photo 1"
            style={fillImg}
          />
          <PhotoCaption text="Opening night" />
        </div>

        {/* Square 2 — replace src with your image */}
        <div style={{ gridColumn: "2", gridRow: "1", ...photoCell }}>
          <img
            src="/event-2.jpg"
            alt="Event photo 2"
            style={fillImg}
          />
          <PhotoCaption text="Casting tables" />
        </div>

        {/* Tall reel — replace src with your .mp4 reel */}
        <div style={{ gridColumn: "3", gridRow: "1 / span 2", ...photoCell }}>
          <video
            src="/event-reel.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={fillImg}
          />
          <PhotoCaption text="Reel" />
        </div>

        {/* Wide landscape — replace src with your image */}
        <div style={{ gridColumn: "1 / span 2", gridRow: "2", ...photoCell }}>
          <img
            src="/event-wide.jpg"
            alt="Event wide shot"
            style={fillImg}
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
      <Label text="Partners" />
      <h2 style={sectionTitle}>Our Sponsors in Baltics</h2>

      {/* Main sponsor — RedBull */}
      <div style={{
        marginTop: 24,
        borderRadius: 16,
        border: `1px solid ${C.vBorder}`,
        background: "rgba(128,97,255,0.08)",
        overflow: "hidden",
      }}>
        {/* Replace /sponsor-redbull.jpg with your actual image */}
        <img
          src="/sponsor-redbull.jpg"
          alt="Red Bull"
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            maxHeight: 220,
          }}
        />
        <div style={{ padding: "20px 24px" }}>
          <div style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: C.white,
          }}>
            Red Bull
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: 13,
            color: C.dimText,
            marginTop: 6,
            lineHeight: 1.6,
          }}>
            Headline partner · Baltic creator campaigns
          </div>
        </div>
      </div>

      {/* Two supporting sponsors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <SponsorTile imgSrc="/sponsor-2.jpg" name="Vapiano" />
        <SponsorTile imgSrc="/sponsor-3.jpg" name="Dzintari SPA" />
      </div>
    </section>
  );
}

function SponsorTile({ imgSrc, name }: { imgSrc: string; name: string }) {
  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${C.vBorder}`,
      background: "rgba(128,97,255,0.07)",
      overflow: "hidden",
    }}>
      <img
        src={imgSrc}
        alt={name}
        style={{
          width: "100%",
          display: "block",
          objectFit: "cover",
          height: 120,
        }}
      />
      <div style={{
        padding: "12px 16px",
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 700,
        color: "rgba(255,255,255,0.75)",
      }}>
        {name}
      </div>
    </div>
  );
}

// ─── Luma Form ────────────────────────────────────────────────────────────
// Only the iframe — no extra buttons, no checkbox, no UI chrome around it.
// scrolling="no" disables the iframe's own internal scrollbar.
// Height is set tall enough that Luma's form doesn't need to scroll.

function LumaForm() {
  return (
    <section id="apply" style={{ marginTop: 64 }}>
      <Label text="Apply" />
      <h2 style={sectionTitle}>Sign Up</h2>

      {/* 
        overflow: hidden on the wrapper clips any iframe overflow.
        scrolling="no" is the key — it tells the iframe not to show a scrollbar.
        If the form content is taller than the height, increase the height below.
      */}
      <div style={{
        marginTop: 24,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        lineHeight: 0, /* removes gap below inline iframe */
      }}>
        <iframe
          src="https://luma.com/embed/event/evt-guA9zHzcVg5vgdw/simple"
          width="100%"
          height="600"
          /* scrolling="no" suppresses the iframe's own scrollbar */
          scrolling="no"
          frameBorder="0"
          style={{
            display: "block",
            border: "none",
            overflow: "hidden",
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
        color: C.dimText,
        maxWidth: 600,
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
    <div className="section-label" style={{ fontFamily: FONT }}>
      {text}
    </div>
  );
}

function PhotoCaption({ text }: { text: string }) {
  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "28px 12px 10px",
      background: "linear-gradient(to top, rgba(10,6,18,0.75), transparent)",
      fontFamily: FONT,
      fontSize: 11,
      fontWeight: 500,
      color: "rgba(255,255,255,0.7)",
      letterSpacing: "0.05em",
    }}>
      {text}
    </div>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 28,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "#fff",
  marginTop: 8,
  textAlign: "left",
};

const photoCell: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 12,
  background: "rgba(128,97,255,0.12)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const fillImg: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};