import { FormEvent, useMemo, useRef, useState } from "react";

type Page = "home" | "about" | "products" | "profile" | "admin";
type Lang = "es" | "en";
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  promo?: number;
  image: string;
};
type ChatMessage = { question: string; answer: string };
type AdminTab = "overview" | "inventory" | "orders" | "customers";

const photos = [
  "https://images.unsplash.com/photo-1526280524276-51b1c8a46321?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1568205612837-017257d2310a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1590243104664-2d2701bfb2aa?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?auto=format&fit=crop&w=900&q=85",
];

const initialProducts: Product[] = [
  { id: 1, name: "Cuaderno Aura", category: "Cuadernos", price: 129, stock: 32, promo: 20, image: photos[0] },
  { id: 2, name: "Set Color Pop", category: "Escritura", price: 89, stock: 45, image: photos[1] },
  { id: 3, name: "Lápiz Studio", category: "Escritura", price: 35, stock: 68, promo: 15, image: photos[2] },
  { id: 4, name: "Kit Ideas", category: "Organización", price: 179, stock: 18, image: photos[3] },
];

const copy = {
  es: {
    home: "Inicio", about: "Nosotros", products: "Productos", login: "Iniciar sesión",
    tagline: "Ideas que empiezan en papel.", hero: "Tu creatividad merece materiales extraordinarios.",
    heroSub: "Papelería bonita, funcional y consciente para estudiar, trabajar y crear a tu manera.",
    explore: "Explorar productos", story: "Conoce nuestra historia", featured: "Favoritos de la comunidad",
    featuredSub: "Diseñados para convertir cada pendiente en una posibilidad.",
    viewAll: "Ver todo el catálogo", why: "Papelería con propósito",
    whyText: "En PaperGo creemos que las mejores ideas comienzan con una hoja en blanco. Seleccionamos objetos que inspiran, duran y cuidan el planeta.",
    stat1: "productos elegidos", stat2: "clientes creativos", stat3: "empaque reciclable",
    catalog: "Todo para tu próxima gran idea", catalogSub: "Encuentra herramientas que hacen más ligero el trabajo y más especial cada proyecto.",
    search: "Buscar productos...", all: "Todos", add: "Añadir", from: "Desde",
    profile: "Mi perfil", admin: "Panel admin", logout: "Salir", edit: "Editar perfil",
    save: "Guardar cambios", cancel: "Cancelar", name: "Nombre", email: "Correo electrónico", phone: "Teléfono",
    address: "Dirección", member: "Miembro creativo desde 2024", orders: "Mis pedidos", favorites: "Favoritos",
    access: "Bienvenido de nuevo", accessSub: "Ingresa para continuar creando.", password: "Contraseña",
    role: "Tipo de acceso", customer: "Cliente", administrator: "Administrador", enter: "Entrar a PaperGo",
    demo: "Demo: selecciona cualquier rol para explorar su experiencia.", manage: "Gestión de productos",
    manageSub: "Crea, consulta y mantén tu catálogo al día.", newProduct: "Nuevo producto", inventory: "Inventario",
    product: "Producto", category: "Categoría", price: "Precio", stock: "Existencias", promotion: "Promoción", actions: "Acciones",
    active: "Activa", noPromo: "Sin promoción", editProduct: "Editar producto", delete: "Eliminar",
    botTitle: "PaperBot", botOnline: "En línea · asistencia escrita", botHello: "¡Miau! Soy PaperBot, el gato robot de PaperGo. Pregúntame sobre productos, envíos, pedidos, pagos, cambios o devoluciones.",
    botPlaceholder: "Escribe tu duda...", send: "Enviar", close: "Cerrar", dark: "Cambiar tema", language: "Change to English",
    accessibility: "Accesibilidad", deafReady: "Experiencia accesible para personas sordas: toda la atención es visual y escrita.",
    footer: "Papelería para ideas que dejan huella.", shipping: "Envío gratis desde $499",
    curated: "Selección PaperGo", essence: "Nuestra esencia", since: "Desde 2020", happy: "creativos felices",
    thisWeek: "Esta semana", conscious: "Envío consciente", plasticFree: "Empaque sin plástico",
    smallBig: "Pequeños objetos, grandes ideas.", aboutOne: "Nacimos del amor por el papel, el color y esos momentos de claridad que aparecen cuando bajamos una idea de la mente a la página.",
    aboutTwo: "Trabajamos con marcas responsables y diseñadores independientes para acercarte productos especiales, funcionales y duraderos.",
    mindful: "Diseño consciente", quality: "Calidad elegida", community: "Comunidad creativa",
    personalInfo: "Información personal", personalSub: "Mantén tus datos actualizados para una mejor experiencia.", verified: "Verificado",
    visits: "Visitas hoy", productsCount: "productos", activePlural: "activas",
  },
  en: {
    home: "Home", about: "About us", products: "Products", login: "Log in",
    tagline: "Ideas that begin on paper.", hero: "Your creativity deserves extraordinary tools.",
    heroSub: "Beautiful, functional and mindful stationery to study, work and create your way.",
    explore: "Explore products", story: "Our story", featured: "Community favorites",
    featuredSub: "Designed to turn every task into a possibility.",
    viewAll: "View full catalog", why: "Stationery with purpose",
    whyText: "At PaperGo, we believe the best ideas start on a blank page. We select objects that inspire, last and care for our planet.",
    stat1: "curated products", stat2: "creative customers", stat3: "recyclable packaging",
    catalog: "Everything for your next big idea", catalogSub: "Find tools that make work lighter and every project more special.",
    search: "Search products...", all: "All", add: "Add", from: "From",
    profile: "My profile", admin: "Admin panel", logout: "Log out", edit: "Edit profile",
    save: "Save changes", cancel: "Cancel", name: "Name", email: "Email", phone: "Phone",
    address: "Address", member: "Creative member since 2024", orders: "My orders", favorites: "Favorites",
    access: "Welcome back", accessSub: "Log in to keep creating.", password: "Password",
    role: "Access type", customer: "Customer", administrator: "Administrator", enter: "Enter PaperGo",
    demo: "Demo: select any role to explore its experience.", manage: "Product management",
    manageSub: "Create, view and keep your catalog up to date.", newProduct: "New product", inventory: "Inventory",
    product: "Product", category: "Category", price: "Price", stock: "Stock", promotion: "Promotion", actions: "Actions",
    active: "Active", noPromo: "No promotion", editProduct: "Edit product", delete: "Delete",
    botTitle: "PaperBot", botOnline: "Online · written support", botHello: "Meow! I'm PaperBot, PaperGo's robot cat. Ask me about products, shipping, orders, payments, exchanges or returns.",
    botPlaceholder: "Write your question...", send: "Send", close: "Close", dark: "Change theme", language: "Cambiar a español",
    accessibility: "Accessibility", deafReady: "Accessible experience for deaf users: all support is visual and written.",
    footer: "Stationery for ideas that make a mark.", shipping: "Free shipping from $499",
    curated: "PaperGo selection", essence: "Our essence", since: "Since 2020", happy: "happy creatives",
    thisWeek: "This week", conscious: "Mindful shipping", plasticFree: "Plastic-free packaging",
    smallBig: "Small objects, big ideas.", aboutOne: "We were born from a love of paper, color, and those moments of clarity that happen when an idea moves from your mind to the page.",
    aboutTwo: "We work with responsible brands and independent designers to bring you special, functional, and long-lasting products.",
    mindful: "Mindful design", quality: "Curated quality", community: "Creative community",
    personalInfo: "Personal information", personalSub: "Keep your details up to date for a better experience.", verified: "Verified",
    visits: "Visits today", productsCount: "products", activePlural: "active",
  },
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>,
    bag: <><path d="M6 8h12l1 13H5L6 8z"/><path d="M9 9V6a3 3 0 016 0v3"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    close: <path d="M6 6l12 12M18 6L6 18"/>,
    send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>,
    chat: <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"/>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></>,
    check: <path d="M5 12l4 4L19 6"/>,
    box: <><path d="M4 7l8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10"/></>,
    tag: <><path d="M20 13l-7 7L4 11V4h7z"/><circle cx="8.5" cy="8.5" r="1"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z"/>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function PaperBotMascot({ size = 46 }: { size?: number }) {
  return <svg className="paperbot-mascot" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="PaperBot, gato robot">
    <path className="bot-ear" d="M13 22 10 7l15 10M51 22 54 7 39 17" />
    <rect className="bot-head" x="9" y="15" width="46" height="39" rx="15" />
    <path className="bot-face" d="M18 27c5-5 23-5 28 0v14c-6 7-22 7-28 0z" />
    <path className="bot-eye" d="M24 31v5M40 31v5" />
    <path className="bot-mouth" d="M28 41h8M32 38v3" />
    <path className="bot-detail" d="M9 33H4M60 33h-5M32 15V9" />
    <circle className="bot-signal" cx="32" cy="7" r="3" />
  </svg>;
}

