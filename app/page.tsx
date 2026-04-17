'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const LAUNCH = new Date('2026-05-04T09:00:00')

/** @type {Record<string, {emoji:string, tag:string, title:string, msg:string}>} */
const MESSAGES = {
  brand: {
    emoji: '🏢',
    tag: 'Brand Partner',
    title: 'Your Brand Is In.',
    msg: "Welcome to Nexus as a Brand partner. We're engineering the platform that gives your campaigns the precision and cultural alignment they deserve — connecting you with creators who genuinely move audiences. Expect a personal onboarding call before launch day.",
  },
  influencer: {
    emoji: '✨',
    tag: 'Creator',
    title: "Let's Build Together.",
    msg: "You're officially on the list, creator. Nexus connects your audience with brands that actually make sense for you — strategic partnerships that grow your career, not just your follower count. Your spot is secured. See you on May 4th.",
  },
  agency: {
    emoji: '📊',
    tag: 'Agency Partner',
    title: 'Welcome Aboard, Agency.',
    msg: "Nexus was architected with agencies in mind. Multi-client dashboards, roster management, and campaign analytics at the scale you operate at. We'll reach out with early access details before the public launch.",
  },
}

// ─── CITY DATA ───────────────────────────────────────────────────────────────
const CITIES = [
  { name: 'Baltics',       lat: 57.0, lon:  24.0, r: 9, pulses: 4, rgb: [124, 58, 237], primary: true  },
  { name: 'New York',      lat: 40.7, lon: -74.0, r: 5, pulses: 2, rgb: [236, 72, 153], primary: false },
  { name: 'United States', lat: 39.0, lon:-100.0, r: 5, pulses: 1, rgb: [236, 72, 153], primary: false },
  { name: 'London',        lat: 51.5, lon:  -0.1, r: 5, pulses: 2, rgb: [245, 158,  11], primary: false },
  { name: 'Germany',       lat: 51.2, lon:  10.5, r: 5, pulses: 2, rgb: [124, 58, 237], primary: false },
  { name: 'Sweden',        lat: 62.5, lon:  16.5, r: 5, pulses: 1, rgb: [124, 58, 237], primary: false },
  { name: 'Mumbai',        lat: 19.0, lon:  72.8, r: 5, pulses: 2, rgb: [236, 72, 153], primary: false },
]

// ─── GEO HELPERS ─────────────────────────────────────────────────────────────
function latLonToXY(lat, lon, W, H) {
  return { x: (lon + 180) / 360 * W, y: (90 - lat) / 180 * H }
}

function isLand(lat, lon) {
  if (lat < -58) return true
  if (lon >= -58 && lon <= -17 && lat >= 60 && lat <= 84) return true   // Greenland
  if (lon >= -24 && lon <= -13 && lat >= 63 && lat <= 67) return true   // Iceland
  // North America
  if (lat >= 5 && lat <= 73 && lon >= -168 && lon <= -52) {
    if (lon >= -95 && lon <= -75 && lat >= 51 && lat <= 65) return false // Hudson Bay
    if (lon >= -97 && lon <= -80 && lat >= 18 && lat <= 30) return false // Gulf of Mexico
    if (lon >= -85 && lon <= -60 && lat >=  8 && lat <= 24) return false // Caribbean
    return true
  }
  if (lat >= -55 && lat <= 12 && lon >= -82 && lon <= -33) return true  // South America
  if (lat >= 50 && lat <= 62 && lon >= -11 && lon <=  2) return true    // UK / Ireland
  // Europe
  if (lat >= 36 && lat <= 72 && lon >= -10 && lon <= 40) {
    if (lat >= 30 && lat <= 40 && lon >= -2 && lon <= 30) return false   // Mediterranean
    return true
  }
  if (lat >= 55 && lat <= 72 && lon >=  5 && lon <= 32) return true     // Scandinavia / Baltics
  if (lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52) return true   // Africa
  if (lat >= 12 && lat <= 42 && lon >= 35 && lon <= 62) return true     // Middle East
  if (lat >=  5 && lat <= 37 && lon >= 60 && lon <= 92) return true     // South Asia
  if (lat >= -10 && lat <= 25 && lon >= 92 && lon <= 142) return true   // SE Asia
  if (lat >= 20 && lat <= 54 && lon >= 100 && lon <= 145) return true   // East Asia
  if (lat >= 50 && lat <= 75 && lon >= 35 && lon <= 180) return true    // Russia
  if (lat >= 30 && lat <= 46 && lon >= 130 && lon <= 146) return true   // Japan
  if (lat >= -39 && lat <= -10 && lon >= 112 && lon <= 155) return true // Australia
  if (lat >= -47 && lat <= -34 && lon >= 165 && lon <= 179) return true // New Zealand
  return false
}

