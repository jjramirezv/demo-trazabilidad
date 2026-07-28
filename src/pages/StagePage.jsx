import { Check, ChevronRight, ClipboardCheck, Plus } from "lucide-react";
import { ProgressRail } from "../components/ProgressRail";

export function StagePage({ product, config, pageId, lot, activities, onAdd, onNavigate, onOpenRecord }) {
  const page = config.pages[pageId];
  return <div className="guided-page">
    <div className="guided-heading"><div><h1>{page.title}</h1><p>{page.intro}</p></div><button className="guided-primary" onClick={onAdd}><Plus /> Registrar actividad</button></div>
    <ProgressRail stages={config.stages} activeStage={pageId} onSelect={id => onNavigate(id === "cosecha" ? "calidad" : id)} />
        <div className="stage-layout"><section className="stage-groups">{page.groups.map(([title, fields]) => <article key={title}><header><div><ClipboardCheck /><h2>{title}</h2></div><span>{fields.length} controles</span></header>{fields.map((field, index) => <button key={field} onClick={() => onOpenRecord({ group: title, field, complete: index < 2, pageId })}><span className={index < 2 ? "done" : ""}>{index < 2 ? <Check /> : index + 1}</span><div><strong>{field}</strong><small>{index < 2 ? "Registrado para este lote" : "Completar o revisar"}</small></div><ChevronRight /></button>)}</article>)}</section>
      <aside className="lot-summary"><h2>Lote {lot.id}</h2><dl><div><dt>Variedad</dt><dd>{lot.variety}</dd></div><div><dt>Productor</dt><dd>{lot.producer}</dd></div><div><dt>Origen</dt><dd>{lot.origin}</dd></div><div><dt>Área</dt><dd>{lot.area} ha</dd></div></dl><h3>Actividad reciente</h3>{activities.slice(0, 3).map(activity => <p key={activity.id}><span></span><strong>{activity.title}</strong><small>{activity.date}</small></p>)}</aside>
    </div>
  </div>;
}
