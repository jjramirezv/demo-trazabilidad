import { useState } from "react";
import { Check, CheckCircle2, ClipboardList, FileText, Info } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { Modal } from "./components/Modal";
import { ProductPicker } from "./components/ProductPicker";
import { TRACEABILITY_CONFIG } from "./config/traceability";
import { PRODUCTS, seedByProduct } from "./data";
import { ExpedientPage } from "./pages/ExpedientPage";
import { MovementsPage } from "./pages/MovementsPage";
import { StagePage } from "./pages/StagePage";

const seedActivities = [
  { id: 1, title: "Riego registrado", date: "18/05/2025" },
  { id: 2, title: "Control de campo", date: "15/05/2025" },
  { id: 3, title: "Aplicación revisada", date: "10/05/2025" },
];

function ActivityForm({ product, config, onSave, onClose }) {
  const [stage, setStage] = useState("manejo");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2025-05-26");
  const [notes, setNotes] = useState("");
  return <form className="activity-form" onSubmit={event => { event.preventDefault(); onSave({ id: Date.now(), stage, title, date: date.split("-").reverse().join("/"), notes }); }}>
    <label>Etapa<select value={stage} onChange={event => setStage(event.target.value)}>{config.stages.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
    <label>Actividad<input value={title} onChange={event => setTitle(event.target.value)} placeholder={`Ej. Control de ${product.name.toLowerCase()}`} required /></label>
    <label>Fecha<input type="date" value={date} onChange={event => setDate(event.target.value)} required /></label>
    <label>Observaciones<textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Dato opcional para el expediente" /></label>
    <div><button type="button" onClick={onClose}>Cancelar</button><button className="guided-primary" type="submit"><Check /> Guardar actividad</button></div>
  </form>;
}

function HelpContent({ product, config, onClose }) {
  return <div className="guided-help"><Info /><p>Esta demo sigue un expediente por lote. Completa las etapas en orden y conserva la evidencia durante al menos dos años.</p><h3>Para {product.name.toLowerCase()} debes priorizar:</h3><ul>{config.important.map(item => <li key={item}>{item}</li>)}</ul><button className="guided-primary" onClick={onClose}>Entendido</button></div>;
}

function RecordContent({ record, lot, onClose, onRegister }) {
  return <div className="record-detail">
    <div className={`record-detail__status ${record.complete ? "complete" : "pending"}`}>{record.complete ? <CheckCircle2 /> : <ClipboardList />}<div><strong>{record.complete ? "Registro disponible" : "Registro pendiente"}</strong><span>{record.group} · {lot.id}</span></div></div>
    <dl><div><dt>Control</dt><dd>{record.field}</dd></div><div><dt>Lote</dt><dd>{lot.id}</dd></div><div><dt>Variedad</dt><dd>{lot.variety}</dd></div><div><dt>Responsable</dt><dd>{lot.producer}</dd></div></dl>
    <p>{record.complete ? "Este control ya forma parte del expediente. En una versión productiva aquí se mostrarían sus documentos, fechas y auditoría." : "Este control todavía debe completarse para cerrar la etapa del expediente."}</p>
    <div><button onClick={onClose}>Cerrar</button>{record.complete ? null : <button className="guided-primary" onClick={onRegister}>Registrar este control</button>}</div>
  </div>;
}

function R6Content({ product, lot, onClose }) {
  return <div className="r6-detail"><div className="r6-detail__source"><FileText /><div><strong>Anexo R6</strong><span>Control de producto cosechado · {product.name}</span></div></div><dl><div><dt>Fundo / predio</dt><dd>{lot.origin}</dd></div><div><dt>Cultivo</dt><dd>{product.name}</dd></div><div><dt>Código del lote</dt><dd>{lot.id}</dd></div><div><dt>Fecha de cosecha</dt><dd>{lot.harvest}</dd></div><div><dt>Variedad</dt><dd>{lot.variety}</dd></div><div><dt>Cantidad cosechada</dt><dd>{lot.incoming} kg</dd></div><div><dt>Observaciones</dt><dd>Producto recibido y vinculado al expediente.</dd></div><div><dt>Responsable técnico</dt><dd>{lot.producer}</dd></div></dl><button className="guided-primary" onClick={onClose}>Cerrar registro</button></div>;
}

export default function App() {
  const [productId, setProductId] = useState(null);
  const [active, setActive] = useState("expediente");
  const [modal, setModal] = useState(null);
  const [activities, setActivities] = useState(seedActivities);

  if (!productId) return <ProductPicker onSelect={id => { setProductId(id); setActive("expediente"); }} />;

  const product = PRODUCTS[productId];
  const config = TRACEABILITY_CONFIG[productId];
  const data = seedByProduct[productId];
  const lot = data.lots[0];

  let page;
  if (active === "parcela" || active === "manejo" || active === "calidad") {
    page = <StagePage product={product} config={config} pageId={active} lot={lot} activities={activities} onAdd={() => setModal({ type: "activity" })} onNavigate={setActive} onOpenRecord={record => setModal({ type: "record", record })} />;
  } else if (active === "movimientos") {
    page = <MovementsPage product={product} movements={data.movements} onAdd={() => setModal({ type: "activity" })} />;
  } else {
    page = <ExpedientPage product={product} config={config} lot={lot} onNavigate={setActive} onRegister={() => setModal({ type: "activity" })} onOpenR6={() => setModal({ type: "r6" })} />;
  }

  return <AppShell product={product} active={active === "inicio" ? "expediente" : active} onNavigate={id => setActive(id === "inicio" ? "expediente" : id)} onChangeProduct={() => setProductId(null)} onHelp={() => setModal({ type: "help" })}>
    {page}
    {modal?.type === "activity" ? <Modal title="Registrar actividad" subtitle={`Se añadirá al expediente de ${product.name.toLowerCase()} · ${lot.id}.`} onClose={() => setModal(null)}><ActivityForm product={product} config={config} onClose={() => setModal(null)} onSave={activity => { setActivities(current => [activity, ...current]); setModal(null); }} /></Modal> : null}
    {modal?.type === "help" ? <Modal title="Cómo usar este expediente" subtitle="Un recorrido sencillo desde la parcela hasta la salida." onClose={() => setModal(null)}><HelpContent product={product} config={config} onClose={() => setModal(null)} /></Modal> : null}
    {modal?.type === "record" ? <Modal title={modal.record.field} subtitle="Ficha del control seleccionado." onClose={() => setModal(null)}><RecordContent record={modal.record} lot={lot} onClose={() => setModal(null)} onRegister={() => setModal({ type: "activity" })} /></Modal> : null}
    {modal?.type === "r6" ? <Modal title="Registro de producto cosechado" subtitle="Campos del Anexo R6 de la guía BPA." onClose={() => setModal(null)}><R6Content product={product} lot={lot} onClose={() => setModal(null)} /></Modal> : null}
  </AppShell>;
}