function getBotResponse(message: string, lang: Lang) {
  const q = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const es = lang === "es";
  const rules: Array<[string[], string, string]> = [
    [["devol", "reembolso", "return", "refund"], "Puedes solicitar una devolución dentro de los 30 días posteriores a la entrega. El producto debe estar sin usar, completo y en su empaque original. Inicia la solicitud desde Mi perfil > Mis pedidos; al aprobarse recibirás una guía prepagada. El reembolso tarda de 3 a 7 días hábiles después de la revisión.", "You can request a return within 30 days of delivery. The product must be unused, complete, and in its original packaging. Start the request under My Profile > My Orders; once approved, you'll receive a prepaid label. Refunds take 3–7 business days after inspection."],
    [["cambio", "exchange"], "Aceptamos cambios dentro de 30 días. Desde Mis pedidos selecciona el artículo y elige “Cambiar producto”. Los artículos personalizados, abiertos o de liquidación final no admiten cambio, salvo defecto de fabricación.", "We accept exchanges within 30 days. In My Orders, select the item and choose “Exchange product.” Personalized, opened, or final-sale items cannot be exchanged unless defective."],
    [["danado", "roto", "defecto", "damage", "broken", "defect"], "Si tu pedido llegó dañado o incompleto, repórtalo en las primeras 48 horas con fotos del producto y del empaque. Te enviaremos un reemplazo sin costo o procesaremos el reembolso completo.", "If your order arrived damaged or incomplete, report it within 48 hours with photos of the item and packaging. We'll send a free replacement or issue a full refund."],
    [["envio", "entrega", "domicilio", "shipping", "delivery"], "Enviamos a todo México. El envío estándar tarda de 3 a 5 días hábiles y es gratis en compras desde $499 MXN. El envío exprés tarda de 1 a 2 días hábiles. Recibirás el número de rastreo por correo cuando tu pedido salga.", "We ship throughout Mexico. Standard delivery takes 3–5 business days and is free on orders over $499 MXN. Express takes 1–2 business days. Your tracking number will be emailed when the order ships."],
    [["rastre", "donde esta", "seguimiento", "track", "where is"], "Consulta el estado en Mi perfil > Mis pedidos. Ahí encontrarás la paquetería, el número de guía y la fecha estimada. Si lleva más de 48 horas sin movimiento, escribe “hablar con asesor” y te ayudaremos.", "Check the status under My Profile > My Orders. You'll find the carrier, tracking number, and estimated date there. If it hasn't moved for over 48 hours, type “talk to an advisor” for help."],
    [["cancel", "modificar pedido", "modify order"], "Puedes cancelar o modificar dirección y productos durante los primeros 30 minutos después de comprar. Después de ese plazo preparamos el paquete y será necesario esperar la entrega para solicitar una devolución.", "You can cancel or change the address and products during the first 30 minutes after purchase. After that, we prepare the parcel and you'll need to wait for delivery before requesting a return."],
    [["pago", "tarjeta", "payment", "card"], "Aceptamos Visa, Mastercard, American Express, PayPal y transferencias SPEI. Todos los pagos se procesan de forma cifrada; PaperGo no almacena los datos completos de tu tarjeta.", "We accept Visa, Mastercard, American Express, PayPal, and SPEI transfers. All payments are encrypted; PaperGo never stores your full card details."],
    [["factura", "invoice"], "Solicita tu factura durante el mes de compra desde Mi perfil > Mis pedidos > Facturar. Necesitarás RFC, razón social, régimen fiscal, uso de CFDI y código postal fiscal.", "Request an invoice during the month of purchase under My Profile > My Orders > Invoice. You'll need your Mexican tax details, including RFC, legal name, tax regime, CFDI use, and tax postal code."],
    [["promoc", "descuento", "cupon", "promotion", "discount", "coupon"], "Ingresa tu cupón en el carrito antes de pagar. Las promociones no son acumulables y pueden excluir productos personalizados o en liquidación. Los productos con descuento conservan la misma garantía.", "Enter your coupon in the cart before payment. Promotions cannot be combined and may exclude personalized or final-sale items. Discounted products keep the same warranty."],
    [["producto", "cuaderno", "lapiz", "papel", "tinta", "product", "notebook", "pencil", "paper", "ink"], "Puedo ayudarte a elegir. Tenemos cuadernos, escritura, organización y kits creativos. Dime para qué lo necesitas —escuela, oficina, dibujo o regalo— y tu presupuesto para recomendarte la mejor opción.", "I can help you choose. We carry notebooks, writing tools, organization products, and creative kits. Tell me whether it's for school, office, drawing, or a gift, plus your budget, and I'll recommend an option."],
    [["mayoreo", "empresa", "wholesale", "business"], "Ofrecemos precios empresariales desde 25 piezas y personalización desde 50. Escribe a empresas@papergo.mx con productos, cantidades y fecha requerida; respondemos en un día hábil.", "We offer business pricing from 25 units and customization from 50. Email empresas@papergo.mx with products, quantities, and required date; we reply within one business day."],
    [["contacto", "asesor", "horario", "persona", "contact", "advisor", "hours", "human"], "Nuestro equipo atiende por chat y correo de lunes a viernes de 9:00 a 18:00, y sábados de 10:00 a 14:00, hora del centro de México. Correo: hola@papergo.mx.", "Our team is available by chat and email Monday–Friday, 9:00–18:00, and Saturday, 10:00–14:00 Central Mexico time. Email: hola@papergo.mx."],
    [["privacidad", "datos", "privacy", "data"], "Usamos tus datos únicamente para procesar pedidos, mejorar el servicio y comunicarnos contigo con tu consentimiento. Puedes solicitar acceso, corrección o eliminación escribiendo a privacidad@papergo.mx.", "We use your data only to process orders, improve service, and contact you with consent. You can request access, correction, or deletion at privacidad@papergo.mx."],
  ];
  const match = rules.find(([keywords]) => keywords.some(keyword => q.includes(keyword)));
  if (match) return es ? match[1] : match[2];
  return es
    ? "Puedo orientarte sobre catálogo, disponibilidad, pagos, facturación, promociones, pedidos, rastreo, envíos, cambios, devoluciones, productos dañados y compras empresariales. Cuéntame un poco más o escribe “hablar con asesor”."
    : "I can help with our catalog, availability, payments, invoices, promotions, orders, tracking, shipping, exchanges, returns, damaged products, and business purchases. Tell me a little more or type “talk to an advisor.”";
}

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="PaperGo inicio"><span className="logo-mark">P</span><span>Paper<span>Go</span></span></button>;
}

