// Mini Genius — site shell: header, mobile menu, footer, WhatsApp FAB

const { useEffect: useEffectS, useState: useStateS, useRef: useRefS } = React;

function TopBar() {
  return (
    <div style={{ background:"var(--ink)", color:"#fff" }}>
      <div className="container" style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        height:36, fontSize:13, fontWeight:500, opacity:.95
      }}>
        <div style={{ display:"flex", gap:18, alignItems:"center" }}>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>
            <I.truck size={15}/> Livraison partout en Tunisie
          </span>
          <span className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:6, opacity:.85 }}>
            <I.wallet size={15}/> Paiement à la livraison disponible
          </span>
        </div>
        <div className="hide-mobile" style={{ display:"flex", gap:14, opacity:.8 }}>
          <span>FR</span><span style={{opacity:.4}}>·</span><span>AR (bientôt)</span>
        </div>
      </div>
    </div>
  );
}

function Header({ cartCount, onOpenMenu }) {
  const [scrolled, setScrolled] = useStateS(false);
  useEffectS(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Accueil", to: "home" },
    { label: "Jouets par âge", to: "collection", state: { tab: "age" } },
    { label: "Montessori", to: "collection", state: { category: "montessori" } },
    { label: "STEM", to: "collection", state: { category: "stem" } },
    { label: "Sensoriel", to: "collection", state: { category: "sensoriel" } },
    { label: "Cadeaux", to: "collection", state: { category: "cadeaux" } },
    { label: "Contact", to: "contact" },
  ];

  return (
    <>
      <TopBar/>
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background: scrolled ? "rgba(251,246,238,.85)" : "rgba(251,246,238,.65)",
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "all .2s ease",
      }}>
        <div className="container" style={{
          display:"flex", alignItems:"center", justifyContent:"space-between", height:72, gap:16
        }}>
          <Logo size={26}/>

          <nav className="hide-mobile" style={{ display:"flex", gap:6 }}>
            {links.map(l => (
              <a key={l.label} href="#"
                 onClick={(e)=>{e.preventDefault(); window.MG_NAV.go(l.to, l.state);}}
                 style={{ padding:"10px 14px", borderRadius:"var(--r-pill)", fontSize:14, fontWeight:500, color:"var(--ink-2)" }}
                 onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,.7)"}
                 onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}
              >{l.label}</a>
            ))}
          </nav>

          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <button className="hide-mobile" aria-label="Rechercher" style={iconBtn}><I.search/></button>
            <button className="hide-mobile" aria-label="Compte" style={iconBtn}><I.user/></button>
            <button aria-label="Panier" style={{...iconBtn, position:"relative"}} onClick={()=>window.MG_NAV.go("cart")}>
              <I.cart/>
              {cartCount > 0 && (
                <span style={{
                  position:"absolute", top:4, right:4,
                  background:"var(--coral-deep)", color:"#fff",
                  fontSize:10, fontWeight:700,
                  width:18, height:18, borderRadius:"50%",
                  display:"grid", placeItems:"center"
                }}>{cartCount}</span>
              )}
            </button>
            <a className="btn btn-whatsapp btn-sm hide-mobile" href="https://wa.me/21652338194" target="_blank" rel="noopener" style={{ marginLeft:6 }}>
              <I.whatsapp size={16}/> WhatsApp
            </a>
            <button className="show-mobile" aria-label="Menu" style={iconBtn} onClick={onOpenMenu}><I.menu/></button>
          </div>
        </div>
      </header>
    </>
  );
}

const iconBtn = {
  width:42, height:42, borderRadius:"50%",
  display:"grid", placeItems:"center",
  color:"var(--ink)", background:"transparent",
  transition:"background .15s ease"
};

