import { ArrowRight, CircleHelp, FileText, FolderOpen, Leaf, Sprout, Wheat } from "lucide-react";
import { useState } from "react";
import { PRODUCTS } from "../data";
import { TRACEABILITY_CONFIG } from "../config/traceability";
import { Modal } from "./Modal";

function ProductIcon({ id }) {
  if (id === "maiz") return <Wheat />;
  if (id === "zanahoria") return <Sprout />;
  return <Leaf />;
}

export function ProductPicker({ onSelect }) {
  const [showHelp, setShowHelp] = useState(false);
  return <div className="compact-picker">
    <header><div><strong>Raíz</strong><i>•</i><span>Trazabilidad Huancayo</span></div><button onClick={() => setShowHelp(true)}><CircleHelp /> Ayuda</button></header>
    <main>
      <section className="picker-box">
        <h1>Elige un producto para comenzar</h1>
        <p>Trabajarás únicamente con los registros del producto seleccionado.</p>
        <div className="picker-grid">
          {Object.values(PRODUCTS).map(product => <button key={product.id} className={`picker-card picker-card--${product.id}`} onClick={() => onSelect(product.id)}>
            <span className="picker-card__icon"><ProductIcon id={product.id} /></span>
            <strong>{product.name}</strong>
            <small>{TRACEABILITY_CONFIG[product.id].short}</small>
            <span>Abrir <ArrowRight /></span>
          </button>)}
        </div>
      </section>
      <div className="picker-how">
        <div><b>1</b><span><ProductIcon id="papa" /> Elige producto</span></div>
        <i></i>
        <div><b>2</b><span><FileText /> Registra el lote</span></div>
        <i></i>
        <div><b>3</b><span><FolderOpen /> Consulta su expediente</span></div>
      </div>
      <p className="picker-separate">Los productos se gestionan por separado</p>
    </main>
    {showHelp ? <Modal title="Cómo comenzar" subtitle="La demo mantiene cada producto en un espacio independiente." onClose={() => setShowHelp(false)}><div className="guided-help"><CircleHelp /><p>Selecciona Papa, Maíz o Zanahoria. Luego elige un lote y completa su expediente desde la parcela hasta la salida.</p><button className="picker-help-button" onClick={() => setShowHelp(false)}>Entendido</button></div></Modal> : null}
  </div>;
}
