// Mini Genius — abstract 3D-style toy primitives (claymorphism via CSS gradients).
// Intentionally geometric, never detailed illustrations.

const { useEffect, useRef, useState } = React;

/* ---------------- Icons (line, 1.6 stroke) ---------------- */
const I = {
  search: (p) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  user: (p) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
  cart: (p) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h2l2.5 11h11l2-8H7"/><circle cx="9.5" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/></svg>,
  menu: (p) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>,
  close: (p) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>,
  whatsapp: (p) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="currentColor"><path d="M19.05 4.91A10 10 0 0 0 2.04 12.04a9.95 9.95 0 0 0 1.39 5.07L2 22l5.04-1.4a10 10 0 0 0 5 1.27h.01a10 10 0 0 0 7-17.96Zm-7 15.36h-.01a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3 .83.8-2.92-.2-.3a8.27 8.27 0 1 1 6.94 3.73Zm4.55-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.16.25-.65.81-.79.97-.15.16-.29.18-.54.06a6.78 6.78 0 0 1-2-1.24 7.5 7.5 0 0 1-1.39-1.72c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.16-.25.25-.42.09-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.75 2.66 4.24 3.73.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.18-.48-.31Z"/></svg>,
  truck: (p) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  shield: (p) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>,
  wallet: (p) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 7c0-1.1.9-2 2-2h11"/><circle cx="16" cy="13" r="1.4"/></svg>,
  chat: (p) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 4V5Z"/></svg>,
  gift: (p) => <svg viewBox="0 0 24 24" width={p.size||22} height={p.size||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M8 9a2.5 2.5 0 1 1 0-5c2 0 4 5 4 5M16 9a2.5 2.5 0 1 0 0-5c-2 0-4 5-4 5"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  star: (p) => <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.7L12 2.5Z"/></svg>,
  starOutline: (p) => <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.7L12 2.5Z"/></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>,
  filter: (p) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>,
  trash: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>,
  ig: (p) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
  fb: (p) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.3-1.5 1.6-1.5H16V4.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H7.5v3H10v8h3Z"/></svg>,
  tiktok: (p) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor"><path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.4 8.4 0 0 1-4.5-1.4v6a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V3h3Z"/></svg>,
};

/* ---------------- Star rating row ---------------- */
function Stars({ value = 5, size = 12 }) {
  return (
    <span className="stars" aria-label={`${value} sur 5`}>
      {[1,2,3,4,5].map(i => (
        <span key={i}>{i <= Math.round(value) ? <I.star size={size}/> : <I.starOutline size={size}/>}</span>
      ))}
    </span>
  );
}

/* ---------------- Toy3D — abstract clay shapes ----------------
   Variants: cube, ball, ring, puzzle, blocks, board, rocket, cards, gift,
   star, arch, balls
*/
let __toyId = 0;
function useToyId() {
  const ref = React.useRef(null);
  if (ref.current === null) ref.current = ++__toyId;
  return ref.current;
}
function Toy3D({ shape = "cube", color = "var(--butter)", accent = "var(--butter-deep)", size = 140, style }) {
  const uid = useToyId();
  const s = { width: size, height: size, ...style };
  const common = {
    background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 45%), linear-gradient(160deg, ${color}, ${accent})`,
    boxShadow: "inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)",
  };

  if (shape === "ball") {
    return <div style={{ ...s, borderRadius: "50%", ...common }} />;
  }
  if (shape === "cube") {
    return (
      <div style={{ ...s, position: "relative" }}>
        <div style={{
          width: "100%", height: "100%",
          borderRadius: "26%",
          ...common,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Bricolage Grotesque, sans-serif",
          fontWeight: 700, fontSize: size * 0.4, color: "rgba(31,36,51,.55)",
        }}>A</div>
      </div>
    );
  }
  if (shape === "ring") {
    return (
      <div style={{ ...s, borderRadius: "50%", ...common, display: "grid", placeItems: "center" }}>
        <div style={{ width: "44%", height: "44%", borderRadius: "50%", background: "var(--bg)", boxShadow: "inset 0 4px 8px rgba(0,0,0,.08)"}}/>
      </div>
    );
  }
  if (shape === "puzzle") {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id={`pz-${uid}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={color}/><stop offset="1" stopColor={accent}/>
          </linearGradient>
          <filter id="clay" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dy="3"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path filter="url(#clay)" d="M22 18h22a4 4 0 0 1 4 4v6a8 6 0 0 0 12 0v-6a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4h-6a6 8 0 0 0 0 12h6a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V62a4 4 0 0 1 4-4h6a6 8 0 0 0 0-12h-6a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Z"
          fill={`url(#pz-${uid})`} />
      </svg>
    );
  }
  if (shape === "blocks") {
    return (
      <div style={{ ...s, position: "relative" }}>
        <div style={{ position:"absolute", left:"6%", top:"30%", width:"46%", height:"46%", borderRadius:"22%", ...common }} />
        <div style={{ position:"absolute", right:"4%", top:"8%", width:"42%", height:"42%", borderRadius:"22%",
          background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 45%), linear-gradient(160deg, var(--butter), var(--butter-deep))`,
          boxShadow: "inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)" }} />
        <div style={{ position:"absolute", right:"22%", bottom:"4%", width:"38%", height:"38%", borderRadius:"22%",
          background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 45%), linear-gradient(160deg, var(--mint), var(--mint-deep))`,
          boxShadow: "inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)" }} />
      </div>
    );
  }
  if (shape === "board") {
    return (
      <div style={{ ...s, borderRadius: "22%", ...common, padding: size*0.12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: size*0.08 }}>
        <div style={{ borderRadius: "50%", background: "rgba(255,255,255,.55)", boxShadow:"inset 0 4px 8px rgba(0,0,0,.10)" }}/>
        <div style={{ borderRadius: "30%", background: "var(--mint)", boxShadow:"inset 0 -3px 6px rgba(0,0,0,.10)" }}/>
        <div style={{ borderRadius: "20%", background: "var(--butter)", boxShadow:"inset 0 -3px 6px rgba(0,0,0,.10)" }}/>
        <div style={{ borderRadius: "50%", background: "var(--lavender)", boxShadow:"inset 0 -3px 6px rgba(0,0,0,.10)" }}/>
      </div>
    );
  }
  if (shape === "rocket") {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id={`rk-${uid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".9"/><stop offset=".4" stopColor={color}/><stop offset="1" stopColor={accent}/>
          </linearGradient>
        </defs>
        {/* body */}
        <path d="M50 10c14 10 20 24 20 38v18c0 6-4 10-10 10H40c-6 0-10-4-10-10V48c0-14 6-28 20-38Z" fill={`url(#rk-${uid})`}/>
        {/* fins */}
        <path d="M30 60c-8 4-12 10-12 18 6 0 12-2 16-6Z" fill={accent}/>
        <path d="M70 60c8 4 12 10 12 18-6 0-12-2-16-6Z" fill={accent}/>
        {/* window */}
        <circle cx="50" cy="40" r="9" fill="var(--bg)"/>
        <circle cx="50" cy="40" r="6" fill={color} opacity=".7"/>
      </svg>
    );
  }
  if (shape === "cards") {
    return (
      <div style={{ ...s, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, transform:"rotate(-8deg)", borderRadius:"18%", ...common }}/>
        <div style={{ position:"absolute", inset:"6% 6%", transform:"rotate(4deg)", borderRadius:"18%",
          background: `linear-gradient(160deg, var(--lavender), var(--lavender-deep))`,
          boxShadow:"inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)" }}/>
        <div style={{ position:"absolute", inset:"14% 14%", borderRadius:"18%",
          background: `linear-gradient(160deg, var(--sky), var(--sky-deep))`,
          boxShadow:"inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)",
          display:"grid", placeItems:"center"
        }}>
          <div style={{ width:"40%", height:"40%", borderRadius:"50%", background:"rgba(255,255,255,.6)" }}/>
        </div>
      </div>
    );
  }
  if (shape === "gift") {
    return (
      <div style={{ ...s, position: "relative" }}>
        <div style={{ position:"absolute", inset:"14% 0 0 0", borderRadius:"14%", ...common }}/>
        {/* ribbon vertical */}
        <div style={{ position:"absolute", top:"14%", bottom:0, left:"42%", width:"16%", background:"linear-gradient(180deg, var(--coral-deep), var(--coral))", borderRadius:4 }}/>
        {/* bow */}
        <div style={{ position:"absolute", top:0, left:"24%", width:"24%", height:"22%", borderRadius:"50%", background:"linear-gradient(160deg, var(--coral), var(--coral-deep))", boxShadow:"inset 0 -3px 6px rgba(0,0,0,.10)" }}/>
        <div style={{ position:"absolute", top:0, right:"24%", width:"24%", height:"22%", borderRadius:"50%", background:"linear-gradient(160deg, var(--coral), var(--coral-deep))", boxShadow:"inset 0 -3px 6px rgba(0,0,0,.10)" }}/>
      </div>
    );
  }
  if (shape === "star") {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id={`st-${uid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".7"/><stop offset=".3" stopColor={color}/><stop offset="1" stopColor={accent}/>
          </linearGradient>
        </defs>
        <path d="M50 8c4 16 12 24 28 28-16 4-24 12-28 28-4-16-12-24-28-28 16-4 24-12 28-28Z" fill={`url(#st-${uid})`}/>
      </svg>
    );
  }
  if (shape === "arch") {
    return (
      <div style={{ ...s, borderRadius: "50% 50% 6% 6%", ...common }}/>
    );
  }
  if (shape === "balls") {
    return (
      <div style={{ ...s, position:"relative" }}>
        <div style={{ position:"absolute", left:"4%", top:"24%", width:"40%", height:"40%", borderRadius:"50%",
          background:`radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 45%), linear-gradient(160deg, var(--coral), var(--coral-deep))`,
          boxShadow:"inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)"}}/>
        <div style={{ position:"absolute", right:"6%", top:"6%", width:"36%", height:"36%", borderRadius:"50%",
          background:`radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 45%), linear-gradient(160deg, var(--butter), var(--butter-deep))`,
          boxShadow:"inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)"}}/>
        <div style={{ position:"absolute", right:"22%", bottom:"4%", width:"34%", height:"34%", borderRadius:"50%",
          background:`radial-gradient(circle at 30% 25%, rgba(255,255,255,.7), transparent 45%), linear-gradient(160deg, var(--mint), var(--mint-deep))`,
          boxShadow:"inset 0 -8px 14px rgba(0,0,0,.10), inset 0 8px 14px rgba(255,255,255,.55), 0 14px 30px rgba(31,36,51,.14)"}}/>
      </div>
    );
  }
  // default
  return <div style={{ ...s, borderRadius: "26%", ...common }}/>;
}

/* ---------------- Logo ---------------- */
function Logo({ size = 28, withText = true }) {
  return (
    <a href="#" onClick={(e)=>{e.preventDefault(); window.MG_NAV?.go("home");}}
       style={{ display:"inline-flex", alignItems:"center", gap:10 }}>
      <div style={{ position:"relative", width:size+8, height:size+8 }}>
        <div style={{
          width: size+8, height: size+8, borderRadius: "32%",
          background: "linear-gradient(160deg, var(--coral), var(--coral-deep))",
          boxShadow: "inset 0 -3px 6px rgba(0,0,0,.10), inset 0 3px 6px rgba(255,255,255,.5), 0 6px 12px rgba(224,127,98,.28)",
          display:"grid", placeItems:"center", color:"#fff",
          fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:(size+8)*0.55
        }}>m</div>
        <div style={{ position:"absolute", right:-2, top:-2, width: 10, height: 10, borderRadius:"50%", background:"var(--butter)", boxShadow:"0 2px 4px rgba(0,0,0,.1)"}}/>
      </div>
      {withText && (
        <span style={{ fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize: size*0.78, letterSpacing:"-0.02em" }}>
          Mini Genius
        </span>
      )}
    </a>
  );
}

/* ---------------- Use reveal ---------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

Object.assign(window, { I, Stars, Toy3D, Logo, useReveal });