// ─── WORLD MAP ───────────────────────────────────────────────────────────────
function WorldMapCanvas() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width   // 1000
    const H = canvas.height  // 480

    // Pre-build land dot grid once
    const COLS = 130, ROWS = 62
    const dots = []
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const lat = 90   - (row + 0.5) * (180 / ROWS)
        const lon = -180 + (col + 0.5) * (360 / COLS)
        if (isLand(lat, lon)) {
          dots.push({ x: (col + 0.5) * (W / COLS), y: (row + 0.5) * (H / ROWS) })
        }
      }
    }

    const mapped = CITIES.map(city => ({ ...city, ...latLonToXY(city.lat, city.lon, W, H) }))
    const hub    = mapped.find(c => c.primary)
    let tick     = 0

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Land dots
      ctx.fillStyle = 'rgba(124,58,237,0.18)'
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }

      // Animated arcs from Baltics hub
      if (hub) {
        for (const city of mapped.filter(c => !c.primary)) {
          const cpX  = (hub.x + city.x) / 2
          const cpY  = (hub.y + city.y) / 2 - Math.hypot(city.x - hub.x, city.y - hub.y) * 0.2
          const grad = ctx.createLinearGradient(hub.x, hub.y, city.x, city.y)
          grad.addColorStop(0, 'rgba(124,58,237,0.55)')
          grad.addColorStop(1, `rgba(${city.rgb[0]},${city.rgb[1]},${city.rgb[2]},0.25)`)
          ctx.save()
          ctx.setLineDash([6, 9])
          ctx.lineDashOffset = -(tick * 0.35) % 15
          ctx.strokeStyle    = grad
          ctx.lineWidth      = 1.1
          ctx.globalAlpha    = 0.65
          ctx.beginPath()
          ctx.moveTo(hub.x, hub.y)
          ctx.quadraticCurveTo(cpX, cpY, city.x, city.y)
          ctx.stroke()
          ctx.restore()
        }
      }

      // City markers
      mapped.forEach((city, i) => {
        const [r0, g0, b0] = city.rgb

        // Pulse rings
        for (let p = 0; p < city.pulses; p++) {
          const phase  = (tick * 0.016 + p * (1 / city.pulses) + i * 0.12) % 1
          const maxR   = city.primary ? 36 : 24
          const alpha  = (1 - phase) * (city.primary ? 0.55 : 0.38)
          ctx.strokeStyle = `rgba(${r0},${g0},${b0},${alpha})`
          ctx.lineWidth   = city.primary ? 2.2 : 1.6
          ctx.beginPath()
          ctx.arc(city.x, city.y, city.r + phase * maxR, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Glow
        const glow = ctx.createRadialGradient(city.x, city.y, 0, city.x, city.y, city.r * 3.5)
        glow.addColorStop(0, `rgba(${r0},${g0},${b0},0.35)`)
        glow.addColorStop(1, 'transparent')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(city.x, city.y, city.r * 3.5, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = `rgb(${r0},${g0},${b0})`
        ctx.beginPath()
        ctx.arc(city.x, city.y, city.r, 0, Math.PI * 2)
        ctx.fill()

        // White inner highlight
        ctx.fillStyle = 'rgba(255,255,255,0.88)'
        ctx.beginPath()
        ctx.arc(city.x, city.y, city.r * 0.38, 0, Math.PI * 2)
        ctx.fill()

        // Label
        ctx.font      = `${city.primary ? '600' : '400'} ${city.primary ? 11 : 9}px Rubik, sans-serif`
        const tw      = ctx.measureText(city.name).width
        const lx      = city.x > W * 0.82 ? city.x - city.r - 6 - tw : city.x + city.r + 6
        ctx.fillStyle = city.primary ? `rgb(${r0},${g0},${b0})` : 'rgba(80,40,130,0.82)'
        ctx.fillText(city.name, lx, city.y + 4)
      })

      tick++
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={480}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  )
}

// ─── COUNTDOWN BOX ───────────────────────────────────────────────────────────
function CdUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2.5">
      <div
        className="font-black leading-none text-gray-900 bg-white rounded-2xl text-center tabular-nums"
        style={{
          fontSize:  'clamp(28px,5.5vw,64px)',
          minWidth:  'clamp(60px,9vw,116px)',
          padding:   'clamp(12px,2vw,22px) clamp(10px,1.5vw,18px) clamp(10px,1.8vw,20px)',
          border:    '1.5px solid rgba(124,58,237,0.1)',
          boxShadow: '0 4px 24px rgba(124,58,237,0.07)',
        }}
      >
        {value}
      </div>
      <span
        className="font-semibold uppercase text-gray-400 tracking-widest"
        style={{ fontSize: 'clamp(7px,1.2vw,10px)', letterSpacing: '0.22em' }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function Home() {
  const [time,    setTime   ] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [cat,     setCat    ] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modal,   setModal  ] = useState(null)
  const [catErr,  setCatErr ] = useState(false)
  const [stats,   setStats  ] = useState({ brands: 247, influencers: 1834, agencies: 89 })
  const [anim,    setAnim   ] = useState({ brands: 0, influencers: 0, agencies: 0 })

  const statsRef   = useRef(null)
  const formRef    = useRef(null)
  const confCanvas = useRef(null)   // separate canvas only for confetti
  const confData   = useRef({ parts: [], running: false })

  // ── Countdown
  useEffect(() => {
    const tick = () => {
      const diff = LAUNCH - Date.now()
      if (diff <= 0) return
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000)  / 60000),
        s: Math.floor((diff % 60000)    / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // ── Stats counter (re-runs when a stat changes after signup)
  const statsKey = `${stats.brands}-${stats.influencers}-${stats.agencies}`
  useEffect(() => {
    const targets = { ...stats }
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const t0  = performance.now()
      const dur = 2200
      const run = (now) => {
        const p    = Math.min((now - t0) / dur, 1)
        const ease = 1 - Math.pow(1 - p, 4)
        setAnim({
          brands:      Math.round(ease * targets.brands),
          influencers: Math.round(ease * targets.influencers),
          agencies:    Math.round(ease * targets.agencies),
        })
        if (p < 1) requestAnimationFrame(run)
        else setAnim({ brands: targets.brands, influencers: targets.influencers, agencies: targets.agencies })
      }
      requestAnimationFrame(run)
      obs.disconnect()
    }, { threshold: 0.4 })

    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [statsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Confetti canvas resize
  useEffect(() => {
    const resize = () => {
      if (confCanvas.current) {
        confCanvas.current.width  = window.innerWidth
        confCanvas.current.height = window.innerHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── ESC key + body scroll lock
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modal])

  // ── Synthesised zoom + chime sound
  const playZoom = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AC  = window.AudioContext || window['webkitAudioContext']
      const ctx = new AC()
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      const f   = ctx.createBiquadFilter()
      f.type = 'bandpass'
      f.Q.value = 1.2
      f.frequency.setValueAtTime(100, ctx.currentTime)
      f.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.25)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(60, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25)
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45)
      osc.connect(f); f.connect(g); g.connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + 0.5)

      ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const c2 = new AC()
        const o  = c2.createOscillator()
        const g2 = c2.createGain()
        o.type = 'sine'
        o.frequency.value = freq
        const t = c2.currentTime + 0.12 + i * 0.09
        g2.gain.setValueAtTime(0, t)
        g2.gain.linearRampToValueAtTime(0.12, t + 0.02)
        g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
        o.connect(g2); g2.connect(c2.destination)
        o.start(t); o.stop(t + 0.55)
      })
    } catch (_) {
      // Audio not available — silently skip
    }
  }, [])

  // ── Confetti
  const launchConfetti = useCallback(() => {
    const cnv = confCanvas.current
    if (!cnv) return
    const cc  = cnv.getContext('2d')
    const pal = ['#7C3AED','#EC4899','#F59E0B','#FFFFFF','#A78BFA','#F472B6','#FDE68A']

    confData.current.parts = Array.from({ length: 160 }, () => {
      const ang = (Math.random() * 90 - 45) * Math.PI / 180
      const spd = Math.random() * 14 + 6
      return {
        x:     cnv.width * 0.5 + (Math.random() - 0.5) * 200,
        y:     cnv.height * 0.4,
        vx:    Math.sin(ang) * spd,
        vy:   -Math.cos(ang) * spd - Math.random() * 4,
        color: pal[Math.floor(Math.random() * pal.length)],
        size:  Math.random() * 9 + 4,
        rot:   Math.random() * 360,
        rotV:  (Math.random() - 0.5) * 12,
        life:  1,
        decay: 0.012 + Math.random() * 0.01,
        rect:  Math.random() > 0.55,
      }
    })

    confData.current.running = true

    const run = () => {
      if (!confData.current.running) return
      cc.clearRect(0, 0, cnv.width, cnv.height)
      let any = false
      confData.current.parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.45; p.vx *= 0.99; p.rot += p.rotV
        p.life = Math.max(0, p.life - p.decay)
        if (p.life <= 0) return
        any = true
        cc.save()
        cc.globalAlpha = p.life
        cc.translate(p.x, p.y)
        cc.rotate(p.rot * Math.PI / 180)
        cc.fillStyle = p.color
        if (p.rect) cc.fillRect(-p.size / 2, -p.size / 3.5, p.size, p.size / 2.8)
        else { cc.beginPath(); cc.ellipse(0, 0, p.size / 2, p.size / 3.5, 0, 0, Math.PI * 2); cc.fill() }
        cc.restore()
      })
      if (any) requestAnimationFrame(run)
      else { confData.current.running = false; cc.clearRect(0, 0, cnv.width, cnv.height) }
    }
    requestAnimationFrame(run)
  }, [])

  // ── Form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!cat) {
      setCatErr(true)
      setTimeout(() => setCatErr(false), 1200)
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setModal(MESSAGES[cat])
      setStats(prev => ({
        brands:      cat === 'brand'      ? prev.brands + 1      : prev.brands,
        influencers: cat === 'influencer' ? prev.influencers + 1 : prev.influencers,
        agencies:    cat === 'agency'     ? prev.agencies + 1    : prev.agencies,
      }))
      playZoom()
      setTimeout(launchConfetti, 80)
      formRef.current?.reset()
      setCat(null)
    }, 1400)
  }

  const pad = (n, l = 2) => String(n).padStart(l, '0')

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes driftA    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-50px)} }
        @keyframes driftB    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,50px)} }
        @keyframes blink     { 50%{opacity:0.12} }
        @keyframes spinAnim  { to{transform:rotate(360deg)} }
        @keyframes bounceIn  { 0%{transform:scale(0) rotate(-20deg);opacity:0} 70%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes modalUp   { from{opacity:0;transform:scale(0.82) translateY(24px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes scrollP   { 0%{transform:scaleY(0);transform-origin:top;opacity:0} 45%{transform:scaleY(1);transform-origin:top;opacity:1} 55%{transform:scaleY(1);transform-origin:bottom;opacity:1} 100%{transform:scaleY(0);transform-origin:bottom;opacity:0} }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        @keyframes dotPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.35)} 50%{box-shadow:0 0 0 7px rgba(124,58,237,0)} }

        .fu1{animation:fadeUp .9s .08s cubic-bezier(.16,1,.3,1) both}
        .fu2{animation:fadeUp .9s .22s cubic-bezier(.16,1,.3,1) both}
        .fu3{animation:fadeUp .9s .36s cubic-bezier(.16,1,.3,1) both}
        .fu4{animation:fadeUp .9s .50s cubic-bezier(.16,1,.3,1) both}
        .fu5{animation:fadeUp .9s .64s cubic-bezier(.16,1,.3,1) both}

        .blink     {animation:blink     1.2s step-end infinite}
        .scroll-p  {animation:scrollP   2s   ease-in-out infinite}
        .spin-btn  {animation:spinAnim  .7s  linear infinite}
        .emoji-in  {animation:bounceIn  .7s  .3s cubic-bezier(.34,1.56,.64,1) both}
        .modal-in  {animation:modalUp   .5s  cubic-bezier(.34,1.56,.64,1) both}
        .shake-x   {animation:shake     .4s  ease both}
        .dot-pulse {animation:dotPulse  2s   ease infinite}

        html { scroll-behavior:smooth }
        body { overflow-x:hidden; margin:0 }
        *    { box-sizing:border-box }
        ::selection { background:rgba(124,58,237,0.2) }
        input:focus  { outline:none }

        .map-card { transition:box-shadow .3s }
        .map-card:hover { box-shadow:0 20px 80px rgba(124,58,237,0.14)!important }

        .cat-btn { transition:all .18s ease }
        .cat-btn:hover { transform:translateY(-2px) }
      `}</style>

      {/* ── Confetti overlay (separate canvas from the map canvas) */}
      <canvas
        ref={confCanvas}
        style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:400 }}
      />

      {/* ── Page background */}
      <div
        style={{
          position:'fixed', inset:0, zIndex:0,
          background:'linear-gradient(145deg,#FFF5EE 0%,#FEF0FF 50%,#EEF0FF 100%)',
        }}
      />
      {/* Ambient orbs */}
      {[
        { w:700, h:700, top:-280, left:-280, bg:'rgba(124,58,237,.09)', anim:'driftA 24s ease-in-out infinite' },
        { w:600, h:600, bottom:-250, right:-250, bg:'rgba(236,72,153,.07)', anim:'driftB 30s ease-in-out infinite' },
        { w:400, h:400, top:'35%', left:'60%', bg:'rgba(245,158,11,.06)', anim:'driftA 20s 8s ease-in-out infinite reverse' },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position:'fixed', borderRadius:'50%', pointerEvents:'none', zIndex:0,
            width:orb.w, height:orb.h,
            top:orb.top, left:orb.left, bottom:orb.bottom, right:orb.right,
            background:`radial-gradient(circle,${orb.bg},transparent 65%)`,
            filter:'blur(90px)',
            animation:orb.anim,
          }}
        />
      ))}

      {/* ════════════════════ PAGE CONTENT */}
      <main style={{ position:'relative', zIndex:1 }}>

        {/* ── 1. TOP STATEMENT */}
        <section className="fu1" style={{ paddingTop:'clamp(40px,6vw,72px)', paddingBottom:0, paddingLeft:16, paddingRight:16, textAlign:'center' }}>
          <div
            style={{
              display:'inline-block', padding:'8px 20px', borderRadius:999,
              marginBottom:16, background:'rgba(124,58,237,0.07)',
              border:'1px solid rgba(124,58,237,0.14)',
            }}
          >
            <span style={{ fontSize:'clamp(8px,1.4vw,11px)', color:'#7C3AED', fontWeight:600, letterSpacing:'0.28em', textTransform:'uppercase' }}>
              A Nexfluence Product
            </span>
          </div>

          <h1
            style={{
              fontSize:'clamp(22px,4.5vw,54px)', fontWeight:900,
              lineHeight:1.12, letterSpacing:'-0.02em',
              color:'#111', margin:'0 auto 12px', maxWidth:740,
            }}
          >
            Influencer marketing is{' '}
            <span style={{ background:'linear-gradient(90deg,#7C3AED,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              changing forever.
            </span>
            <br />
            Welcome to the launch of{' '}
            <span style={{ color:'#7C3AED' }}>Nexus.</span>
          </h1>

          <p style={{ fontSize:'clamp(13px,2vw,17px)', fontWeight:300, color:'#6B7280', lineHeight:1.7, maxWidth:500, margin:'0 auto' }}>
            The precision platform for brands, creators &amp; agencies who demand real results — not reach, but revenue.
          </p>
        </section>

        {/* ── 2. COUNTDOWN */}
        <section
          className="fu2"
          style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'clamp(32px,5vw,60px) 16px' }}
        >
          <p style={{ fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.4em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:20 }}>
            Launching in
          </p>

          <div style={{ display:'flex', alignItems:'flex-start', gap:'clamp(6px,1.5vw,14px)', flexWrap:'wrap', justifyContent:'center' }}>
            <CdUnit value={pad(time.d, 3)} label="Days"  />
            <span className="blink" style={{ fontSize:'clamp(26px,5vw,56px)', fontWeight:900, color:'#8B5CF6', paddingTop:'clamp(10px,1.8vw,18px)', lineHeight:1 }}>:</span>
            <CdUnit value={pad(time.h)}    label="Hours" />
            <span className="blink" style={{ fontSize:'clamp(26px,5vw,56px)', fontWeight:900, color:'#8B5CF6', paddingTop:'clamp(10px,1.8vw,18px)', lineHeight:1 }}>:</span>
            <CdUnit value={pad(time.m)}    label="Mins"  />
            <span className="blink" style={{ fontSize:'clamp(26px,5vw,56px)', fontWeight:900, color:'#8B5CF6', paddingTop:'clamp(10px,1.8vw,18px)', lineHeight:1 }}>:</span>
            <CdUnit value={pad(time.s)}    label="Secs"  />
          </div>

          {/* Live date badge */}
          <div
            style={{
              marginTop:20, padding:'8px 20px', borderRadius:999,
              display:'flex', alignItems:'center', gap:8,
              background:'rgba(124,58,237,0.07)', border:'1px solid rgba(124,58,237,0.14)',
            }}
          >
            <span className="dot-pulse" style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#7C3AED', flexShrink:0 }} />
            <span style={{ fontSize:'clamp(8px,1.4vw,11px)', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:'#6D28D9' }}>
              May 4, 2026 · 9:00 AM
            </span>
          </div>
        </section>

        {/* ── 3. WORLD MAP */}
        <section className="fu3" style={{ padding:'0 clamp(12px,3vw,32px) clamp(8px,2vw,16px)' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <p style={{ textAlign:'center', fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.35em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:20 }}>
              Our community is already global
            </p>

            <div
              className="map-card"
              style={{
                borderRadius:'clamp(16px,2.5vw,28px)', overflow:'hidden', position:'relative',
                background:'rgba(255,255,255,0.72)',
                border:'1.5px solid rgba(124,58,237,0.1)',
                boxShadow:'0 8px 48px rgba(124,58,237,0.08)',
                backdropFilter:'blur(16px)',
              }}
            >
              {/* Legend */}
              <div style={{ position:'absolute', top:'clamp(8px,1.5vw,16px)', right:'clamp(8px,1.5vw,16px)', display:'flex', flexDirection:'column', gap:6, zIndex:10 }}>
                {[
                  { color:'#7C3AED', shadow:'0 0 6px rgba(124,58,237,0.8)', label:'Headquarters', size:10 },
                  { color:'#EC4899', shadow:'none',                          label:'Active Markets', size:8 },
                ].map(leg => (
                  <div key={leg.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ display:'inline-block', width:leg.size, height:leg.size, borderRadius:'50%', background:leg.color, boxShadow:leg.shadow, flexShrink:0 }} />
                    <span style={{ fontSize:'clamp(7px,1.1vw,10px)', fontWeight:500, color:'#6B7280' }}>{leg.label}</span>
                  </div>
                ))}
              </div>

              <WorldMapCanvas />
            </div>

            {/* City tags */}
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8, marginTop:16 }}>
              {CITIES.map(c => (
                <span
                  key={c.name}
                  style={{
                    display:'flex', alignItems:'center', gap:6,
                    padding:'6px 12px', borderRadius:999,
                    fontSize:'clamp(9px,1.3vw,11px)', fontWeight:500,
                    background: c.primary ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.85)',
                    border:`1px solid rgba(${c.rgb[0]},${c.rgb[1]},${c.rgb[2]},${c.primary ? 0.4 : 0.18})`,
                    color: c.primary ? '#7C3AED' : '#6B40A8',
                  }}
                >
                  <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:`rgb(${c.rgb[0]},${c.rgb[1]},${c.rgb[2]})`, flexShrink:0 }} />
                  {c.name}{c.primary ? ' ★' : ''}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. STATS */}
        <section className="fu4" style={{ padding:'clamp(48px,7vw,80px) clamp(12px,3vw,32px)' }}>
          <p style={{ textAlign:'center', fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.35em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:'clamp(28px,4vw,48px)' }}>
            Early Access Community — Growing Every Day
          </p>

          <div
            ref={statsRef}
            style={{
              maxWidth:860, margin:'0 auto',
              display:'grid', gridTemplateColumns:'repeat(3,1fr)',
              borderRadius:'clamp(16px,2.5vw,28px)', overflow:'hidden',
              background:'rgba(255,255,255,0.8)',
              border:'1.5px solid rgba(124,58,237,0.1)',
              boxShadow:'0 8px 48px rgba(124,58,237,0.07)',
              backdropFilter:'blur(16px)',
            }}
          >
            {[
              { val: anim.brands,      label: 'Brands Joined'      },
              { val: anim.influencers, label: 'Influencers Joined' },
              { val: anim.agencies,    label: 'Agencies Joined'    },
            ].map((s, i) => (
              <div
                key={s.label}
                className="group"
                style={{
                  textAlign:'center', position:'relative',
                  padding:'clamp(24px,4vw,52px) clamp(10px,2vw,28px)',
                  borderRight: i < 2 ? '1.5px solid rgba(124,58,237,0.08)' : 'none',
                }}
              >
                <span
                  className="block"
                  style={{
                    fontSize:'clamp(28px,5vw,56px)', fontWeight:900, lineHeight:1,
                    marginBottom:8,
                    background:'linear-gradient(135deg,#7C3AED,#EC4899)',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                  }}
                >
                  {s.val.toLocaleString()}
                </span>
                <span style={{ fontSize:'clamp(7px,1.1vw,11px)', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9CA3AF' }}>
                  {s.label}
                </span>
                <div
                  style={{
                    position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
                    height:2, width:0, borderRadius:2,
                    background:'linear-gradient(90deg,#7C3AED,#EC4899)',
                    transition:'width .5s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.width = '75%' }}
                  onMouseLeave={e => { e.currentTarget.style.width = '0' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. WAITLIST FORM */}
        <section id="join" className="fu5" style={{ padding:'0 clamp(12px,3vw,32px) clamp(60px,8vw,100px)' }}>
          <div style={{ maxWidth:440, margin:'0 auto' }}>

            {/* Form header */}
            <div style={{ textAlign:'center', marginBottom:'clamp(28px,4vw,48px)' }}>
              <span style={{
                display:'inline-block', fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600,
                letterSpacing:'0.3em', textTransform:'uppercase', padding:'7px 18px',
                borderRadius:999, marginBottom:14,
                color:'#7C3AED', background:'rgba(124,58,237,0.07)', border:'1px solid rgba(124,58,237,0.14)',
              }}>
                Secure Your Spot
              </span>
              <h2 style={{ fontSize:'clamp(24px,4vw,44px)', fontWeight:900, letterSpacing:'-0.02em', color:'#111', marginBottom:10, lineHeight:1.06 }}>
                Join the Waitlist
              </h2>
              <p style={{ fontSize:'clamp(13px,2vw,15px)', fontWeight:300, color:'#6B7280', lineHeight:1.7 }}>
                Early members unlock priority onboarding and exclusive pre-launch benefits.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Email */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <label style={{ fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9CA3AF' }}>
                  Email Address
                </label>
                <input
                  type="email" name="email" required placeholder="you@company.com"
                  style={{
                    width:'100%', background:'white', borderRadius:'clamp(12px,2vw,18px)',
                    padding:'clamp(12px,2vw,16px) clamp(14px,2vw,18px)',
                    fontSize:'clamp(13px,2vw,15px)', color:'#111',
                    border:'1.5px solid rgba(124,58,237,0.12)',
                    boxShadow:'0 2px 12px rgba(124,58,237,0.04)',
                    fontFamily:'inherit', transition:'border-color .2s, box-shadow .2s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.45)'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(124,58,237,0.07)' }}
                  onBlur ={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.12)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(124,58,237,0.04)' }}
                />
              </div>

              {/* Instagram */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <label style={{ fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9CA3AF' }}>
                  Instagram Handle
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', fontFamily:'monospace', fontSize:'clamp(13px,2vw,15px)', pointerEvents:'none' }}>@</span>
                  <input
                    type="text" name="instagram" required placeholder="yourhandle"
                    style={{
                      width:'100%', background:'white', borderRadius:'clamp(12px,2vw,18px)',
                      padding:'clamp(12px,2vw,16px) clamp(14px,2vw,18px) clamp(12px,2vw,16px) 34px',
                      fontSize:'clamp(13px,2vw,15px)', color:'#111',
                      border:'1.5px solid rgba(124,58,237,0.12)',
                      boxShadow:'0 2px 12px rgba(124,58,237,0.04)',
                      fontFamily:'inherit', transition:'border-color .2s, box-shadow .2s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.45)'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(124,58,237,0.07)' }}
                    onBlur ={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.12)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(124,58,237,0.04)' }}
                  />
                </div>
              </div>

              {/* TikTok */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <label style={{ fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9CA3AF' }}>
                  TikTok Handle <span style={{ opacity:0.45, fontWeight:400, textTransform:'none', letterSpacing:'normal', fontSize:'clamp(7px,1.1vw,9px)' }}>(optional)</span>
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', fontFamily:'monospace', fontSize:'clamp(13px,2vw,15px)', pointerEvents:'none' }}>@</span>
                  <input
                    type="text" name="tiktok" placeholder="yourhandle"
                    style={{
                      width:'100%', background:'white', borderRadius:'clamp(12px,2vw,18px)',
                      padding:'clamp(12px,2vw,16px) clamp(14px,2vw,18px) clamp(12px,2vw,16px) 34px',
                      fontSize:'clamp(13px,2vw,15px)', color:'#111',
                      border:'1.5px solid rgba(124,58,237,0.12)',
                      boxShadow:'0 2px 12px rgba(124,58,237,0.04)',
                      fontFamily:'inherit', transition:'border-color .2s, box-shadow .2s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.45)'; e.currentTarget.style.boxShadow='0 0 0 4px rgba(124,58,237,0.07)' }}
                    onBlur ={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.12)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(124,58,237,0.04)' }}
                  />
                </div>
              </div>

              {/* Category picker */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <label style={{ fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9CA3AF' }}>
                  I am joining as a
                </label>
                <div
                  className={catErr ? 'shake-x' : ''}
                  style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'clamp(8px,1.5vw,12px)' }}
                >
                  {[
                    { id:'brand',      icon:'🏢', label:'Brand'      },
                    { id:'influencer', icon:'✨', label:'Influencer' },
                    { id:'agency',     icon:'📊', label:'Agency'     },
                  ].map(item => {
                    const active = cat === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className="cat-btn"
                        onClick={() => { setCat(item.id); setCatErr(false) }}
                        style={{
                          display:'flex', flexDirection:'column', alignItems:'center',
                          gap:'clamp(6px,1.2vw,10px)',
                          padding:'clamp(14px,2.5vw,20px) clamp(8px,1.5vw,12px)',
                          borderRadius:'clamp(12px,2vw,18px)',
                          fontSize:'clamp(11px,1.6vw,13px)', fontWeight:600,
                          fontFamily:'inherit', cursor:'pointer',
                          border: active ? '2px solid #7C3AED' : catErr ? '1.5px solid rgba(239,68,68,0.4)' : '1.5px solid rgba(124,58,237,0.12)',
                          background: active ? 'rgba(124,58,237,0.08)' : 'white',
                          color:      active ? '#7C3AED' : '#9CA3AF',
                          boxShadow:  active ? '0 4px 20px rgba(124,58,237,0.15)' : 'none',
                        }}
                      >
                        <span style={{ fontSize:'clamp(18px,3vw,24px)', display:'block', transform: active ? 'scale(1.15)' : 'scale(1)', transition:'transform .2s' }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    )
                  })}
                </div>
                {catErr && (
                  <p style={{ textAlign:'center', color:'#EF4444', fontWeight:500, fontSize:'clamp(10px,1.5vw,12px)' }}>
                    Please select your category to continue
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width:'100%', marginTop:4,
                  padding:'clamp(14px,2.5vw,20px) 24px',
                  borderRadius:'clamp(12px,2vw,18px)',
                  fontSize:'clamp(13px,2vw,15px)', fontWeight:700,
                  fontFamily:'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                  color:'white', border:'none',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:12,
                  background:'linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)',
                  boxShadow: loading ? 'none' : '0 10px 40px rgba(124,58,237,0.35)',
                  opacity: loading ? 0.72 : 1,
                  transform:'translateY(0)',
                  transition:'transform .2s, box-shadow .2s, opacity .2s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)' }}
              >
                {loading && (
                  <span
                    className="spin-btn"
                    style={{ display:'inline-block', width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white' }}
                  />
                )}
                {loading ? 'Securing your spot…' : 'Secure Your Spot on Nexus →'}
              </button>

              <p style={{ textAlign:'center', fontSize:'clamp(10px,1.5vw,12px)', fontWeight:300, color:'#9CA3AF' }}>
                No spam, ever. Just your launch day access.
              </p>
            </form>
          </div>
        </section>

        {/* ── FOOTER */}
        <footer
          style={{
            padding:'clamp(20px,3vw,32px) clamp(16px,4vw,48px)',
            display:'flex', flexDirection:'row', flexWrap:'wrap',
            alignItems:'center', justifyContent:'space-between', gap:12,
            borderTop:'1px solid rgba(124,58,237,0.09)',
            background:'rgba(255,255,255,0.55)',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:10, fontWeight:900, letterSpacing:'0.08em', color:'#1F2937', fontSize:'clamp(13px,2vw,16px)' }}>
            <div style={{ width:30, height:30, borderRadius:10, background:'linear-gradient(135deg,#7C3AED,#EC4899)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:14, fontWeight:900, flexShrink:0 }}>
              ✦
            </div>
            NEXUS
            <span style={{ fontWeight:400, color:'#9CA3AF', fontSize:'clamp(11px,1.5vw,13px)' }}>by Nexfluence</span>
          </div>
          <p style={{ fontSize:'clamp(10px,1.4vw,12px)', fontWeight:300, color:'#9CA3AF' }}>
            © 2026 Nexfluence. All rights reserved. · Riga, Latvia (EU)
          </p>
        </footer>
      </main>

      {/* ════════════════════ MODAL */}
      {modal && (
        <div
          style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(16px,3vw,24px)' }}
          onClick={() => setModal(null)}
        >
          {/* Backdrop */}
          <div style={{ position:'absolute', inset:0, backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', background:'rgba(255,245,255,0.78)' }} />

          {/* Card */}
          <div
            className="modal-in"
            style={{
              position:'relative', maxWidth:520, width:'100%', background:'white',
              borderRadius:'clamp(20px,3vw,32px)', textAlign:'center',
              padding:'clamp(36px,6vw,60px) clamp(24px,5vw,52px) clamp(32px,5vw,52px)',
              border:'1.5px solid rgba(124,58,237,0.16)',
              boxShadow:'0 40px 100px rgba(124,58,237,0.18)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top glow */}
            <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:176, height:176, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.18),transparent 70%)', filter:'blur(20px)', pointerEvents:'none' }} />

            <span className="emoji-in" style={{ display:'block', fontSize:'clamp(44px,8vw,64px)', marginBottom:20 }}>
              {modal.emoji}
            </span>

            <span style={{ display:'inline-block', fontSize:'clamp(8px,1.3vw,10px)', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', padding:'6px 16px', borderRadius:999, marginBottom:16, color:'#7C3AED', background:'rgba(124,58,237,0.07)', border:'1px solid rgba(124,58,237,0.15)' }}>
              {modal.tag}
            </span>

            <h2 style={{ fontSize:'clamp(22px,4vw,32px)', fontWeight:900, letterSpacing:'-0.02em', color:'#111', marginBottom:12 }}>
              {modal.title}
            </h2>

            <p style={{ fontSize:'clamp(12px,1.8vw,15px)', fontWeight:300, color:'#6B7280', lineHeight:1.75, marginBottom:18 }}>
              {modal.msg}
            </p>

            <p style={{ fontFamily:'monospace', fontSize:'clamp(9px,1.3vw,11px)', color:'#7C3AED', letterSpacing:'0.06em', marginBottom:28 }}>
              📅 &nbsp;LAUNCHING MAY 4, 2026
            </p>

            <button
              onClick={() => setModal(null)}
              style={{
                padding:'clamp(10px,2vw,14px) clamp(24px,4vw,36px)',
                borderRadius:999, fontWeight:600, fontFamily:'inherit',
                fontSize:'clamp(11px,1.6vw,14px)', cursor:'pointer',
                background:'transparent', color:'#7C3AED',
                border:'1.5px solid rgba(124,58,237,0.22)',
                transition:'background .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(124,58,237,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
            >
              Got it — see you on launch day
            </button>
          </div>
        </div>
      )}
    </>
  )
}