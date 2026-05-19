"use client";
/**
 * Nex · Event Landing Page — FULLY RESPONSIVE
 * Optimised for mobile (<640 px), tablet (640–900 px), desktop (>900 px)
 */
import { useEffect, useRef, useState } from "react";

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const FONT = "'Rubik', var(--font-rubik), sans-serif";
const C = {
  ink:     "#f7f5ff",
  pink:    "#ff7ac3",
  magenta: "#ff33bc",
  violet:  "#8061ff",
  white:   "#1a0a2e",
  dimText: "rgba(26,10,46,0.55)",
  border:  "rgba(255,122,195,0.35)",
  vBorder: "rgba(128,97,255,0.4)",
} as const;

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Speaker = {
  src: string; name: string; role: string;
  instagram: string; handle: string; bio: string;
};

/* ─── Hook ───────────────────────────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(1200);
  useEffect(() => {
    setW(window.innerWidth);
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GS = `
  *, *::before, *::after { box-sizing: border-box; }

  .ph  { max-width: calc(380px + 50vw); margin: 0 auto; padding: 28px 32px; }
  .pm  { max-width: calc(380px + 50vw); padding: 0 32px; margin: 0 auto; }
  .hw  { max-width: calc(380px + 50vw); margin: 20px auto 0; padding: 0 32px; }

  @media (max-width: 640px) {
    .ph { padding: 14px 16px; }
    .pm { padding: 0 14px; }
    .hw { padding: 0 14px; margin-top: 10px; }
  }
  @media (min-width: 641px) and (max-width: 900px) {
    .ph { padding: 22px 24px; }
    .pm { padding: 0 24px; }
    .hw { padding: 0 24px; }
  }

  .logo-img  { width: 64px; height: 64px; }
  .logo-name { font-size: 22px; }
  .logo-tag  { font-size: 13px; }
  @media (max-width: 640px) {
    .logo-img  { width: 44px !important; height: 44px !important; }
    .logo-name { font-size: 15px !important; }
    .logo-tag  { font-size: 10px !important; }
  }
  @media (min-width: 641px) and (max-width: 900px) {
    .logo-name { font-size: 19px !important; }
  }

  .st { font-size: 28px; }
  @media (max-width: 640px)                        { .st { font-size: 22px !important; } }
  @media (min-width: 641px) and (max-width: 900px) { .st { font-size: 25px !important; } }

  .sg {
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: 260px 260px;
    justify-content: center;
    gap: 48px;
  }
  @media (max-width: 640px) {
    .sg { grid-template-columns: 1fr 1fr; gap: 12px; }
  }
  @media (min-width: 641px) and (max-width: 900px) {
    .sg { grid-template-columns: 1fr 1fr; gap: 22px; max-width: 540px; margin: 0 auto; }
  }

  .sk { cursor: pointer; transition: transform .22s ease, box-shadow .22s ease; }
  .sk:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: 0 12px 40px rgba(128,97,255,.35), 0 0 0 1.5px rgba(255,122,195,.55) !important;
  }
  .sk:hover .svh { opacity: 1 !important; }

  .rb {
    margin-top: 24px; position: relative; border-radius: 16px;
    overflow: hidden; border: 1px solid rgba(128,97,255,.4);
    height: 260px; line-height: 0;
  }
  @media (max-width: 640px)                        { .rb { height: 180px; border-radius: 12px; } }
  @media (min-width: 641px) and (max-width: 900px) { .rb { height: 220px; } }

  .mq {
    margin-top: 10px; border-radius: 14px;
    border: 1px solid rgba(128,97,255,.4);
    height: 180px; overflow: hidden;
    position: relative; background: rgba(128,97,255,.06);
  }
  @media (max-width: 640px)                        { .mq { height: 110px; border-radius: 10px; } }
  @media (min-width: 641px) and (max-width: 900px) { .mq { height: 140px; } }

  @keyframes mql { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .mt {
    display: inline-flex; align-items: center;
    height: 100%; white-space: nowrap;
    animation: mql 22s linear infinite; will-change: transform;
  }
  .mt:hover { animation-play-state: paused; }
  .mi {
    width: max-content; height: 140px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 15px;
  }
  .ml {
    width: auto; height: 100%; object-fit: cover;
    border-radius: 14px; opacity: .96;
    filter: drop-shadow(0 0 18px rgba(128,97,255,.18)) drop-shadow(0 0 28px rgba(255,51,188,.12));
    transition: transform .25s ease;
  }
  .ml:hover { transform: scale(1.04); }
  @media (max-width: 640px)                        { .mi { height: 78px; margin: 0 8px; } .ml { border-radius: 8px; } }
  @media (min-width: 641px) and (max-width: 900px) { .mi { height: 108px; margin: 0 11px; } }

  /* ── Luma ──
     Mobile height raised to 860px so the full Luma form + submit
     button is always visible without internal scrolling.          */
  .lo {
    margin-top: 24px; border-radius: 16px;
    border: 1px solid rgba(255,122,195,.35);
    overflow: hidden;
  }
  .li { display: block; width: 100%; height: 600px; border: none; }
  @media (max-width: 640px)                        { .lo { border-radius: 12px; } .li { height: 1080px; } }
  @media (min-width: 641px) and (max-width: 900px) { .li { height: 640px; } }

  .sc  { position: relative; overflow: hidden; cursor: pointer; }
  .sf  {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(128,97,255,.65) 0%, rgba(255,51,188,.42) 28%, transparent 60%);
    filter: blur(26px); opacity: .15; transition: opacity .45s ease; pointer-events: none;
  }
  .sc:hover .sf { opacity: 1; }
