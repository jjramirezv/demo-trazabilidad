import { CircleHelp, ClipboardList, FileCheck2, Home, Leaf, LogOut, Map, Menu, Search, Sprout, Truck, Wheat, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  ["inicio", "Inicio", Home],
  ["parcela", "Parcela", Map],
  ["manejo", "Manejo del cultivo", Sprout],
  ["calidad", "Cosecha y calidad", FileCheck2],
  ["movimientos", "Movimientos", Truck],
  ["expediente", "Expediente", ClipboardList],
];

function ProductIcon({ id }) {
  if (id === "maiz") return <Wheat />;
  if (id === "zanahoria") return <Sprout />;
  return <Leaf />;
}

export function AppShell({ product, active, onNavigate, onChangeProduct, onHelp, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const style = { "--primary": product.theme.primary, "--primary-strong": product.theme.strong, "--primary-soft": product.theme.soft, "--accent": product.theme.accent };
  return <div className={`guided-shell guided-shell--${product.id}`} style={style}>
    <aside className={mobileOpen ? "is-open" : ""}>
      <div className="guided-brand"><ProductIcon id={product.id} /><strong>Raíz</strong></div>
      <button className="guided-close" onClick={() => setMobileOpen(false)}><X /></button>
      <button className="guided-product" onClick={onChangeProduct}><ProductIcon id={product.id} /><span>{product.name} · Cambiar</span></button>
      <nav>{NAV.map(([id, label, Icon]) => <button key={id} className={active === id ? "active" : ""} onClick={() => { onNavigate(id); setMobileOpen(false); }}><Icon /><span>{label}</span></button>)}</nav>
      <div className="guided-user"><span>RQ</span><div><strong>Rosa Quispe</strong><small>Productora</small></div></div>
    </aside>
    <main>
      <header className="guided-topbar"><button className="guided-menu" onClick={() => setMobileOpen(true)}><Menu /></button><label><Search /><input placeholder="Buscar lote o registro" /></label><button onClick={onHelp}><CircleHelp /> Ayuda</button><button onClick={onChangeProduct}><LogOut /> Salir</button></header>
      {children}
    </main>
  </div>;
}
