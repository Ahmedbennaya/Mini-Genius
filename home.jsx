// Mini Genius — Homepage sections

const { useState: useStateH, useEffect: useEffectH } = React;

function Hero() {
  return (
    <section style={{ position:"relative", overflow:"hidden", paddingTop: 56, paddingBottom: 96 }}>
      {/* soft blobs */}
      <div aria-hidden style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", left:"-8%", top:"-8%", width:380, height:380, borderRadius:"50%",
          background:"radial-gradient(circle, var(--butter) 0%, transparent 65%)", opacity:.55, filter:"blur(8px)" }}/>
        <div style={{ position:"absolute", right:"-6%", bottom:"-10%", width:420, height:420, borderRadius:"50%",
          background:"radial-gradient(circle, var(--mint) 0%, transparent 65%)", opacity:.5, filter:"blur(10px)" }}/>
        <div style={{ position:"absolute", right:"30%", top:"10%", width:240, height:240, borderRadius:"50%",
          background:"radial-gradient(circle, var(--lavender) 0%, transparent 65%)", opacity:.45, filter:"blur(8px)" }}/>
      </div>

      <div className="container" style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.05fr 1fr", gap:48, alignItems:"center" }} className="hero-grid">
          <div>
            <div className="pill" style={{ background:"#fff", marginBottom:24 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--mint-deep)" }}/>
              Nouveau · Coffrets cadeaux Montessori
            </div>
            <h1 style={{ fontSize:"clamp(38px, 5.6vw, 72px)", lineHeight:1.02, letterSpacing:"-0.03em" }}>
              Des jouets éducatifs qui développent l'<span style={{
                background:"linear-gradient(120deg, var(--coral-deep), var(--lavender-deep))",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                fontStyle: "italic"
              }}>intelligence</span> de votre enfant
            </h1>
            <p style={{ fontSize:19, color:"var(--ink-2)", marginTop:24, maxWidth:"56ch", lineHeight:1.55 }}>
              Découvrez une sélection de jouets Montessori, sensoriels et créatifs pour apprendre en jouant. Sûrs, durables, livrés partout en Tunisie.
            </p>
            <div style={{ display:"flex", gap:12, marginTop:32, flexWrap:"wrap" }}>
              <button className="btn btn-coral btn-lg" onClick={()=>window.MG_NAV.go("collection")}>
                Découvrir la collection <I.arrow size={18}/>
              </button>
              <button className="btn btn-ghost btn-lg" onClick={()=>window.MG_NAV.go("collection",{tab:"age"})}>
                Choisir par âge
              </button>
            </div>

            <div style={{ display:"flex", gap:28, marginTop:40, alignItems:"center", flexWrap:"wrap" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Stars value={5} size={16}/>
                  <strong style={{ fontSize:15 }}>4.9 / 5</strong>
                </div>
                <div style={{ fontSize:13, color:"var(--ink-3)", marginTop:4 }}>+1 200 parents satisfaits</div>
              </div>
              <div style={{ width:1, height:36, background:"var(--line)" }}/>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <I.shield size={18}/>
                  <strong style={{ fontSize:15 }}>Sélection certifiée</strong>
                </div>
                <div style={{ fontSize:13, color:"var(--ink-3)", marginTop:4 }}>Sûrs et conformes CE</div>
              </div>
            </div>
          </div>

          {/* Hero visual stage */}
          <HeroStage/>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function HeroStage() {
  return (
    <div style={{ position:"relative", height: 560, minHeight: 460 }} className="hero-stage">
      {/* central plinth */}
      <div style={{
        position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, -50%)",
        width: 360, height: 360, borderRadius:"50%",
        background:"radial-gradient(circle at 35% 30%, #fff, var(--bg-2) 70%)",
        boxShadow:"0 30px 60px rgba(31,36,51,.10), inset 0 -20px 40px rgba(0,0,0,.04)"
      }}/>

      <div style={{
        position:"absolute", left:"50%", top:"54%", transform:"translate(-50%, -50%)"
      }} className="float-a">
        <Toy3D shape="rocket" color="var(--coral)" accent="var(--coral-deep)" size={220}/>
      </div>

      {/* floating items */}
      <div style={{ position:"absolute", left:"6%", top:"12%" }} className="float-b">
        <Toy3D shape="cube" color="var(--butter)" accent="var(--butter-deep)" size={110}/>
      </div>
      <div style={{ position:"absolute", right:"8%", top:"6%" }} className="float-c">
        <Toy3D shape="ball" color="var(--sky)" accent="var(--sky-deep)" size={90}/>
      </div>
      <div style={{ position:"absolute", right:"4%", top:"40%" }} className="float-a">
        <Toy3D shape="star" color="var(--lavender)" accent="var(--lavender-deep)" size={86}/>
      </div>
      <div style={{ position:"absolute", left:"4%", bottom:"14%" }} className="float-c">
        <Toy3D shape="puzzle" color="var(--mint)" accent="var(--mint-deep)" size={120}/>
      </div>
      <div style={{ position:"absolute", right:"14%", bottom:"6%" }} className="float-b">
        <Toy3D shape="ring" color="var(--butter)" accent="var(--butter-deep)" size={84}/>
      </div>
      <div style={{ position:"absolute", left:"30%", bottom:"4%" }} className="float-b">
        <Toy3D shape="ball" color="var(--mint)" accent="var(--mint-deep)" size={56}/>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-stage { height: 440px; }
        }
        @media (max-width: 520px) {
          .hero-stage { height: 360px; }
          .hero-stage > div { transform: scale(.78) translate(var(--tx,0), var(--ty,0)); }
        }
      `}</style>
    </div>
  );
}

function TrustBar() {
  const items = window.MG_DATA.TRUST_BADGES;
  return (
    <section style={{ padding:"40px 0 16px", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)", background:"rgba(255,255,255,.5)" }}>
      <div className="container" style={{
        display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:20
      }} className="trust-grid">
        {items.map(b => (
          <div key={b.title} style={{ display:"flex", alignItems:"center", gap:12, padding:"6px 4px" }}>
            <div style={{
              width:42, height:42, borderRadius:14,
              background:"var(--bg-2)", display:"grid", placeItems:"center",
              color:"var(--coral-deep)", flexShrink:0
            }}>
              {React.createElement(I[b.icon], { size: 20 })}
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, lineHeight:1.2 }}>{b.title}</div>
              <div style={{ fontSize:12, color:"var(--ink-3)", marginTop:3 }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 1000px) { .trust-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 640px) { .trust-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 420px) { .trust-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function ShopByAge() {
  const ages = window.MG_DATA.AGES;
  return (
    <section className="section">
      <div className="container">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"end", gap:24, marginBottom:36, flexWrap:"wrap" }}>
          <div className="section-heading">
            <div className="eyebrow">Choisir par âge</div>
            <h2 style={{ marginTop:14 }}>Le bon jouet, au bon moment</h2>
            <p>Des sélections pensées pour chaque étape du développement.</p>
          </div>
          <button className="btn btn-ghost" onClick={()=>window.MG_NAV.go("collection",{tab:"age"})}>
            Tout voir <I.arrow/>
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:20 }} className="age-grid">
          {ages.map((a, i) => (
            <button key={a.id} className="age-card"
                    onClick={()=>window.MG_NAV.go("collection",{age:a.id})}
                    style={{
                      textAlign:"left", padding:24, borderRadius:"var(--r-lg)",
                      background:"var(--surface)", border:"1px solid var(--line)",
                      boxShadow:"var(--shadow-sm)",
                      display:"flex", flexDirection:"column", gap:16,
                      transition:"transform .25s ease, box-shadow .25s ease",
                      cursor:"pointer"
                    }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="var(--shadow-sm)"; }}>
              <div style={{
                aspectRatio: "1 / 1",
                borderRadius:"var(--r-md)",
                background: `linear-gradient(160deg, ${a.color}, color-mix(in srgb, ${a.color} 80%, white))`,
                display:"grid", placeItems:"center",
                position:"relative", overflow:"hidden"
              }}>
                <Toy3D shape={a.shape} color={a.color} accent={a.accent} size={130} style={{ animation: `float-y ${5+i*0.4}s ease-in-out infinite`}}/>
              </div>
              <div>
                <div style={{ fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:24, letterSpacing:"-0.02em" }}>{a.label}</div>
                <p style={{ fontSize:14, color:"var(--ink-2)", marginTop:6 }}>{a.desc}</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:14, fontWeight:600, color:"var(--coral-deep)" }}>
                Voir la sélection <I.arrow size={14}/>
              </div>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) { .age-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .age-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function Categories() {
  const cats = window.MG_DATA.CATEGORIES;
  return (
    <section className="section" style={{ background:"var(--bg-2)", borderRadius:"40px 40px 0 0", marginTop:24 }}>
      <div className="container">
        <div className="section-heading" style={{ textAlign:"center", maxWidth:680, margin:"0 auto 44px" }}>
          <div className="eyebrow" style={{ justifyContent:"center" }}>Nos univers</div>
          <h2 style={{ marginTop:14 }}>Explorez par catégorie</h2>
          <p style={{ margin:"14px auto 0" }}>Chaque catégorie, sélectionnée avec soin par notre équipe pédagogique.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:18 }} className="cat-grid">
          {cats.map((c, i) => (
            <button key={c.id} onClick={()=>window.MG_NAV.go("collection",{category:c.id})}
                    style={{
                      position:"relative", overflow:"hidden",
                      padding:"28px 26px", borderRadius:"var(--r-lg)",
                      background:"var(--surface)", border:"1px solid var(--line)",
                      textAlign:"left", cursor:"pointer",
                      minHeight:200,
                      transition:"transform .25s ease, box-shadow .25s ease",
                    }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{
                position:"absolute", right:-20, bottom:-20, width:160, height:160,
                borderRadius:"50%", background:`radial-gradient(circle, ${c.color} 0%, transparent 70%)`, opacity:.8
              }}/>
              <div style={{ position:"absolute", right:18, bottom:18 }}>
                <Toy3D shape={c.shape} color={c.color} accent={c.accent} size={92}/>
              </div>
              <div style={{ position:"relative" }}>
                <div className="pill" style={{ marginBottom:14 }}>{c.count} produits</div>
                <div style={{ fontFamily:"Bricolage Grotesque", fontWeight:600, fontSize:22, lineHeight:1.15, maxWidth:"14ch" }}>{c.name}</div>
                <div style={{ marginTop:14, fontSize:14, fontWeight:600, color:"var(--coral-deep)", display:"inline-flex", alignItems:"center", gap:6 }}>
                  Découvrir <I.arrow size={14}/>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 880px) { .cat-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 520px) { .cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function ProductCardLegacy({ p, onAdd }) {
  const [adding, setAdding] = useStateH(false);
  return (
    <div className="card" style={{ padding:18, display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{
        position:"relative", aspectRatio:"1/1", borderRadius:"var(--r-md)",
        background: `linear-gradient(160deg, ${p.color}, color-mix(in srgb, ${p.color} 70%, white))`,
        display:"grid", placeItems:"center", overflow:"hidden",
        cursor:"pointer"
      }} onClick={()=>window.MG_NAV.go("product", { id: p.id })}>
        {p.isNew && <div style={{ position:"absolute", left:12, top:12, padding:"4px 10px", background:"#fff", borderRadius:"var(--r-pill)", fontSize:11, fontWeight:700, color:"var(--ink)" }}>Nouveau</div>}
        {p.bestseller && <div style={{ position:"absolute", left:12, top:12, padding:"4px 10px", background:"var(--ink)", color:"#fff", borderRadius:"var(--r-pill)", fontSize:11, fontWeight:700 }}>Best-seller</div>}
        <Toy3D shape={p.shape} color={p.color} accent={p.accent} size={140}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span className="pill" style={{ background:"var(--bg-2)" }}>{p.age}</span>
        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:13, color:"var(--ink-2)" }}>
          <I.star size={12}/> {p.rating} <span style={{ color:"var(--ink-3)" }}>({p.reviews})</span>
        </span>
      </div>
      <div>
        <div style={{ fontWeight:600, fontSize:16, lineHeight:1.25, cursor:"pointer" }}
             onClick={()=>window.MG_NAV.go("product", { id: p.id })}>{p.name}</div>
        <div style={{ fontSize:13, color:"var(--ink-2)", marginTop:4 }}>{p.benefit}</div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"auto" }}>
        <div style={{ fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:20 }}>{p.price} <span style={{ fontSize:12, fontWeight:600, color:"var(--ink-3)" }}>TND</span></div>
        <button className={`btn btn-sm ${adding ? "btn-coral" : "btn-primary"}`}
                onClick={(e)=>{ e.stopPropagation(); setAdding(true); onAdd(p); setTimeout(()=>setAdding(false), 1000); }}>
          {adding ? <><I.check size={14}/> Ajouté</> : <><I.plus size={14}/> Ajouter</>}
        </button>
      </div>
    </div>
  );
}

function ProductCard({ p, onAdd }) {
  const [adding, setAdding] = useStateH(false);
  const [imageFailed, setImageFailed] = useStateH(false);
  const hasImage = Boolean(p.image && !imageFailed);

  return (
    <article className="card product-card">
      <button
        type="button"
        className="product-media"
        style={{
          background: `linear-gradient(160deg, ${p.color}, color-mix(in srgb, ${p.color} 72%, white))`,
        }}
        onClick={() => window.MG_NAV.go("product", { id: p.id })}
        aria-label={`Voir ${p.name}`}
      >
        {p.isNew && <span className="product-badge">Nouveau</span>}
        {p.bestseller && <span className="product-badge product-badge-dark">Best-seller</span>}
        {hasImage ? (
          <img
            src={p.image}
            alt={p.name}
            className="product-img"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Toy3D shape={p.shape} color={p.color} accent={p.accent} size={132} />
        )}
      </button>

      <div className="product-card-main">
        <div className="product-meta">
          <span className="pill product-age">{p.age}</span>
          <span className="product-rating">
            <I.star size={12} /> {p.rating} <span>({p.reviews})</span>
          </span>
        </div>

        <button
          type="button"
          className="product-title"
          onClick={() => window.MG_NAV.go("product", { id: p.id })}
        >
          {p.name}
        </button>
        <p className="product-benefit">{p.benefit}</p>

        <div className="product-card-footer">
          <div className="product-price">
            {p.price} <span>TND</span>
          </div>
          <button
            className={`btn btn-sm ${adding ? "btn-coral" : "btn-primary"} product-add`}
            onClick={(e) => {
              e.stopPropagation();
              setAdding(true);
              onAdd(p);
              setTimeout(() => setAdding(false), 1000);
            }}
          >
            {adding ? <><I.check size={14} /> Ajoute</> : <><I.plus size={14} /> Ajouter</>}
          </button>
        </div>
      </div>
    </article>
  );
}

function FeaturedProducts({ onAdd }) {
  const products = window.MG_DATA.PRODUCTS;
  return (
    <section className="section" style={{ background:"var(--bg-2)" }}>
      <div className="container">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"end", gap:24, marginBottom:36, flexWrap:"wrap" }}>
          <div className="section-heading">
            <div className="eyebrow">Coups de cœur</div>
            <h2 style={{ marginTop:14 }}>Produits favoris des parents</h2>
            <p>Sélectionnés, testés et approuvés. Livrés partout en Tunisie.</p>
          </div>
          <button className="btn btn-ghost" onClick={()=>window.MG_NAV.go("collection")}>
            Voir tout <I.arrow/>
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:18 }} className="product-grid">
          {products.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd}/>)}
        </div>
      </div>
      <style>{`
        @media (max-width: 1080px) { .product-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 780px) { .product-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 460px) { .product-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function WhyParents() {
  const benefits = window.MG_DATA.BENEFITS;
  return (
    <section className="section">
      <div className="container" style={{ display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:60, alignItems:"center" }} className="why-grid">
        <div style={{ position:"relative", minHeight:480 }} className="why-stage">
          <div style={{ position:"absolute", inset:"0 0 0 0", borderRadius:"var(--r-xl)", background:"linear-gradient(160deg, var(--mint) 0%, var(--sky) 100%)", overflow:"hidden" }}>
            <div style={{ position:"absolute", left:"-10%", top:"-10%", width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,.3)" }}/>
            <div style={{ position:"absolute", right:"-15%", bottom:"-15%", width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,.25)" }}/>
            <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, -50%)" }} className="float-a">
              <Toy3D shape="balls" color="var(--coral)" accent="var(--coral-deep)" size={220}/>
            </div>
            <div style={{ position:"absolute", left:"10%", top:"15%" }} className="float-b">
              <Toy3D shape="cube" color="var(--butter)" accent="var(--butter-deep)" size={70}/>
            </div>
            <div style={{ position:"absolute", right:"12%", top:"18%" }} className="float-c">
              <Toy3D shape="star" color="var(--lavender)" accent="var(--lavender-deep)" size={70}/>
            </div>
            <div style={{ position:"absolute", right:"18%", bottom:"12%" }} className="float-b">
              <Toy3D shape="ring" color="#fff" accent="var(--butter-deep)" size={64}/>
            </div>
          </div>
        </div>

        <div>
          <div className="eyebrow">Pourquoi nous choisir</div>
          <h2 style={{ fontSize:"clamp(30px, 4vw, 46px)", marginTop:14, lineHeight:1.05 }}>
            Apprendre devient un jeu.
          </h2>
          <p style={{ fontSize:17, color:"var(--ink-2)", marginTop:14, maxWidth:"52ch" }}>
            Chaque jouet est choisi pour soutenir une compétence précise — et faire briller les yeux des enfants.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:32 }} className="benefit-grid">
            {benefits.map(b => (
              <div key={b.title} style={{
                padding:"18px 18px", borderRadius:"var(--r-md)",
                background:"var(--surface)", border:"1px solid var(--line)",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:b.color, boxShadow:`0 0 0 4px color-mix(in srgb, ${b.color} 40%, transparent)` }}/>
                  <strong style={{ fontSize:15 }}>{b.title}</strong>
                </div>
                <div style={{ fontSize:13, color:"var(--ink-2)", marginTop:8 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .why-stage { min-height: 360px !important; }
        }
        @media (max-width: 480px) { .benefit-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function GiftBox() {
  return (
    <section className="section">
      <div className="container">
        <div style={{
          position:"relative", overflow:"hidden",
          borderRadius:"var(--r-xl)",
          background:"linear-gradient(135deg, var(--coral) 0%, var(--lavender) 100%)",
          padding:"72px 56px",
          color:"var(--ink)"
        }} className="gift-card">
          <div style={{ position:"relative", zIndex:1, maxWidth:520 }}>
            <div className="pill" style={{ background:"rgba(255,255,255,.6)" }}>
              <I.gift size={14}/> Coffrets cadeaux
            </div>
            <h2 style={{ fontSize:"clamp(32px, 4.4vw, 52px)", marginTop:18, lineHeight:1.05, color:"var(--ink)" }}>
              Des coffrets cadeaux intelligents pour chaque âge.
            </h2>
            <p style={{ marginTop:14, fontSize:17, maxWidth:"50ch", color:"var(--ink-2)" }}>
              Emballage soigné, sélection par âge, mot personnalisé. Le cadeau parfait, livré prêt à offrir.
            </p>
            <div style={{ display:"flex", gap:12, marginTop:28, flexWrap:"wrap" }}>
              <button className="btn btn-primary btn-lg" onClick={()=>window.MG_NAV.go("collection",{category:"cadeaux"})}>
                Trouver le cadeau parfait <I.arrow size={16}/>
              </button>
              <a className="btn btn-ghost btn-lg" href="https://wa.me/21652338194" target="_blank" rel="noopener">
                <I.whatsapp size={16}/> Conseil personnalisé
              </a>
            </div>
          </div>

          <div style={{ position:"absolute", right:30, top:"50%", transform:"translateY(-50%)" }} className="gift-stage">
            <div style={{ position:"relative", width:380, height:380 }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(255,255,255,.35)" }}/>
              <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, -50%)" }} className="float-a">
                <Toy3D shape="gift" color="var(--coral)" accent="var(--coral-deep)" size={240}/>
              </div>
              <div style={{ position:"absolute", right:"5%", top:"10%" }} className="float-b">
                <Toy3D shape="star" color="var(--butter)" accent="var(--butter-deep)" size={64}/>
              </div>
              <div style={{ position:"absolute", left:"0%", bottom:"6%" }} className="float-c">
                <Toy3D shape="ball" color="var(--mint)" accent="var(--mint-deep)" size={70}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .gift-card { padding: 48px 28px !important; }
          .gift-stage { display:none !important; }
        }
      `}</style>
    </section>
  );
}

function Testimonials() {
  const t = window.MG_DATA.TESTIMONIALS;
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading" style={{ textAlign:"center", maxWidth:680, margin:"0 auto 44px" }}>
          <div className="eyebrow" style={{ justifyContent:"center" }}>Avis parents</div>
          <h2 style={{ marginTop:14 }}>Ils nous font confiance</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }} className="testi-grid">
          {t.map((tt, i) => (
            <div key={i} style={{
              padding:"28px 26px", borderRadius:"var(--r-lg)",
              background:"var(--surface)", border:"1px solid var(--line)",
              display:"flex", flexDirection:"column", gap:18
            }}>
              <Stars value={tt.rating} size={16}/>
              <p style={{ fontSize:17, lineHeight:1.5, color:"var(--ink)" }}>"{tt.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:"auto" }}>
                <div style={{
                  width:42, height:42, borderRadius:"50%",
                  background:`linear-gradient(160deg, ${tt.color}, color-mix(in srgb, ${tt.color} 60%, var(--ink)))`,
                  display:"grid", placeItems:"center", color:"#fff", fontWeight:700, fontFamily:"Bricolage Grotesque"
                }}>{tt.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{tt.name}</div>
                  <div style={{ fontSize:12, color:"var(--ink-3)" }}>{tt.city} · Cliente vérifiée</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useStateH("");
  const [done, setDone] = useStateH(false);
  return (
    <section className="section-sm">
      <div className="container">
        <div style={{
          padding:"56px 48px", borderRadius:"var(--r-xl)",
          background:"var(--ink)", color:"#fff",
          display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:40, alignItems:"center",
          position:"relative", overflow:"hidden"
        }} className="news-card">
          <div style={{ position:"absolute", right:-40, top:-40, width:240, height:240, borderRadius:"50%", background:"rgba(245,215,122,.18)", filter:"blur(30px)" }}/>
          <div style={{ position:"relative" }}>
            <div className="eyebrow" style={{ color:"var(--butter)" }}>Newsletter</div>
            <h2 style={{ color:"#fff", fontSize:"clamp(28px, 3.4vw, 40px)", marginTop:14, lineHeight:1.1 }}>
              Recevez nos nouveautés et idées cadeaux.
            </h2>
            <p style={{ color:"rgba(255,255,255,.7)", marginTop:12, fontSize:15 }}>
              Une à deux fois par mois. Pas de spam, jamais.
            </p>
          </div>
          <form onSubmit={(e)=>{ e.preventDefault(); if(email) setDone(true); }} style={{ display:"flex", gap:10, position:"relative" }}>
            <input className="input" placeholder="votre@email.com" type="email" required
                   value={email} onChange={(e)=>setEmail(e.target.value)}
                   style={{ background:"rgba(255,255,255,.08)", color:"#fff", borderColor:"rgba(255,255,255,.18)" }}/>
            <button className="btn btn-coral" type="submit">
              {done ? <><I.check size={14}/> Inscrit</> : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .news-card { grid-template-columns: 1fr !important; padding: 36px 28px !important; }
        }
      `}</style>
    </section>
  );
}

function HomePage({ onAdd }) {
  return (
    <>
      <Hero/>
      <TrustBar/>
      <ShopByAge/>
      <Categories/>
      <FeaturedProducts onAdd={onAdd}/>
      <WhyParents/>
      <GiftBox/>
      <Testimonials/>
      <Newsletter/>
    </>
  );
}

Object.assign(window, { HomePage });
