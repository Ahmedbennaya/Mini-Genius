// Mini Genius — Collection / Product / Cart / About / Contact pages

const { useState: useStateP, useEffect: useEffectP, useMemo } = React;

/* ---------------- Collection page ---------------- */
function CollectionPage({ initialState, onAdd }) {
  const products = window.MG_DATA.PRODUCTS;
  const cats = window.MG_DATA.CATEGORIES;
  const ages = window.MG_DATA.AGES;

  const [category, setCategory] = useStateP(initialState?.category || null);
  const [age, setAge] = useStateP(initialState?.age || null);
  const [maxPrice, setMaxPrice] = useStateP(250);
  const [sort, setSort] = useStateP("popular");
  const [drawerOpen, setDrawerOpen] = useStateP(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter(p => p.category === category);
    if (age) list = list.filter(p => p.age.includes(age.split("-")[0]) || age === "9+" && parseInt(p.age) >= 9);
    list = list.filter(p => p.price <= maxPrice);
    if (sort === "price-asc") list.sort((a,b)=>a.price-b.price);
    else if (sort === "price-desc") list.sort((a,b)=>b.price-a.price);
    else if (sort === "new") list.sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0));
    else list.sort((a,b)=>b.rating-a.rating);
    return list;
  }, [category, age, maxPrice, sort]);

  const Filters = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <div>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Catégorie</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <FilterPill active={!category} onClick={()=>setCategory(null)} label="Toutes les catégories"/>
          {cats.map(c => <FilterPill key={c.id} active={category===c.id} onClick={()=>setCategory(c.id)} label={c.name} dot={c.color}/>)}
        </div>
      </div>
      <div>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Âge</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          <button className="pill" onClick={()=>setAge(null)}
            style={{ background: !age?"var(--ink)":"var(--bg-2)", color:!age?"#fff":"var(--ink-2)", cursor:"pointer", borderColor:"transparent" }}>Tous</button>
          {ages.map(a => (
            <button key={a.id} className="pill" onClick={()=>setAge(a.id)}
              style={{ background: age===a.id?"var(--ink)":"var(--bg-2)", color: age===a.id?"#fff":"var(--ink-2)", cursor:"pointer", borderColor:"transparent" }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:12, display:"flex", justifyContent:"space-between" }}>
          <span>Prix max</span>
          <span style={{ color:"var(--coral-deep)" }}>{maxPrice} TND</span>
        </div>
        <input type="range" min="20" max="250" step="10" value={maxPrice} onChange={(e)=>setMaxPrice(+e.target.value)} style={{ width:"100%", accentColor:"var(--coral-deep)" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--ink-3)", marginTop:6 }}>
          <span>20 TND</span><span>250 TND</span>
        </div>
      </div>
    </div>
  );

  return (
    <section style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <div style={{ display:"flex", gap:6, alignItems:"center", fontSize:13, color:"var(--ink-3)", marginBottom:14 }}>
            <a href="#" onClick={(e)=>{e.preventDefault(); window.MG_NAV.go("home");}}>Accueil</a> /
            <span>Collection</span>
            {category && <> / <span style={{ color:"var(--ink)" }}>{cats.find(c=>c.id===category)?.name}</span></>}
          </div>
          <h1 style={{ fontSize:"clamp(32px, 4vw, 48px)", lineHeight:1.05 }}>
            {category ? cats.find(c=>c.id===category)?.name : "Tous nos jouets"}
          </h1>
          <p style={{ color:"var(--ink-2)", marginTop:10, maxWidth:"58ch" }}>
            {filtered.length} produits sélectionnés pour apprendre, créer et grandir.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:36 }} className="col-grid">
          <aside className="col-sidebar" style={{
            position:"sticky", top:96, alignSelf:"start", height:"fit-content",
            padding:"24px", borderRadius:"var(--r-lg)", background:"var(--surface)", border:"1px solid var(--line)"
          }}>
            <Filters/>
          </aside>

          <div>
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap"
            }}>
              <button className="btn btn-ghost btn-sm show-mobile" onClick={()=>setDrawerOpen(true)}>
                <I.filter/> Filtres
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginLeft:"auto" }}>
                <span style={{ fontSize:13, color:"var(--ink-3)" }}>Trier par</span>
                <select value={sort} onChange={(e)=>setSort(e.target.value)} style={{
                  padding:"10px 14px", borderRadius:"var(--r-pill)", border:"1px solid var(--line)",
                  background:"var(--surface)", font:"inherit", fontSize:14, fontWeight:500, cursor:"pointer"
                }}>
                  <option value="popular">Popularité</option>
                  <option value="new">Nouveautés</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding:60, textAlign:"center", borderRadius:"var(--r-lg)", background:"var(--surface)", border:"1px solid var(--line)" }}>
                <div style={{ display:"inline-block", marginBottom:14 }}>
                  <Toy3D shape="ring" color="var(--bg-2)" accent="var(--ink-3)" size={80}/>
                </div>
                <h3>Aucun produit ne correspond.</h3>
                <p style={{ color:"var(--ink-2)", marginTop:8 }}>Essayez d'élargir vos filtres.</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:18 }} className="col-products">
                {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd}/>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      <div style={{
        position:"fixed", inset:0, zIndex:80, pointerEvents: drawerOpen ? "auto" : "none"
      }}>
        <div onClick={()=>setDrawerOpen(false)} style={{
          position:"absolute", inset:0, background:"rgba(31,36,51,.4)",
          opacity: drawerOpen ? 1 : 0, transition:"opacity .2s ease"
        }}/>
        <div style={{
          position:"absolute", left:0, right:0, bottom:0, maxHeight:"86vh", overflowY:"auto",
          background:"var(--bg)", padding:24, borderRadius:"var(--r-xl) var(--r-xl) 0 0",
          transform: drawerOpen ? "translateY(0)" : "translateY(100%)", transition:"transform .25s ease"
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h3>Filtres</h3>
            <button onClick={()=>setDrawerOpen(false)} style={{ width:36, height:36, borderRadius:"50%", display:"grid", placeItems:"center" }}><I.close/></button>
          </div>
          <Filters/>
          <button className="btn btn-coral" style={{ width:"100%", marginTop:24 }} onClick={()=>setDrawerOpen(false)}>
            Voir {filtered.length} produits
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .col-grid { grid-template-columns: 1fr !important; }
          .col-sidebar { display: none !important; }
          .col-products { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) { .col-products { grid-template-columns: 1fr !important; } }
        @media (max-width: 1100px) { .col-products { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

function FilterPill({ active, onClick, label, dot }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:10,
      padding:"10px 12px", borderRadius:"var(--r-md)",
      background: active ? "var(--bg-2)" : "transparent",
      color: active ? "var(--ink)" : "var(--ink-2)",
      fontWeight: active ? 600 : 500,
      fontSize:14, textAlign:"left", cursor:"pointer",
      transition:"background .15s ease"
    }}>
      {dot && <span style={{ width:10, height:10, borderRadius:"50%", background:dot }}/>}
      {label}
    </button>
  );
}

/* ---------------- Product detail ---------------- */
function ProductPage({ id, onAdd }) {
  const products = window.MG_DATA.PRODUCTS;
  const p = products.find(x => x.id === id) || products[0];
  const [qty, setQty] = useStateP(1);
  const [tab, setTab] = useStateP("desc");
  const related = products.filter(x => x.id !== p.id).slice(0, 4);

  return (
    <>
      <section style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="container">
          <div style={{ display:"flex", gap:6, alignItems:"center", fontSize:13, color:"var(--ink-3)", marginBottom:24 }}>
            <a href="#" onClick={(e)=>{e.preventDefault(); window.MG_NAV.go("home");}}>Accueil</a> /
            <a href="#" onClick={(e)=>{e.preventDefault(); window.MG_NAV.go("collection");}}>Collection</a> /
            <span style={{ color:"var(--ink)" }}>{p.name}</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1.05fr 1fr", gap:48 }} className="prod-grid">
            <div>
              <div style={{
                aspectRatio:"1/1", borderRadius:"var(--r-xl)",
                background: `linear-gradient(160deg, ${p.color}, color-mix(in srgb, ${p.color} 70%, white))`,
                display:"grid", placeItems:"center", overflow:"hidden", position:"relative"
              }}>
                <Toy3D shape={p.shape} color={p.color} accent={p.accent} size={300} style={{ animation:"float-y 6s ease-in-out infinite" }}/>
                <div style={{ position:"absolute", bottom:18, left:18, display:"flex", gap:8 }}>
                  {p.bestseller && <span className="pill" style={{ background:"var(--ink)", color:"#fff", borderColor:"transparent" }}>Best-seller</span>}
                  {p.isNew && <span className="pill" style={{ background:"#fff" }}>Nouveau</span>}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10, marginTop:12 }}>
                {[p.color, "var(--bg-2)", "var(--lavender)", "var(--mint)"].map((c, i) => (
                  <div key={i} style={{
                    aspectRatio:"1/1", borderRadius:"var(--r-md)",
                    background: `linear-gradient(160deg, ${c}, color-mix(in srgb, ${c} 70%, white))`,
                    border: i === 0 ? "2px solid var(--ink)" : "1px solid var(--line)",
                    cursor:"pointer", display:"grid", placeItems:"center"
                  }}>
                    <Toy3D shape={p.shape} color={c} accent={p.accent} size={56}/>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="pill">{p.age}</span>
              <h1 style={{ fontSize:"clamp(28px, 3.6vw, 42px)", lineHeight:1.1, marginTop:14 }}>{p.name}</h1>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12 }}>
                <Stars value={p.rating} size={16}/>
                <span style={{ fontSize:14, color:"var(--ink-2)" }}>{p.rating} · {p.reviews} avis</span>
              </div>
              <div style={{ marginTop:24, display:"flex", alignItems:"baseline", gap:10 }}>
                <div style={{ fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:36 }}>{p.price} <span style={{ fontSize:16, fontWeight:600, color:"var(--ink-3)" }}>TND</span></div>
                <span className="pill" style={{ background:"var(--mint)", borderColor:"transparent" }}>Paiement à la livraison</span>
              </div>

              <p style={{ marginTop:20, fontSize:16, color:"var(--ink-2)", lineHeight:1.55 }}>{p.benefit}. Conçu pour stimuler la curiosité de votre enfant tout en respectant les principes de la pédagogie Montessori.</p>

              <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:28 }}>
                <div style={{ display:"flex", alignItems:"center", border:"1px solid var(--line)", borderRadius:"var(--r-pill)", background:"var(--surface)" }}>
                  <button onClick={()=>setQty(Math.max(1, qty-1))} style={{ width:42, height:42, display:"grid", placeItems:"center" }}><I.minus/></button>
                  <div style={{ width:36, textAlign:"center", fontWeight:600 }}>{qty}</div>
                  <button onClick={()=>setQty(qty+1)} style={{ width:42, height:42, display:"grid", placeItems:"center" }}><I.plus/></button>
                </div>
                <button className="btn btn-primary btn-lg" style={{ flex:1 }} onClick={()=>onAdd(p, qty)}>
                  <I.cart size={16}/> Ajouter au panier
                </button>
              </div>
              <a className="btn btn-whatsapp btn-lg" href="https://wa.me/21600000000" target="_blank" rel="noopener" style={{ width:"100%", marginTop:10 }}>
                <I.whatsapp size={18}/> Commander sur WhatsApp
              </a>

              <div style={{ marginTop:28, padding:"18px 20px", borderRadius:"var(--r-md)", background:"var(--bg-2)", border:"1px solid var(--line)" }}>
                <div style={{ display:"flex", alignItems:"start", gap:12, marginBottom:12 }}>
                  <I.truck size={20}/>
                  <div>
                    <strong style={{ fontSize:14 }}>Livraison 24–72h partout en Tunisie</strong>
                    <div style={{ fontSize:13, color:"var(--ink-2)", marginTop:2 }}>Gratuite à partir de 150 TND.</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"start", gap:12 }}>
                  <I.shield size={20}/>
                  <div>
                    <strong style={{ fontSize:14 }}>Sécurité enfants garantie</strong>
                    <div style={{ fontSize:13, color:"var(--ink-2)", marginTop:2 }}>Conforme aux normes CE. Surveillance adulte recommandée.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop:60, borderTop:"1px solid var(--line)", paddingTop:28 }}>
            <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:24 }}>
              {[
                {id:"desc", label:"Description"},
                {id:"benefits", label:"Bienfaits"},
                {id:"safety", label:"Sécurité & matière"},
                {id:"shipping", label:"Livraison"},
              ].map(t => (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  padding:"10px 18px", borderRadius:"var(--r-pill)", fontSize:14, fontWeight:500,
                  background: tab===t.id ? "var(--ink)" : "transparent", color: tab===t.id ? "#fff" : "var(--ink-2)",
                  whiteSpace:"nowrap"
                }}>{t.label}</button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns: tab === "desc" ? "1fr 1fr" : "1fr", gap:48, fontSize:15, color:"var(--ink-2)", lineHeight:1.65, maxWidth: tab === "desc" ? "none" : "70ch" }} className="prod-tab">
              {tab === "desc" && <>
                <div>
                  <h4 style={{ fontSize:18, color:"var(--ink)", marginBottom:10 }}>Pourquoi votre enfant va l'adorer</h4>
                  <p>Un jouet pensé pour captiver sans surcharger. Des couleurs douces, une prise en main agréable, et juste assez de défi pour donner envie d'y revenir chaque jour.</p>
                </div>
                <div>
                  <h4 style={{ fontSize:18, color:"var(--ink)", marginBottom:10 }}>Ce qu'il développe</h4>
                  <ul style={{ paddingLeft:20, margin:0 }}>
                    <li>Motricité fine et coordination œil-main</li>
                    <li>Reconnaissance des formes et couleurs</li>
                    <li>Patience, concentration, autonomie</li>
                    <li>Logique de séquence et résolution de problème</li>
                  </ul>
                </div>
              </>}
              {tab === "benefits" && <p>Approuvé par des éducatrices Montessori. Idéal pour des sessions de 15 à 30 minutes — assez pour entraîner la concentration sans frustration. Adapté au jeu solitaire comme partagé.</p>}
              {tab === "safety" && <div>
                <p><strong style={{ color:"var(--ink)" }}>Âge recommandé :</strong> {p.age}</p>
                <p style={{ marginTop:8 }}><strong style={{ color:"var(--ink)" }}>Matière :</strong> Bois de hêtre certifié, peinture à base d'eau non toxique.</p>
                <p style={{ marginTop:8 }}><strong style={{ color:"var(--ink)" }}>Attention :</strong> contient des petites pièces. Utilisation sous surveillance d'un adulte recommandée.</p>
                <p style={{ marginTop:8 }}><strong style={{ color:"var(--ink)" }}>Conformité :</strong> normes CE et EN71.</p>
              </div>}
              {tab === "shipping" && <p>Livraison partout en Tunisie en 24–72h. Paiement à la livraison disponible. Gratuite dès 150 TND. Emballage cadeau offert sur demande.</p>}
            </div>
          </div>

          {/* Related */}
          <div style={{ marginTop:80 }}>
            <h2 style={{ fontSize:"clamp(24px, 3vw, 32px)", marginBottom:24 }}>Vous aimerez aussi</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:18 }} className="related-grid">
              {related.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd}/>)}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .prod-grid { grid-template-columns: 1fr !important; }
            .prod-tab { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 1080px) { .related-grid { grid-template-columns: repeat(3, 1fr) !important; } }
          @media (max-width: 780px) { .related-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 460px) { .related-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* Sticky mobile add-to-cart */}
      <div className="show-mobile" style={{
        position:"fixed", left:0, right:0, bottom:0, zIndex:55,
        padding:"12px 16px",
        background:"rgba(251,246,238,.92)", backdropFilter:"blur(10px)",
        borderTop:"1px solid var(--line)",
        display:"flex", gap:10, alignItems:"center"
      }}>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontWeight:700, fontSize:18 }}>{p.price} <span style={{ fontSize:11, color:"var(--ink-3)" }}>TND</span></div>
        </div>
        <button className="btn btn-primary" style={{ flex:1 }} onClick={()=>onAdd(p, qty)}>Ajouter</button>
        <a className="btn btn-whatsapp" href="https://wa.me/21600000000" target="_blank" rel="noopener" aria-label="WhatsApp" style={{ width:46, padding:0, height:46 }}>
          <I.whatsapp size={18}/>
        </a>
      </div>
    </>
  );
}