`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Page() {
  return (
    <div style={{ background: C.ink, minHeight: "100vh", fontFamily: FONT }}>
      <style>{GS}</style>
      <header className="ph"><LogoMark /></header>
      <HeroMosaic />
      <main className="pm">
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

/* ─── Logo ───────────────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <img src="/Nex.webp" alt="Nex logo" className="logo-img" style={{ objectFit: "contain", display: "block" }} />
      <div>
        <div className="logo-name" style={{ fontFamily: FONT, fontWeight: 650, lineHeight: 1, letterSpacing: "-0.03em", color: C.white }}>
          Creator Nexus
        </div>
        <div className="logo-tag" style={{ fontFamily: FONT, fontWeight: 350, color: C.pink, marginTop: 3 }}>
          Bringing Impactful Creators Across the Baltics Under One Roof
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Card Caption ──────────────────────────────────────────────────── */
/* Dark near-black fog — no purple bloom */
function HeroCardCaption({ text, small }: { text: string; small?: boolean }) {
  return (
    <>
      <div style={{
        position: "absolute", bottom: -18, left: -18,
        width: "120%", height: 130,
        background: "radial-gradient(ellipse at 25% 80%, rgba(20,10,40,0.55) 0%, rgba(20,10,40,0.25) 42%, transparent 72%)",
        filter: "blur(16px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: small ? 8 : 11, left: small ? 8 : 11,
        fontFamily: FONT, fontSize: small ? 9 : 11, fontWeight: 500,
        color: "rgba(255,255,255,0.92)", letterSpacing: "0.05em",
        textShadow: "0 1px 10px rgba(128,97,255,0.9), 0 0 18px rgba(255,51,188,0.45)",
        zIndex: 2,
      }}>
        {text}
      </div>
    </>
  );
}

/* ─── Hero Mosaic ────────────────────────────────────────────────────────── */
function HeroMosaic() {
  const w      = useWindowWidth();
  const mobile = w < 640;
  const tablet = w >= 640 && w < 900;

  if (mobile) {
    return (
      <div className="hw">
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 230, lineHeight: 0 }}>
          <img src="/Skyline.webp" alt="Nex Event" style={fillImg} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(16,6,36,0.82) 0%, rgba(16,6,36,0.28) 55%, transparent 100%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "absolute", bottom: 16, left: 14, zIndex: 2 }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.3, textShadow: "0 1px 12px rgba(128,97,255,0.8), 0 0 30px rgba(255,51,188,0.5)" }}>
              14th Floor, Minox Event Space — Riga, Latvia
            </div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.85)", marginTop: 4, letterSpacing: "0.04em", textShadow: "0 1px 8px rgba(128,97,255,0.7)" }}>
              May 28 · 5:30 PM
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginTop: 7 }}>
          {[
            { src: "/Event Place.webp", cap: "Beautiful Skyline Views", pos: "center" },
            { src: "/Food.webp",        cap: "Drinks & Snacks",         pos: "center" },
            { src: "/Space.webp",       cap: "Brand Collaborations",    pos: "top"    },
          ].map(({ src, cap, pos }) => (
            <div key={src} style={{ position: "relative", borderRadius: 11, overflow: "hidden", height: 112, border: "1.5px solid rgba(255,122,195,0.45)", boxShadow: "0 4px 20px rgba(128,97,255,0.18)" }}>
              <img src={src} alt="" style={{ ...fillImg, objectPosition: pos }} />
              <HeroCardCaption text={cap} small />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hw">
      <div style={{ position: "relative", borderRadius: tablet ? 16 : 20, overflow: "hidden", height: tablet ? 360 : 480, lineHeight: 0 }}>
        <img src="/Skyline.webp" alt="Nex Event" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(16,6,36,0.78) 0%, rgba(16,6,36,0.38) 42%, transparent 62%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, zIndex: 2 }}>
          <div style={{ fontFamily: FONT, fontSize: tablet ? 13 : 15, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em", lineHeight: 1.2, textShadow: "0 1px 12px rgba(128,97,255,0.8), 0 0 30px rgba(255,51,188,0.5)" }}>
            14th Floor, Minox Event Space — Riga, Latvia
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.85)", marginTop: 5, letterSpacing: "0.04em", textShadow: "0 1px 8px rgba(128,97,255,0.7)" }}>
            May 28 · 5:30 PM
          </div>
        </div>
        <div style={{ position: "absolute", top: 18, right: 18, bottom: 18, width: tablet ? "50%" : "44%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 10, zIndex: 2 }}>
          <div style={{ gridColumn: "1 / span 2", gridRow: "1", position: "relative", borderRadius: 14, overflow: "hidden", border: "1.5px solid rgba(255,122,195,0.45)", boxShadow: "0 4px 24px rgba(128,97,255,0.25)" }}>
            <img src="/Event Place.webp" alt="" style={fillImg} />
            <HeroCardCaption text="Beautiful Skyline Views" />
          </div>
          <div style={{ gridColumn: "1", gridRow: "2", position: "relative", borderRadius: 14, overflow: "hidden", border: "1.5px solid rgba(255,122,195,0.45)", boxShadow: "0 4px 20px rgba(128,97,255,0.2)" }}>
            <img src="/Food.webp" alt="" style={fillImg} />
            <HeroCardCaption text="Drinks & Snacks" />
          </div>
          <div style={{ gridColumn: "2", gridRow: "2", position: "relative", borderRadius: 14, overflow: "hidden", border: "1.5px solid rgba(255,122,195,0.45)", boxShadow: "0 4px 20px rgba(128,97,255,0.2)" }}>
            <img src="/Space.webp" alt="" style={{ ...fillImg, objectPosition: "top" }} />
            <HeroCardCaption text="Brand Collaborations" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Recap Video ────────────────────────────────────────────────────────── */
function RecapVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  function toggleSound() {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  }
  return (
    <>
      <video ref={videoRef} src="/Recap.mp4" autoPlay loop muted playsInline style={fillImg} />
      <button
        onClick={toggleSound}
        title={muted ? "Unmute" : "Mute"}
        style={{
          position: "absolute", top: 10, right: 10, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.3)",
          background: "rgba(26,10,46,0.52)", backdropFilter: "blur(6px)",
          cursor: "pointer", padding: 0, outline: "none",
        }}
      >
        {muted ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  );
}

/* ─── Last Happenings ────────────────────────────────────────────────────── */
function LastHappenings() {
  const w       = useWindowWidth();
  const mobile  = w < 640;
  const compact = w < 900;
  return (
    <section style={{ marginTop: 56 }}>
      <Label text="Gallery" />
      <h2 className="st" style={sectionTitle}>Our Last Event</h2>
      {compact ? (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: mobile ? 7 : 10 }}>
          <div style={{ ...photoCell, height: mobile ? 215 : 265 }}>
            <RecapVideo />
            <PhotoCaption text="Recap from Last Events" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: mobile ? 7 : 10 }}>
            <div style={{ ...photoCell, height: mobile ? 138 : 168 }}>
              <img src="/Scene 1.webp" alt="Event photo 1" style={fillImg} />
              <PhotoCaption text="Opening night" />
            </div>
            <div style={{ ...photoCell, height: mobile ? 138 : 168 }}>
              <img src="/Scene 2.webp" alt="Event photo 2" style={fillImg} />
              <PhotoCaption text="Casting tables" />
            </div>
          </div>
          <div style={{ ...photoCell, height: mobile ? 148 : 178 }}>
            <img src="/Scene 3.webp" alt="Event wide shot" style={{ ...fillImg, objectPosition: "top" }} />
            <PhotoCaption text="The roster reveal" />
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "200px 220px", gap: 12, marginTop: 24 }}>
          <div style={{ gridColumn: "1", gridRow: "1", ...photoCell }}>
            <img src="/Scene 1.webp" alt="Event photo 1" style={fillImg} />
            <PhotoCaption text="Opening night" />
          </div>
          <div style={{ gridColumn: "2", gridRow: "1", ...photoCell }}>
            <img src="/Scene 2.webp" alt="Event photo 2" style={fillImg} />
            <PhotoCaption text="Casting tables" />
          </div>
          <div style={{ gridColumn: "3", gridRow: "1 / span 2", ...photoCell }}>
            <RecapVideo />
            <PhotoCaption text="Recap from Last Events" />
          </div>
          <div style={{ gridColumn: "1 / span 2", gridRow: "2", ...photoCell }}>
            <img src="/Scene 3.webp" alt="Event wide shot" style={{ ...fillImg, objectPosition: "top" }} />
            <PhotoCaption text="The roster reveal" />
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── Sponsors ───────────────────────────────────────────────────────────── */
function Sponsors() {
  return (
    <section style={{ marginTop: 64 }}>
      <Label text="Partners" />
      <h2 className="st" style={sectionTitle}>Our Sponsors in Baltics</h2>
      <div className="rb">
        <img src="/RedBull Image.webp" alt="Red Bull" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <BrandMarquee />
      <p style={{ fontFamily: FONT, marginTop: 16, fontSize: 12, fontWeight: 400, color: "rgba(26,10,46,0.4)", letterSpacing: "0.06em", textAlign: "center" }}>
        And More Participating Businesses to be Announced Soon
      </p>
    </section>
  );
}

/* ─── Brand Marquee ──────────────────────────────────────────────────────── */
const MARQUEE_BRANDS = [
  { src: "/Artisan Street Bakery.webp", alt: "Artisan Street Bakery" },
  { src: "/Molberts.webp",             alt: "Molberts"              },
  { src: "/Fizio Line.webp",           alt: "Fizio Line"            },
  { src: "/Gardu Muti.webp",           alt: "Gardu Muti"            },
  { src: "/Street Pizza.webp",         alt: "Street Pizza"          },
  { src: "/Street Burgers.webp",       alt: "Street Burgers"        },
];
function BrandMarquee() {
  const items = [...MARQUEE_BRANDS, ...MARQUEE_BRANDS];
  return (
    <div className="mq">
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(128,97,255,0.3) 0%, rgba(255,51,188,0.18) 35%, transparent 65%)", filter: "blur(22px)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.ink} 0%, transparent 10%, transparent 90%, ${C.ink} 100%)`, pointerEvents: "none", zIndex: 2 }} />
      <div className="mt" style={{ zIndex: 3, position: "relative" }}>
        {items.map((b, i) => (
          <div key={i} className="mi">
            <img src={b.src} alt={b.alt} className="ml" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Speaker Modal ──────────────────────────────────────────────────────── */
function SpeakerModal({ speaker, onClose }: { speaker: Speaker; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(16,6,36,0.72)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 400, borderRadius: 20, overflow: "hidden", border: `1px solid ${C.vBorder}`, background: C.ink, boxShadow: "0 24px 64px rgba(128,97,255,0.3), 0 0 0 1px rgba(255,122,195,0.15)" }}>
        <div style={{ position: "relative", height: 280, lineHeight: 0, overflow: "hidden" }}>
          <img src={speaker.src} alt={speaker.name} style={{ ...fillImg, objectPosition: "top" }} />
          {/* ── same dark fog as hero ── */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", bottom: -40, left: -40, width: "100%", height: 200,
              background: "radial-gradient(ellipse at 30% 85%, rgba(20,10,40,0.60) 0%, rgba(20,10,40,0.28) 42%, transparent 72%)",
              filter: "blur(20px)",
            }} />
          </div>
          <div style={{ position: "absolute", bottom: 20, left: 20 }}>
            <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", textShadow: "0 1px 12px rgba(128,97,255,0.9), 0 0 28px rgba(255,51,188,0.55)" }}>{speaker.name}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.8)", marginTop: 10, lineHeight: 1.5, letterSpacing: "0.04em", textShadow: "0 1px 8px rgba(128,97,255,0.8)" }}>{speaker.role}</div>
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(26,10,46,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0, outline: "none", zIndex: 2 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={{ padding: "20px 22px 24px" }}>
          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, lineHeight: 1.8, color: C.dimText, margin: 0 }}>{speaker.bio}</p>
          <a href={speaker.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, textDecoration: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.magenta} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill={C.magenta} stroke="none" />
            </svg>
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.magenta, letterSpacing: "0.02em" }}>{speaker.handle}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Keynote Speakers ───────────────────────────────────────────────────── */
function KeynoteSpeakers() {
  const speakers: Speaker[] = [
    {
      src: "/Speaker 1.webp",
      name: "Cindy Bokāne",
      role: "@cindywanderlust · 31K Followers",
      instagram: "https://www.instagram.com/cindywanderlust",
      handle: "@cindywanderlust",
      bio: "Cindy is a lifestyle and travel creator based in Riga, known for her authentic storytelling and sharp eye for Baltic culture. She has collaborated with leading local and international brands, bringing genuine audience connection to every campaign she takes on.",
    },
    {
      src: "/Speaker 2.webp",
      name: "Armands Simsons",
      role: "@armandssimsons · 38.7K Followers",
      instagram: "https://www.instagram.com/armandssimsons",
      handle: "@armandssimsons",
      bio: "Armands creates content at the intersection of fitness, entrepreneurship, and Baltic lifestyle. His highly engaged community trusts his voice across product launches, events, and brand partnerships throughout the region.",
    },
  ];
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const w       = useWindowWidth();
  const mobile  = w < 640;
  const compact = w < 900;
  const cardH   = mobile ? 225 : compact ? 268 : 300;

  return (
    <section style={{ marginTop: 64 }}>
      <Label text="On Stage" />
      <h2 className="st" style={sectionTitle}>Keynote Speakers</h2>
      <div style={{ position: "relative", marginTop: 24 }}>
        {!mobile && (
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100vw", height: 300, pointerEvents: "none", zIndex: 0, overflow: "visible" }}>
            <svg viewBox="0 0 1440 300" width="100%" height="300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
              <defs>
                {(["glowViolet","glowMagenta","glowPink"] as const).map(id => (
                  <filter key={id} id={id} x="-30%" y="-200%" width="160%" height="500%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
                    <feMerge><feMergeNode in="blur1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                ))}
              </defs>
              <path d="M 0,38 C 480,150 960,150 1440,38"  fill="none" stroke="#8061ff" strokeWidth="1.4" filter="url(#glowViolet)"  opacity="0.85" />
              <path d="M 0,150 C 480,150 960,150 1440,150" fill="none" stroke="#ff33bc" strokeWidth="1.4" filter="url(#glowMagenta)" opacity="0.85" />
              <path d="M 0,262 C 480,150 960,150 1440,262" fill="none" stroke="#ff7ac3" strokeWidth="1.4" filter="url(#glowPink)"    opacity="0.85" />
            </svg>
          </div>
        )}
        <div className="sg">
          {speakers.map((s, i) => (
            <div key={i} className="sk" onClick={() => setActiveSpeaker(s)} style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: cardH, background: "rgba(128,97,255,0.08)", border: `1px solid ${C.vBorder}` }}>
              <img src={s.src} alt={s.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
              {/* ── same dark fog as hero ── */}
              <div style={{
                position: "absolute", bottom: -40, left: -40, width: "100%", height: 200,
                background: "radial-gradient(ellipse at 30% 85%, rgba(20,10,40,0.60) 0%, rgba(20,10,40,0.28) 42%, transparent 72%)",
                filter: "blur(20px)", pointerEvents: "none",
              }} />
              <div className="svh" style={{ position: "absolute", top: 12, right: 12, opacity: 0, transition: "opacity 0.22s ease", display: "flex", alignItems: "center", gap: 5, background: "rgba(26,10,46,0.58)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,122,195,0.4)", borderRadius: 20, padding: "5px 11px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.pink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.pink, letterSpacing: "0.06em", textTransform: "uppercase" }}>View</span>
              </div>
              <div style={{ position: "absolute", bottom: mobile ? 13 : 20, left: mobile ? 12 : 18 }}>
                <div style={{ fontFamily: FONT, fontSize: mobile ? 13 : 16, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em", lineHeight: 1.2, textShadow: "0 1px 12px rgba(128,97,255,0.9), 0 0 28px rgba(255,51,188,0.55)" }}>{s.name}</div>
                <div style={{ fontFamily: FONT, fontSize: mobile ? 10 : 12, fontWeight: 400, color: "rgba(255,255,255,0.8)", marginTop: 4, letterSpacing: "0.04em", textShadow: "0 1px 8px rgba(128,97,255,0.8)" }}>{s.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeSpeaker && <SpeakerModal speaker={activeSpeaker} onClose={() => setActiveSpeaker(null)} />}
    </section>
  );
}

/* ─── Luma Form ──────────────────────────────────────────────────────────── */
function LumaForm() {
  useEffect(() => {
    const el = document.getElementById("apply");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.gtag?.("event", "signup_section_viewed", { event_category: "engagement", event_label: "luma_form" });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="apply" style={{ marginTop: 64 }} onClick={() => window.gtag?.("event", "signup_section_clicked", { event_category: "engagement", event_label: "luma_form" })}>
      <Label text="Apply" />
      <h2 className="st" style={sectionTitle}>Sign Up</h2>
      <p style={{ fontFamily: FONT, marginTop: 10, marginBottom: 0, fontSize: 13, fontWeight: 500, color: C.magenta, letterSpacing: "0.04em", textAlign: "center" }}>
        Free for creators — no ticket, no fee, ever
      </p>
      <div style={{ marginTop: 24, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <iframe
          src="https://lu.ma/embed/event/evt-guA9zHzcVg5vgdw/simple"
          scrolling="no"
          frameBorder="0"
          allow="fullscreen; payment"
          title="Apply to attend Creator Nexus"
          style={{
            display: "block",
            border: "none",
            width: "calc(100% + 17px)",
            marginLeft: "-8.5px",
            marginRight: "-8.5px",
            height: 600,
            marginBottom: -4,
          }}
        />
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────────────── */
function AboutNex() {
  return (
    <section style={{ marginTop: 64 }}>
      <Label text="Our Story" />
      <h2 className="st" style={sectionTitle}>About Us</h2>
      <p style={{ fontFamily: FONT, marginTop: 16, fontSize: 14, fontWeight: 400, lineHeight: 1.9, color: C.dimText }}>
        Nexfluence is an influencer marketing company built in the Baltics, scaling across Europe.
        We connect the right creators with the right brands through smart matching and
        performance-driven partnerships, so both sides win. Through Creator Nexus, our community
        and events platform, we invest in educating and elevating creators because they are the
        future of the creator economy and we stand with each one of them.
      </p>
    </section>
  );
}

/* ─── Shared helpers ─────────────────────────────────────────────────────── */
function Label({ text }: { text: string }) {
  return (
    <div style={{ fontFamily: FONT, textAlign: "center", fontSize: 13, fontWeight: 700, color: C.violet, opacity: 0.9, marginBottom: 2 }}>
      {text}
    </div>
  );
}

/* PhotoCaption — dark near-black fog matching the hero cards */
function PhotoCaption({ text }: { text: string }) {
  return (
    <>
      <div style={{
        position: "absolute", bottom: -20, left: -20, width: "120%", height: 120,
        background: "radial-gradient(ellipse at 25% 80%, rgba(20,10,40,0.55) 0%, rgba(20,10,40,0.25) 42%, transparent 72%)",
        filter: "blur(14px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 12, left: 12,
        fontFamily: FONT, fontSize: 11, fontWeight: 500,
        color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em",
        textShadow: "0 1px 10px rgba(128,97,255,0.9), 0 0 20px rgba(255,51,188,0.5)",
      }}>
        {text}
      </div>
    </>
  );
}

/* ─── Style constants ────────────────────────────────────────────────────── */
const sectionTitle: React.CSSProperties = {
  fontFamily: FONT, fontWeight: 900, letterSpacing: "-0.03em",
  lineHeight: 1.1, color: "#1a0a2e", marginTop: 8, textAlign: "center",
};
const photoCell: React.CSSProperties = {
  position: "relative", overflow: "hidden", borderRadius: 12,
  background: "rgba(128,97,255,0.07)", border: "1px solid rgba(128,97,255,0.2)",
};
const fillImg: React.CSSProperties = {
  position: "absolute", inset: 0, width: "100%", height: "100%",
  objectFit: "cover", display: "block",
};

/* ─── Window type augment ────────────────────────────────────────────────── */
declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}