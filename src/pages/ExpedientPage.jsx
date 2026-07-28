import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, FileText, Info, PackageCheck } from "lucide-react";
import { ProgressRail } from "../components/ProgressRail";
import { STATUS_LABEL } from "../config/traceability";
import { formatDate, formatKg } from "../data";

export function ExpedientPage({ product, config, lot, onNavigate, onRegister, onOpenR6 }) {
  return <div className="guided-page">
    <div className="guided-heading"><div><h1>{product.name} · Lote {lot.id}</h1><p>{lot.variety} · {lot.producer} · {lot.origin}</p></div><button className="guided-primary" onClick={onRegister}>+ Registrar actividad</button></div>
    <ProgressRail stages={config.stages} onSelect={id => onNavigate(id === "cosecha" ? "calidad" : id)} />
    <div className="expedient-layout">
      <section className="expedient-main"><h2>Expediente del lote</h2><div className="expedient-list">
        {config.stages.map((stage, index) => <button key={stage.id} className={stage.status} onClick={() => onNavigate(stage.id === "cosecha" ? "calidad" : stage.id)}>
          <b>{index + 1}</b><span className="expedient-icon">{stage.status === "complete" ? <CheckCircle2 /> : stage.status === "review" ? <AlertCircle /> : <ClipboardList />}</span><span><strong>{stage.title}</strong><small>{stage.detail}</small></span><em>{STATUS_LABEL[stage.status]}</em><ArrowRight />
        </button>)}
      </div><div className="next-action"><Info /><span>Tienes 1 paso pendiente para completar el expediente.</span><button onClick={() => onNavigate("movimientos")}>Ir a salida <ArrowRight /></button></div></section>
      <aside className="expedient-aside"><section><h2>Lo importante para {product.name.toLowerCase()}</h2>{config.important.map((item, index) => <div className="important-row" key={item}><span>{index + 1}</span><p>{item}</p></div>)}</section>
        <section className="r6-card"><div><PackageCheck /><h2>Registro R6</h2></div><dl><div><dt>Fecha de cosecha</dt><dd>{formatDate(lot.harvest)}</dd></div><div><dt>Variedad</dt><dd>{lot.variety}</dd></div><div><dt>Cantidad</dt><dd>{formatKg(lot.incoming)}</dd></div><div><dt>Responsable</dt><dd>{lot.producer}</dd></div></dl><button onClick={onOpenR6}><FileText /> Ver registro</button></section>
      </aside>
    </div>
  </div>;
}