/* ---------------- Cart ---------------- */
function CartPage({ cart, setCart, onAdd }) {
  const products = window.MG_DATA.PRODUCTS;
  const items = cart.map(c => ({ ...products.find(p=>p.id===c.id), qty: c.qty })).filter(p => p.id);
  const subtotal = items.reduce((s,i)=>s+i.price*i.qty, 0);
  const shipping = subtotal >= 150 ? 0 : 8;
  const total = subtotal + shipping;
  const recommended = products.filter(p => !cart.find(c=>c.id===p.id)).slice(0, 3);

  const update = (id, qty) => setCart(c => c.map(x => x.id === id ? { ...x, qty } : x).filter(x => x.qty > 0));
  const remove = (id) => setCart(c => c.filter(x => x.id !== id));

  return (
    <section style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <h1 style={{ fontSize:"clamp(32px, 4vw, 48px)", marginBottom: 8 }}>Votre panier</h1>
        <p style={{ color:"var(--ink-2)" }}>{items.length === 0 ? "Votre panier est vide pour l'instant." : `${items.length} article${items.length>1?"s":""}`}</p>

        {items.length === 0 ? (
          <div style={{ marginTop:40, padding:"60px 30px", borderRadius:"var(--r-lg)", background:"var(--surface)", border:"1px solid var(--line)", textAlign:"center" }}>
            <div style={{ display:"inline-block" }}>
              <Toy3D shape="gift" color="var(--coral)" accent="var(--coral-deep)" size={120}/>
            </div>
            <h3 style={{ marginTop:20 }}>Découvrez nos coups de cœur</h3>
            <p style={{ color:"var(--ink-2)", marginTop:8 }}>Sélectionnés avec amour pour grandir intelligemment.</p>
            <button className="btn btn-coral btn-lg" style={{ marginTop:20 }} onClick={()=>window.MG_NAV.go("collection")}>
              Découvrir la collection <I.arrow/>
            </button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:36, marginTop:32 }} className="cart-grid">
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {items.map(i => (
                <div key={i.id} style={{
                  display:"grid", gridTemplateColumns:"100px 1fr auto", gap:18, alignItems:"center",
                  padding:"16px", borderRadius:"var(--r-lg)", background:"var(--surface)", border:"1px solid var(--line)"
                }}>
                  <div style={{
                    aspectRatio:"1/1", borderRadius:"var(--r-md)",
                    background:`linear-gradient(160deg, ${i.color}, color-mix(in srgb, ${i.color} 70%, white))`,
                    display:"grid", placeItems:"center"
                  }}>
                    <Toy3D shape={i.shape} color={i.color} accent={i.accent} size={70}/>
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:15 }}>{i.name}</div>
                    <div style={{ fontSize:13, color:"var(--ink-3)", marginTop:4 }}>{i.age}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:10 }}>
                      <div style={{ display:"flex", alignItems:"center", border:"1px solid var(--line)", borderRadius:"var(--r-pill)" }}>
                        <button onClick={()=>update(i.id, i.qty-1)} style={{ width:32, height:32, display:"grid", placeItems:"center" }}><I.minus size={14}/></button>
                        <div style={{ minWidth:28, textAlign:"center", fontWeight:600, fontSize:14 }}>{i.qty}</div>
                        <button onClick={()=>update(i.id, i.qty+1)} style={{ width:32, height:32, display:"grid", placeItems:"center" }}><I.plus size={14}/></button>
                      </div>
                      <button onClick={()=>remove(i.id)} style={{ display:"flex", alignItems:"center", gap:4, fontSize:13, color:"var(--ink-3)" }}>
                        <I.trash size={14}/> Retirer
                      </button>
                    </div>
                  </div>
                  <div style={{ fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:18, textAlign:"right" }}>
                    {i.price * i.qty} <span style={{ fontSize:11, color:"var(--ink-3)" }}>TND</span>
                  </div>
                </div>
              ))}

              <div style={{ marginTop:32 }}>
                <h3 style={{ fontSize:20, marginBottom:14 }}>Vous pourriez aimer</h3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:14 }} className="cart-reco">
                  {recommended.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd}/>)}
                </div>
              </div>
            </div>

            <aside style={{ position:"sticky", top:96, alignSelf:"start", height:"fit-content",
              padding:"24px", borderRadius:"var(--r-lg)", background:"var(--surface)", border:"1px solid var(--line)" }}>
              <h3 style={{ fontSize:20 }}>Récapitulatif</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:18, fontSize:14 }}>
                <Row label="Sous-total" value={`${subtotal} TND`}/>
                <Row label="Livraison" value={shipping === 0 ? "Offerte" : `${shipping} TND`} hint={shipping === 0 ? null : `+ ${150-subtotal} TND pour la livraison gratuite`}/>
                <div style={{ height:1, background:"var(--line)", margin:"6px 0" }}/>
                <Row label="Total" value={`${total} TND`} bold/>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width:"100%", marginTop:20 }}>
                Passer commande <I.arrow size={16}/>
              </button>
              <a className="btn btn-whatsapp" href="https://wa.me/21600000000" target="_blank" rel="noopener" style={{ width:"100%", marginTop:10 }}>
                <I.whatsapp size={16}/> Commander sur WhatsApp
              </a>
              <div style={{ marginTop:18, padding:"12px 14px", borderRadius:"var(--r-md)", background:"var(--bg-2)", fontSize:13, color:"var(--ink-2)", display:"flex", gap:10 }}>
                <I.wallet size={18}/> <span>Paiement à la livraison disponible.</span>
              </div>
            </aside>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-reco { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) { .cart-reco { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function Row({ label, value, bold, hint }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start" }}>
      <div>
        <div style={{ fontWeight: bold ? 700 : 500, fontSize: bold ? 16 : 14, color: bold ? "var(--ink)" : "var(--ink-2)" }}>{label}</div>
        {hint && <div style={{ fontSize:12, color:"var(--coral-deep)", marginTop:4 }}>{hint}</div>}
      </div>
      <div style={{ fontFamily:"Bricolage Grotesque", fontWeight: bold ? 700 : 600, fontSize: bold ? 22 : 14 }}>{value}</div>
    </div>
  );
}

/* ---------------- About ---------------- */
function AboutPage() {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center" }}>
          <div className="eyebrow" style={{ justifyContent:"center" }}>Notre histoire</div>
          <h1 style={{ fontSize:"clamp(36px, 5vw, 60px)", marginTop:14, lineHeight:1.05 }}>
            Aider les enfants tunisiens à grandir, intelligemment.
          </h1>
          <p style={{ fontSize:18, color:"var(--ink-2)", marginTop:18, lineHeight:1.6 }}>
            Mini Genius est née en 2024 d'une conviction simple : les bons jouets changent l'enfance. Nous sélectionnons, testons et expédions des jouets éducatifs Montessori, sensoriels et STEM partout en Tunisie — pour soutenir l'apprentissage, la créativité et le développement de chaque enfant.
          </p>
        </div>

        <div style={{ marginTop:60, display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:18 }} className="about-stats">
          {[
            { label:"Familles servies", value:"+1 200" },
            { label:"Produits sélectionnés", value:"136" },
            { label:"Régions livrées", value:"24 / 24" },
            { label:"Note moyenne", value:"4.9 / 5" },
          ].map(s => (
            <div key={s.label} style={{ padding:"24px", borderRadius:"var(--r-lg)", background:"var(--surface)", border:"1px solid var(--line)", textAlign:"center" }}>
              <div style={{ fontFamily:"Bricolage Grotesque", fontWeight:700, fontSize:36, color:"var(--coral-deep)" }}>{s.value}</div>
              <div style={{ fontSize:13, color:"var(--ink-2)", marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:60, display:"grid", gridTemplateColumns:"1fr 1fr", gap:36, alignItems:"center" }} className="about-pillars">
          <div style={{ position:"relative", aspectRatio:"1/1", borderRadius:"var(--r-xl)", background:"linear-gradient(160deg, var(--butter), var(--coral))", display:"grid", placeItems:"center", overflow:"hidden" }}>
            <Toy3D shape="balls" color="var(--mint)" accent="var(--mint-deep)" size={260} style={{ animation:"float-y 6s ease-in-out infinite" }}/>
            <div style={{ position:"absolute", left:"8%", top:"10%" }} className="float-b"><Toy3D shape="star" color="var(--lavender)" accent="var(--lavender-deep)" size={70}/></div>
            <div style={{ position:"absolute", right:"6%", bottom:"10%" }} className="float-c"><Toy3D shape="cube" color="#fff" accent="var(--butter-deep)" size={70}/></div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {[
              { title:"Sélection rigoureuse", desc:"Chaque jouet est testé par notre équipe et conforme aux normes de sécurité européennes." },
              { title:"Pédagogie active", desc:"Inspirés des méthodes Montessori, Reggio et STEM, nos jouets accompagnent le développement réel." },
              { title:"Service de proximité", desc:"Une équipe basée à Tunis, support WhatsApp 7j/7, livraison rapide partout en Tunisie." },
            ].map(p => (
              <div key={p.title} style={{ padding:"22px 24px", borderRadius:"var(--r-lg)", background:"var(--surface)", border:"1px solid var(--line)" }}>
                <h3 style={{ fontSize:18, marginBottom:6 }}>{p.title}</h3>
                <p style={{ fontSize:14, color:"var(--ink-2)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .about-pillars { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function ContactPage() {
  const [sent, setSent] = useStateP(false);
  return (
    <section style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:48 }} className="contact-grid">
          <div>
            <div className="eyebrow">Contact</div>
            <h1 style={{ fontSize:"clamp(32px, 4.4vw, 52px)", marginTop:14, lineHeight:1.05 }}>
              Une question ? Nous sommes là.
            </h1>
            <p style={{ fontSize:17, color:"var(--ink-2)", marginTop:14, maxWidth:"50ch" }}>
              Conseil cadeau, suivi de commande, recommandation par âge — notre équipe répond avec plaisir.
            </p>

            <div style={{ marginTop:36, display:"flex", flexDirection:"column", gap:14 }}>
              <ContactRow icon={I.whatsapp} title="WhatsApp" value="+216 00 000 000" hint="Réponse en moins de 30 min — 7j/7"/>
              <ContactRow icon={I.chat} title="Email" value="bonjour@minigenius.tn" hint="Réponse sous 24h"/>
              <ContactRow icon={I.truck} title="Livraison" value="24–72h partout en Tunisie" hint="Paiement à la livraison disponible"/>
            </div>

            <div style={{ display:"flex", gap:10, marginTop:28 }}>
              {[I.ig, I.fb, I.tiktok].map((Ic, i) => (
                <a key={i} href="#" style={{ width:42, height:42, borderRadius:"50%", background:"var(--surface)", border:"1px solid var(--line)", display:"grid", placeItems:"center" }}><Ic/></a>
              ))}
            </div>
          </div>

          <form onSubmit={(e)=>{e.preventDefault(); setSent(true);}} style={{ padding:32, borderRadius:"var(--r-xl)", background:"var(--surface)", border:"1px solid var(--line)" }}>
            <h3 style={{ fontSize:20 }}>Écrivez-nous</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:16 }}>
              <input className="input" placeholder="Prénom" required/>
              <input className="input" placeholder="Nom"/>
            </div>
            <input className="input" type="email" placeholder="Email" required style={{ marginTop:12 }}/>
            <input className="input" placeholder="Téléphone (optionnel)" style={{ marginTop:12 }}/>
            <textarea className="input" placeholder="Comment pouvons-nous vous aider ?" required style={{ marginTop:12 }}/>
            <button className="btn btn-coral btn-lg" type="submit" style={{ width:"100%", marginTop:18 }}>
              {sent ? <><I.check size={16}/> Message envoyé</> : <>Envoyer le message <I.arrow size={16}/></>}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function ContactRow({ icon: Ic, title, value, hint }) {
  return (
    <div style={{ display:"flex", gap:14, padding:"16px 18px", borderRadius:"var(--r-md)", background:"var(--surface)", border:"1px solid var(--line)" }}>
      <div style={{ width:42, height:42, borderRadius:14, background:"var(--bg-2)", display:"grid", placeItems:"center", color:"var(--coral-deep)", flexShrink:0 }}><Ic size={20}/></div>
      <div>
        <div style={{ fontSize:13, color:"var(--ink-3)" }}>{title}</div>
        <div style={{ fontWeight:600, marginTop:2 }}>{value}</div>
        {hint && <div style={{ fontSize:13, color:"var(--ink-2)", marginTop:4 }}>{hint}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { CollectionPage, ProductPage, CartPage, AboutPage, ContactPage });