function ProductCard({ product, t }: { product: Product; t: typeof copy.es }) {
  const finalPrice = product.promo ? product.price * (1 - product.promo / 100) : product.price;
  return <article className="product-card glass">
    <div className="product-image">
      <img src={product.image} alt={product.name} />
      {product.promo && <span className="promo">−{product.promo}%</span>}
      <button className="heart" aria-label={`Guardar ${product.name}`}><Icon name="heart" size={18} /></button>
    </div>
    <div className="product-info">
      <span className="eyebrow">{product.category}</span>
      <h3>{product.name}</h3>
      <div className="price-row">
        <div><strong>${finalPrice.toFixed(0)}</strong>{product.promo && <del>${product.price}</del>}</div>
        <button className="icon-add" aria-label={`${t.add} ${product.name}`}><Icon name="plus" /></button>
      </div>
    </div>
  </article>;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [lang, setLang] = useState<Lang>("es");
  const [dark, setDark] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [loggedIn, setLoggedIn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [avatar, setAvatar] = useState<string>("");
  const [profile, setProfile] = useState({ name: "Sofía Ramírez", email: "sofia@ejemplo.com", phone: "+52 55 1234 5678", address: "Ciudad de México, MX" });
  const [productModal, setProductModal] = useState<Product | "new" | null>(null);
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const t = copy[lang];
  const fileRef = useRef<HTMLInputElement>(null);

  const go = (next: Page) => { setPage(next); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const visibleProducts = useMemo(() => products.filter(p =>
    (category === "Todos" || category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [products, search, category]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault(); setLoggedIn(true); setLoginOpen(false); go(role === "admin" ? "admin" : "profile");
  };
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget); const msg = String(data.get("message") || "").trim();
    if (!msg) return;
    setMessages(prev => [...prev, { question: msg, answer: getBotResponse(msg, lang) }]); e.currentTarget.reset();
  };

  const renderHome = () => <main>
    <section className="hero">
      <div className="orb orb-one" /><div className="orb orb-two" />
      <div className="hero-copy">
        <span className="pill">{t.tagline}</span>
        <h1>{t.hero}</h1>
        <p>{t.heroSub}</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => go("products")}>{t.explore}<Icon name="arrow" /></button>
          <button className="secondary" onClick={() => go("about")}>{t.story}</button>
        </div>
        <div className="trust"><span className="avatars"><i>A</i><i>M</i><i>L</i></span><span><b>4.9/5</b><br />+2,000 {t.happy}</span></div>
      </div>
      <div className="hero-visual">
        <div className="hero-photo glass"><img src={photos[0]} alt="Cuaderno y bolígrafos sobre un escritorio creativo" /></div>
        <div className="float-card top-card"><Icon name="tag" /><div><b>−20%</b><small>{t.thisWeek}</small></div></div>
        <div className="float-card bottom-card"><span className="check-circle"><Icon name="check" size={15} /></span><div><b>{t.conscious}</b><small>{t.plasticFree}</small></div></div>
      </div>
    </section>
    <section className="section">
      <div className="section-head"><div><span className="eyebrow">{t.curated}</span><h2>{t.featured}</h2><p>{t.featuredSub}</p></div><button className="text-button" onClick={() => go("products")}>{t.viewAll}<Icon name="arrow" /></button></div>
      <div className="product-grid">{products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} t={t} />)}</div>
    </section>
    <section className="purpose section">
      <div className="purpose-photo"><img src={photos[3]} alt="Materiales creativos cuidadosamente organizados" /></div>
      <div className="purpose-copy glass"><span className="eyebrow">{t.essence}</span><h2>{t.why}</h2><p>{t.whyText}</p>
        <div className="stats"><div><b>150+</b><span>{t.stat1}</span></div><div><b>2K+</b><span>{t.stat2}</span></div><div><b>100%</b><span>{t.stat3}</span></div></div>
      </div>
    </section>
  </main>;

  const renderAbout = () => <main className="inner-page">
    <section className="about-hero">
      <span className="eyebrow">{t.since}</span><h1>{t.why}</h1><p>{t.whyText}</p>
    </section>
    <section className="about-grid section">
      <div className="about-image"><img src={photos[3]} alt="Papelería colorida de PaperGo" /></div>
      <div className="glass story-card"><span className="eyebrow">PaperGo</span><h2>{t.smallBig}</h2><p>{t.aboutOne}</p><p>{t.aboutTwo}</p><div className="values"><span><Icon name="check" />{t.mindful}</span><span><Icon name="check" />{t.quality}</span><span><Icon name="check" />{t.community}</span></div></div>
    </section>
  </main>;

  const renderProducts = () => <main className="inner-page">
    <section className="catalog-head"><span className="eyebrow">Catálogo PaperGo</span><h1>{t.catalog}</h1><p>{t.catalogSub}</p></section>
    <section className="section catalog">
      <div className="filters glass"><label className="search-box"><Icon name="search" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} aria-label={t.search} /></label>
        <div className="chips">{[t.all, "Cuadernos", "Escritura", "Organización"].map(c => <button key={c} onClick={() => setCategory(c)} className={(category === c || ((category === "Todos" || category === "All") && c === t.all)) ? "active" : ""}>{c}</button>)}</div>
      </div>
      <div className="product-grid catalog-grid">{visibleProducts.map(p => <ProductCard key={p.id} product={p} t={t} />)}</div>
    </section>
  </main>;

  const renderProfile = () => <main className="inner-page section account-page">
    <div className="page-title"><div><span className="eyebrow">PaperGo Club</span><h1>{t.profile}</h1></div><button className="secondary" onClick={() => setEditingProfile(!editingProfile)}><Icon name="edit" />{t.edit}</button></div>
    <div className="profile-layout">
      <aside className="glass profile-summary">
        <button className="avatar" onClick={() => fileRef.current?.click()} aria-label="Cambiar foto de perfil">{avatar ? <img src={avatar} alt="" /> : <span>SR</span>}<i><Icon name="edit" size={14} /></i></button>
        <input ref={fileRef} hidden type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
        <h2>{profile.name}</h2><p>{t.member}</p><div className="member-badge">PaperGo Plus</div>
        <nav><button className="active"><Icon name="user" />{t.profile}</button><button><Icon name="box" />{t.orders}<span>3</span></button><button><Icon name="tag" />{t.favorites}<span>8</span></button></nav>
      </aside>
      <section className="glass profile-form"><div className="form-heading"><div><h2>{t.personalInfo}</h2><p>{t.personalSub}</p></div><span className="verified"><Icon name="check" size={14} />{t.verified}</span></div>
        <div className="form-grid">
          {(["name", "email", "phone", "address"] as const).map(key => <label key={key}><span>{t[key]}</span><input disabled={!editingProfile} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} /></label>)}
        </div>
        {editingProfile && <div className="form-actions"><button className="secondary" onClick={() => setEditingProfile(false)}>{t.cancel}</button><button className="primary" onClick={() => setEditingProfile(false)}>{t.save}</button></div>}
      </section>
    </div>
  </main>;

  const inventoryDashboard = <section className="glass table-card dashboard-panel">
    <div className="table-tools"><div><span className="panel-kicker">{lang === "es" ? "Control de catálogo" : "Catalog control"}</span><h2>{t.inventory}</h2></div><label className="search-box"><Icon name="search" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} /></label></div>
    <div className="table-wrap"><table><thead><tr><th>{t.product}</th><th>{t.category}</th><th>{t.price}</th><th>{t.stock}</th><th>{t.promotion}</th><th>{t.actions}</th></tr></thead>
      <tbody>{products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => <tr key={p.id}><td><div className="table-product"><img src={p.image} alt="" /><b>{p.name}</b></div></td><td>{p.category}</td><td>${p.price}</td><td><span className={p.stock < 20 ? "stock low" : "stock"}>{p.stock}</span></td><td>{p.promo ? <span className="promo-cell">{p.promo}% · {t.active}</span> : <span className="muted">{t.noPromo}</span>}</td><td><div className="row-actions"><button onClick={() => setProductModal(p)} aria-label={`${t.editProduct} ${p.name}`}><Icon name="edit" /></button><button className="danger" onClick={() => setProducts(products.filter(x => x.id !== p.id))} aria-label={`${t.delete} ${p.name}`}><Icon name="trash" /></button></div></td></tr>)}</tbody>
    </table></div>
  </section>;

  const renderAdmin = () => {
    const es = lang === "es";
    return <main className="inner-page section admin-page">
      <div className="admin-glow admin-glow-one" /><div className="admin-glow admin-glow-two" />
      <div className="page-title"><div><span className="eyebrow">PaperGo Workspace</span><h1>{es ? "Hola, Andrea" : "Hello, Andrea"}</h1><p>{es ? "Aquí tienes el pulso de tu tienda en tiempo real." : "Here is your store's pulse in real time."}</p></div><button className="primary" onClick={() => setProductModal("new")}><Icon name="plus" />{t.newProduct}</button></div>
      <nav className="admin-tabs glass" aria-label={es ? "Dashboards administrativos" : "Admin dashboards"}>
        {([
          ["overview", "eye", es ? "Resumen" : "Overview"],
          ["inventory", "box", t.inventory],
          ["orders", "bag", t.orders],
          ["customers", "user", es ? "Clientes" : "Customers"],
        ] as [AdminTab, string, string][]).map(([tab, icon, label]) => <button key={tab} className={adminTab === tab ? "active" : ""} onClick={() => setAdminTab(tab)}><Icon name={icon} />{label}</button>)}
      </nav>

      {adminTab === "overview" && <>
        <div className="metric-grid metric-grid-four">
          <div className="metric glass"><span><Icon name="bag" /></span><div><small>{es ? "Ventas netas" : "Net sales"}</small><b>$84,320</b><em>+12.8%</em></div></div>
          <div className="metric glass"><span><Icon name="box" /></span><div><small>{es ? "Pedidos" : "Orders"}</small><b>286</b><em>+8.4%</em></div></div>
          <div className="metric glass"><span><Icon name="user" /></span><div><small>{es ? "Nuevos clientes" : "New customers"}</small><b>124</b><em>+18.2%</em></div></div>
          <div className="metric glass"><span><Icon name="eye" /></span><div><small>{t.visits}</small><b>1,248</b><em>+6.1%</em></div></div>
        </div>
        <div className="dashboard-grid">
          <section className="glass chart-card sales-chart">
            <div className="panel-heading"><div><span className="panel-kicker">{es ? "Rendimiento" : "Performance"}</span><h2>{es ? "Ventas de la semana" : "Weekly sales"}</h2></div><span className="period-pill">{es ? "Últimos 7 días" : "Last 7 days"}</span></div>
            <div className="bar-chart" aria-label={es ? "Gráfica de ventas semanales" : "Weekly sales chart"}>{[45,68,52,83,65,94,78].map((height, index) => <div className="bar-column" key={index}><div className="bar-track"><i style={{height:`${height}%`}}><span>${[8,12,9,15,11,18,14][index]}k</span></i></div><small>{(es ? ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"])[index]}</small></div>)}</div>
          </section>
          <section className="glass chart-card category-card">
            <div className="panel-heading"><div><span className="panel-kicker">{es ? "Distribución" : "Distribution"}</span><h2>{es ? "Ventas por categoría" : "Sales by category"}</h2></div></div>
            <div className="donut-wrap"><div className="donut"><span><b>$84k</b><small>{es ? "Total" : "Total"}</small></span></div><div className="legend"><span><i />Cuadernos <b>42%</b></span><span><i />Escritura <b>33%</b></span><span><i />Organización <b>25%</b></span></div></div>
          </section>
          <section className="glass chart-card recent-card">
            <div className="panel-heading"><div><span className="panel-kicker">{es ? "En vivo" : "Live"}</span><h2>{es ? "Pedidos recientes" : "Recent orders"}</h2></div><button onClick={() => setAdminTab("orders")}>{es ? "Ver todos" : "View all"}<Icon name="arrow" size={16} /></button></div>
            <div className="mini-orders">{[
              ["#PG-1048", "Mariana López", "$629", es ? "Preparando" : "Packing"],
              ["#PG-1047", "Diego Ruiz", "$345", es ? "Enviado" : "Shipped"],
              ["#PG-1046", "Lucía Torres", "$892", es ? "Entregado" : "Delivered"],
            ].map((order, i) => <div key={order[0]}><span className="customer-dot">{["ML","DR","LT"][i]}</span><span><b>{order[1]}</b><small>{order[0]}</small></span><strong>{order[2]}</strong><em className={`order-status status-${i}`}>{order[3]}</em></div>)}</div>
          </section>
          <section className="glass chart-card health-card">
            <span className="panel-kicker">{es ? "Estado de la tienda" : "Store health"}</span><h2>{es ? "Todo funciona bien" : "Everything looks good"}</h2><div className="health-score"><strong>94</strong><span>/100</span></div><p>{es ? "Inventario, entregas y satisfacción están por encima del objetivo." : "Inventory, deliveries, and satisfaction are above target."}</p>
          </section>
        </div>
      </>}

      {adminTab === "inventory" && <><div className="metric-grid">
        <div className="metric glass"><span><Icon name="box" /></span><div><small>{t.inventory}</small><b>{products.length} {t.productsCount}</b></div></div>
        <div className="metric glass"><span><Icon name="tag" /></span><div><small>{t.promotion}</small><b>{products.filter(p => p.promo).length} {t.activePlural}</b></div></div>
        <div className="metric glass"><span><Icon name="eye" /></span><div><small>{es ? "Bajo inventario" : "Low stock"}</small><b>{products.filter(p => p.stock < 20).length} {es ? "alerta" : "alert"}</b></div></div>
      </div>{inventoryDashboard}</>}

      {adminTab === "orders" && <div className="dashboard-grid orders-dashboard">
        <section className="glass chart-card orders-main"><div className="panel-heading"><div><span className="panel-kicker">{es ? "Logística" : "Logistics"}</span><h2>{es ? "Flujo de pedidos" : "Order flow"}</h2></div><span className="period-pill">{es ? "Hoy" : "Today"}</span></div>
          <div className="order-flow">{[[42, es?"Nuevos":"New"],[28,es?"Preparando":"Packing"],[19,es?"En camino":"In transit"],[67,es?"Entregados":"Delivered"]].map(([n,label],i)=><div key={String(label)}><span className={`flow-icon flow-${i}`}><Icon name={i === 3 ? "check" : i === 2 ? "bag" : "box"} /></span><b>{n}</b><small>{label}</small></div>)}</div>
          <div className="shipping-list">{["#PG-1048 · Mariana López","#PG-1045 · Carlos Peña","#PG-1042 · Elena Solís"].map((order,i)=><div key={order}><span><b>{order}</b><small>{es ? ["Listo para recolección","En centro de distribución","Entrega estimada hoy"][i] : ["Ready for pickup","At distribution center","Estimated delivery today"][i]}</small></span><div className="shipping-progress"><i style={{width:`${[25,62,88][i]}%`}} /></div><strong>{[25,62,88][i]}%</strong></div>)}</div>
        </section>
        <section className="glass chart-card delivery-card"><span className="panel-kicker">{es ? "Cumplimiento" : "Fulfillment"}</span><h2>{es ? "Entregas a tiempo" : "On-time delivery"}</h2><div className="delivery-ring"><span><b>96%</b><small>{es ? "este mes" : "this month"}</small></span></div><p>{es ? "2.4% mejor que el mes anterior" : "2.4% better than last month"}</p></section>
      </div>}

      {adminTab === "customers" && <div className="dashboard-grid customers-dashboard">
        <section className="glass chart-card customer-overview"><div className="panel-heading"><div><span className="panel-kicker">{es ? "Comunidad" : "Community"}</span><h2>{es ? "Crecimiento de clientes" : "Customer growth"}</h2></div><b className="big-stat">2,048</b></div><div className="sparkline"><svg viewBox="0 0 600 130" preserveAspectRatio="none"><path d="M0 112 C70 105 70 82 140 88 S230 62 290 70 S380 28 430 45 S520 12 600 20"/><path className="spark-fill" d="M0 112 C70 105 70 82 140 88 S230 62 290 70 S380 28 430 45 S520 12 600 20 V130 H0z"/></svg></div>
          <div className="customer-list">{["Valentina Cruz","Mateo Hernández","Camila Ortega","Santiago Vega"].map((name,i)=><div key={name}><span className="customer-dot">{name.split(" ").map(x=>x[0]).join("")}</span><span><b>{name}</b><small>{es ? `${[12,8,5,4][i]} pedidos` : `${[12,8,5,4][i]} orders`}</small></span><strong>${[3240,2180,1560,1190][i].toLocaleString()}</strong></div>)}</div>
        </section>
        <section className="glass chart-card segment-card"><span className="panel-kicker">{es ? "Segmentos" : "Segments"}</span><h2>{es ? "Clientes leales" : "Loyal customers"}</h2><div className="segment-number">68%</div><p>{es ? "regresaron a comprar en los últimos 90 días" : "returned to shop in the last 90 days"}</p><div className="segment-bars"><span><i style={{width:"82%"}} />PaperGo Plus</span><span><i style={{width:"61%"}} />{es ? "Frecuentes" : "Frequent"}</span><span><i style={{width:"39%"}} />{es ? "Nuevos" : "New"}</span></div></section>
      </div>}
    </main>;
  };

  return <div className={dark ? "app dark" : "app"}>
    <div className="shipping-bar"><span>{t.shipping}</span><span>•</span><span>{t.deafReady}</span></div>
    <header className="site-header glass">
      <Logo onClick={() => go("home")} />
      <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label="Navegación principal">
        <button className={page === "home" ? "active" : ""} onClick={() => go("home")}>{t.home}</button>
        <button className={page === "about" ? "active" : ""} onClick={() => go("about")}>{t.about}</button>
        <button className={page === "products" ? "active" : ""} onClick={() => go("products")}>{t.products}</button>
        {loggedIn && role === "admin" && <button className={page === "admin" ? "active" : ""} onClick={() => go("admin")}>{t.admin}</button>}
      </nav>
      <div className="header-actions">
        <button className="round-button" onClick={() => setLang(lang === "es" ? "en" : "es")} aria-label={t.language}><Icon name="globe" /><span>{lang.toUpperCase()}</span></button>
        <button className="round-button icon-only" onClick={() => setDark(!dark)} aria-label={t.dark}><Icon name={dark ? "sun" : "moon"} /></button>
        {loggedIn ? <button className="login-button" onClick={() => go(role === "admin" ? "admin" : "profile")}><Icon name="user" />{role === "admin" ? t.admin : t.profile}</button> : <button className="login-button" onClick={() => setLoginOpen(true)}><Icon name="user" />{t.login}</button>}
        <button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menú"><Icon name="menu" /></button>
      </div>
    </header>

    {page === "home" && renderHome()}{page === "about" && renderAbout()}{page === "products" && renderProducts()}{page === "profile" && renderProfile()}{page === "admin" && renderAdmin()}

    <footer><Logo onClick={() => go("home")} /><p>{t.footer}</p><div><button onClick={() => go("about")}>{t.about}</button><button onClick={() => go("products")}>{t.products}</button><button onClick={() => setLoginOpen(true)}>{t.login}</button></div><small>© 2025 PaperGo</small></footer>

    <button className="chat-launcher" onClick={() => setChatOpen(!chatOpen)} aria-label={t.botTitle}>{chatOpen ? <Icon name="close" size={22} /> : <PaperBotMascot size={42} />}<span>{lang === "es" ? "Pregunta a PaperBot" : "Ask PaperBot"}</span></button>
    {chatOpen && <aside className="chat-panel glass" aria-live="polite">
      <div className="chat-head"><div className="bot-avatar"><PaperBotMascot size={49} /></div><div><b>{t.botTitle}</b><span><i />{t.botOnline}</span></div><button onClick={() => setChatOpen(false)} aria-label={t.close}><Icon name="close" /></button></div>
      <div className="chat-access"><Icon name="eye" size={16} />{t.deafReady}</div>
      <div className="chat-body"><div className="bot-message">{t.botHello}</div>{messages.map((m, i) => <div key={i}><div className="user-message">{m.question}</div><div className="bot-message">{m.answer}</div></div>)}</div>
      <form className="chat-input" onSubmit={sendMessage}><input name="message" placeholder={t.botPlaceholder} aria-label={t.botPlaceholder} /><button aria-label={t.send}><Icon name="send" /></button></form>
    </aside>}

    {loginOpen && <div className="modal-backdrop" onMouseDown={() => setLoginOpen(false)}><section className="modal glass" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setLoginOpen(false)} aria-label={t.close}><Icon name="close" /></button>
      <Logo onClick={() => { setLoginOpen(false); go("home"); }} /><h2 id="login-title">{t.access}</h2><p>{t.accessSub}</p>
      <form onSubmit={handleLogin}>
        <fieldset><legend>{t.role}</legend><div className="role-select"><button type="button" className={role === "customer" ? "active" : ""} onClick={() => setRole("customer")}><Icon name="user" />{t.customer}</button><button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}><Icon name="box" />{t.administrator}</button></div></fieldset>
        <label><span>{t.email}</span><input required type="email" defaultValue={role === "admin" ? "admin@papergo.mx" : "sofia@ejemplo.com"} /></label>
        <label><span>{t.password}</span><input required type="password" defaultValue="papergo123" /></label>
        <button className="primary wide" type="submit">{t.enter}<Icon name="arrow" /></button>
      </form><small className="demo-note">{t.demo}</small>
    </section></div>}

    {productModal && <ProductEditor product={productModal} products={products} setProducts={setProducts} close={() => setProductModal(null)} t={t} />}
  </div>;
}

function ProductEditor({ product, products, setProducts, close, t }: { product: Product | "new"; products: Product[]; setProducts: (p: Product[]) => void; close: () => void; t: typeof copy.es }) {
  const current = product === "new" ? { name: "", category: "Cuadernos", price: 0, stock: 0, promo: 0 } : product;
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const d = new FormData(e.currentTarget);
    const item: Product = { id: product === "new" ? Date.now() : product.id, name: String(d.get("name")), category: String(d.get("category")), price: Number(d.get("price")), stock: Number(d.get("stock")), promo: Number(d.get("promo")) || undefined, image: product === "new" ? photos[0] : product.image };
    setProducts(product === "new" ? [...products, item] : products.map(p => p.id === item.id ? item : p)); close();
  };
  return <div className="modal-backdrop" onMouseDown={close}><section className="modal product-modal glass" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={close}><Icon name="close" /></button><span className="eyebrow">PaperGo Admin</span><h2>{product === "new" ? t.newProduct : t.editProduct}</h2><form onSubmit={submit}>
    <label><span>{t.name}</span><input name="name" required defaultValue={current.name} /></label>
    <label><span>{t.category}</span><select name="category" defaultValue={current.category}><option>Cuadernos</option><option>Escritura</option><option>Organización</option></select></label>
    <div className="form-grid"><label><span>{t.price}</span><input name="price" type="number" min="0" required defaultValue={current.price} /></label><label><span>{t.stock}</span><input name="stock" type="number" min="0" required defaultValue={current.stock} /></label></div>
    <label><span>{t.promotion} (%)</span><input name="promo" type="number" min="0" max="90" defaultValue={current.promo} /></label><button className="primary wide">{t.save}</button>
  </form></section></div>;
}
