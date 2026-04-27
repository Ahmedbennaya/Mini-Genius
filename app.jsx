// Mini Genius — App shell + router

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "coral",
  "density": "comfortable",
  "showFAB": true
}/*EDITMODE-END*/;

const PRIMARY_PRESETS = {
  coral: { color: "#F4A78F", deep: "#E07F62", name: "Corail" },
  lavender: { color: "#D9C8F0", deep: "#A988D8", name: "Lavande" },
  mint: { color: "#B8E0C9", deep: "#7CC299", name: "Menthe" },
  sky: { color: "#A8D0E6", deep: "#6FA8C9", name: "Ciel" },
  butter: { color: "#F5D77A", deep: "#E9BE4A", name: "Beurre" },
};

function App() {
  const [route, setRoute] = useState({ name: "home", state: {} });
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply primary
  useEffect(() => {
    const p = PRIMARY_PRESETS[tweaks.primary] || PRIMARY_PRESETS.coral;
    document.documentElement.style.setProperty("--coral", p.color);
    document.documentElement.style.setProperty("--coral-deep", p.deep);
  }, [tweaks.primary]);

  // Navigation
  useEffect(() => {
    window.MG_NAV = {
      go: (name, state) => {
        setRoute({ name, state: state || {} });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setMenuOpen(false);
      }
    };
  }, []);

  const addToCart = (product, qty = 1) => {
    setCart(c => {
      const ex = c.find(x => x.id === product.id);
      if (ex) return c.map(x => x.id === product.id ? { ...x, qty: x.qty + qty } : x);
      return [...c, { id: product.id, qty }];
    });
  };

  const cartCount = cart.reduce((s,i)=>s+i.qty, 0);

  let Page = null;
  if (route.name === "home") Page = <HomePage onAdd={addToCart}/>;
  else if (route.name === "collection") Page = <CollectionPage initialState={route.state} onAdd={addToCart}/>;
  else if (route.name === "product") Page = <ProductPage id={route.state.id} onAdd={addToCart}/>;
  else if (route.name === "cart") Page = <CartPage cart={cart} setCart={setCart} onAdd={addToCart}/>;
  else if (route.name === "about") Page = <AboutPage/>;
  else if (route.name === "contact") Page = <ContactPage/>;

  useReveal();

  return (
    <>
      <Header cartCount={cartCount} onOpenMenu={()=>setMenuOpen(true)}/>
      <MobileMenu open={menuOpen} onClose={()=>setMenuOpen(false)}/>
      <main>{Page}</main>
      <Footer/>
      {tweaks.showFAB && <WhatsAppFAB/>}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Couleur d'accent"/>
        <window.TweakRadio
          label="Palette"
          value={tweaks.primary}
          onChange={(v)=>setTweak("primary", v)}
          options={Object.entries(PRIMARY_PRESETS).map(([k,v])=>({ value:k, label:v.name }))}
        />
        <div style={{ display:"flex", gap:8, padding:"6px 12px 12px" }}>
          {Object.entries(PRIMARY_PRESETS).map(([k,v])=>(
            <button key={k} onClick={()=>setTweak("primary", k)}
              style={{
                width:28, height:28, borderRadius:"50%",
                background:`linear-gradient(160deg, ${v.color}, ${v.deep})`,
                border: tweaks.primary === k ? "3px solid #1F2433" : "2px solid #ECE3D2",
                cursor:"pointer"
              }} aria-label={v.name}/>
          ))}
        </div>

        <window.TweakSection label="Interface"/>
        <window.TweakToggle
          label="Bouton WhatsApp flottant"
          value={tweaks.showFAB}
          onChange={(v)=>setTweak("showFAB", v)}
        />

        <window.TweakSection label="Navigation rapide"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, padding:"6px 12px 12px" }}>
          {[
            {label:"Accueil", to:"home"},
            {label:"Collection", to:"collection"},
            {label:"Produit", to:"product", state:{id:"blocs-magnetiques"}},
            {label:"Panier", to:"cart"},
            {label:"À propos", to:"about"},
            {label:"Contact", to:"contact"},
          ].map(l => (
            <button key={l.label} onClick={()=>window.MG_NAV.go(l.to, l.state)}
              style={{ padding:"8px 10px", borderRadius:8, border:"1px solid #ECE3D2", background:"#fff", fontSize:12, cursor:"pointer", color:"#1F2433" }}>
              {l.label}
            </button>
          ))}
        </div>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