function MobileMenu({ open, onClose }) {
  const links = [
    { label: "Accueil", to: "home" },
    { label: "Jouets par âge", to: "collection" },
    { label: "Montessori", to: "collection", state: { category: "montessori" } },
    { label: "STEM", to: "collection", state: { category: "stem" } },
    { label: "Sensoriel", to: "collection", state: { category: "sensoriel" } },
    { label: "Cadeaux", to: "collection", state: { category: "cadeaux" } },
    { label: "À propos", to: "about" },
    { label: "Contact", to: "contact" },
  ];
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      pointerEvents: open ? "auto" : "none",
    }}>
      <div onClick={onClose} style={{
        position:"absolute", inset:0, background:"rgba(31,36,51,.4)",
        opacity: open ? 1 : 0, transition:"opacity .2s ease"
      }}/>
      <div style={{
        position:"absolute", top:0, right:0, bottom:0, width:"min(360px, 86vw)",
        background:"var(--bg)", padding:"20px",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition:"transform .25s ease",
        display:"flex", flexDirection:"column", gap:12, overflowY:"auto"
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Logo size={24}/>
          <button onClick={onClose} style={iconBtn}><I.close/></button>
        </div>

        <div style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"12px 14px", borderRadius:"var(--r-pill)",
          background:"var(--surface)", border:"1px solid var(--line)"
        }}>
          <I.search size={18}/>
          <input placeholder="Rechercher un jouet..." style={{ border:0, outline:0, background:"transparent", flex:1, font:"inherit" }}/>
        </div>

        <nav style={{ display:"flex", flexDirection:"column", marginTop:8 }}>
          {links.map(l => (
            <a key={l.label} href="#"
               onClick={(e)=>{e.preventDefault(); window.MG_NAV.go(l.to, l.state); onClose();}}
               style={{ padding:"14px 8px", borderBottom:"1px solid var(--line)", fontSize:16, fontWeight:500 }}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="btn btn-whatsapp" href="https://wa.me/21652338194" target="_blank" rel="noopener" style={{ marginTop:12 }}>
          <I.whatsapp/> Commander sur WhatsApp
        </a>
        <button className="btn btn-ghost" onClick={()=>{ window.MG_NAV.go("cart"); onClose(); }}>
          <I.cart size={16}/> Voir le panier
        </button>
      </div>
    </div>
  );
}

function Footer() {
  const cols = [
    { title: "Catégories", items: ["Montessori","STEM","Sensoriel","Puzzles","Construction","Cadeaux"] },
    { title: "Aide", items: ["Livraison","Retours","FAQ","Suivi de commande","Guide des âges"] },
    { title: "Marque", items: ["À propos","Contact","Engagement qualité","Programme parents","Presse"] },
  ];
  return (
    <footer style={{ background:"var(--ink)", color:"#EAE5DA", marginTop:60 }}>
      <div className="container" style={{ padding:"72px 24px 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:48 }}
             onMouseEnter={()=>{}}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{
                width:36, height:36, borderRadius:"32%",
                background:"linear-gradient(160deg, var(--coral), var(--coral-deep))",
                display:"grid", placeItems:"center", color:"#fff",
                fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:22
              }}>m</div>
              <span style={{ fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:22, color:"#fff" }}>Mini Genius</span>
            </div>
            <p style={{ fontSize:14, lineHeight:1.65, opacity:.75, maxWidth:"36ch" }}>
              Des jouets éducatifs sélectionnés pour éveiller la curiosité, la logique et la créativité des enfants. Livraison partout en Tunisie.
            </p>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              {[I.ig, I.fb, I.tiktok].map((Ic, i) => (
                <a key={i} href="#" style={{
                  width:38, height:38, borderRadius:"50%",
                  background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)",
                  display:"grid", placeItems:"center", color:"#fff"
                }}><Ic size={16}/></a>
              ))}
            </div>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <div style={{ fontWeight:600, color:"#fff", marginBottom:14, fontSize:14, letterSpacing:".02em" }}>{c.title}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {c.items.map(i => (
                  <a key={i} href="#" style={{ fontSize:14, opacity:.78 }}
                     onMouseEnter={(e)=>e.currentTarget.style.opacity=1}
                     onMouseLeave={(e)=>e.currentTarget.style.opacity=.78}>{i}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop:56, paddingTop:24, borderTop:"1px solid rgba(255,255,255,.1)",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16,
          fontSize:13, opacity:.65
        }}>
          <div>© 2025 Mini Genius — Tunis, Tunisie. Tous droits réservés.</div>
          <div style={{ display:"flex", gap:18 }}>
            <span>CGV</span><span>Confidentialité</span><span>Mentions légales</span>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 520px) {
          footer .container > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function WhatsAppFAB() {
  return (
    <a href="https://wa.me/21652338194" target="_blank" rel="noopener"
       aria-label="Commander sur WhatsApp"
       style={{
         position:"fixed", right:22, bottom:22, zIndex:60,
         width:60, height:60, borderRadius:"50%",
         background:"#25D366", color:"#fff",
         display:"grid", placeItems:"center",
         boxShadow:"0 12px 30px rgba(37,211,102,.4), 0 4px 8px rgba(0,0,0,.15)",
         animation:"pulse-soft 3s ease-in-out infinite",
       }}>
      <I.whatsapp size={28}/>
    </a>
  );
}

Object.assign(window, { Header, MobileMenu, Footer, WhatsAppFAB });
