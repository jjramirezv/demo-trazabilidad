import { AlertTriangle, ArrowRight, Check, Clock3, Factory, Package, Play, ShoppingCart, Truck } from "lucide-react";
import { models, seed } from "../data/seed";
import { useDemo } from "../state/DemoContext";
import { Badge } from "../components/ui/Badge";
import { GenealogyGraph } from "../features/traceability/GenealogyGraph";

export function DashboardPage({onNavigate}) {
 const {state}=useDemo(), model=models[state.model];
 const tasks=tasksByModel[state.model];
 return <><div className="mb-6"><h1 className="text-2xl font-bold tracking-tight">Centro de operaciones</h1><p className="mt-1 text-sm text-slate-500">Modelo <b className="text-blue-600">{model.label}</b>. {model.description}</p></div>
 <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4"><div className="flex min-w-max items-center">{model.pipeline.map((p,i)=><div className="flex items-center" key={p}><button onClick={()=>onNavigate(routeFor(p))} className={`flex w-36 items-center gap-3 rounded-lg border p-3 text-left ${i<2?"border-emerald-200":i===3?"border-blue-400 bg-blue-600 text-white":"border-slate-200"}`}><span className={`grid size-7 place-items-center rounded-full ${i<2?"bg-emerald-600 text-white":i===3?"bg-white text-blue-600":"bg-slate-100 text-slate-500"}`}>{i<2?<Check className="size-4"/>:i+1}</span><span><b className="block text-[11px]">{p}</b><small className={`text-[9px] ${i===3?"text-blue-100":"text-slate-400"}`}>{i<2?"Completado":i===3?"En proceso":"Pendiente"}</small></span></button>{i<model.pipeline.length-1&&<ArrowRight className="mx-2 size-4 text-slate-300"/>}</div>)}</div></div>
 <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white"><header className="flex items-center justify-between border-b border-slate-200 p-4"><h2 className="font-bold">Trabajo pendiente</h2><Badge>{tasks.length} tareas</Badge></header><div>{tasks.map((t,i)=><button onClick={()=>onNavigate(t[5])} key={t[0]} className="grid w-full grid-cols-[42px_1fr] gap-3 border-b border-slate-100 p-4 text-left hover:bg-slate-50 md:grid-cols-[42px_1fr_1.2fr_90px_140px] md:items-center"><span className={`grid size-9 place-items-center rounded-full ${i===3?"bg-red-50 text-red-600":i===1?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600"}`}>{i===3?<AlertTriangle/>:i===1?<Truck/>:<Factory/>}</span><div><b className="block text-xs">{t[0]}</b><small className="text-[10px] text-slate-500">{t[1]}</small></div><p className="hidden text-[10px] leading-4 text-slate-500 md:block">{t[2]}</p><span className="hidden md:block"><Badge>{t[3]}</Badge></span><span className={`hidden rounded-lg border px-3 py-2 text-center text-[10px] font-semibold md:block ${i===3?"border-red-300 text-red-600":"border-blue-300 text-blue-600"}`}>{t[4]}</span></button>)}</div></section>
 <section className="rounded-xl border border-slate-200 bg-white p-4"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold">Trazabilidad del flujo</h2><p className="text-[10px] text-slate-500">{traceTitles[state.model]}</p></div><button onClick={()=>onNavigate("traceability")} className="text-[10px] font-semibold text-blue-600">Ver explorador</button></div><GenealogyGraph model={state.model} incident={state.incident}/></section></div>
 <section className="mt-4 rounded-xl border border-slate-200 bg-white"><header className="border-b border-slate-200 p-4"><h2 className="font-bold">Movimientos recientes</h2></header><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-[10px]"><thead className="bg-slate-50 text-slate-500"><tr>{["Fecha","Documento","Producto","Lote","Origen / destino","Cantidad","Estado"].map(h=><th className="px-4 py-3" key={h}>{h}</th>)}</tr></thead><tbody>{seed.movements.map(r=><tr className="border-t border-slate-100" key={r[1]}>{r.map((v,i)=><td className="px-4 py-3" key={v}>{i===6?<Badge>{v}</Badge>:v}</td>)}</tr>)}</tbody></table></div></section></>;
}
const tasksByModel={
 distributor:[
  ["REC-2026-014","Ingreso de mercadería","La recepción requiere validar cantidades y lote del proveedor.","Pendiente","Revisar recepción","receipts"],
  ["LOT-DIST-2026-014","Papa Yungay · 460 kg","El lote está disponible para asignarlo a un pedido.","Disponible","Ver inventario","inventory"],
  ["PV-2026-018","Mercado Mayorista del Centro","El pedido requiere reservar existencias y preparar despacho.","Borrador","Preparar venta","sales"],
 ],
 manufacturer:[
  ["OF-CHIPS-001","Chips de papa de 100 g","La orden está preparada y aún no se inició.","Lista","Iniciar transformación","manufacturing"],
  ["REC-2026-001","Papa Yungay · PAP-2026-001","La recepción espera el resultado del control de calidad.","Calidad","Realizar control","receipts"],
  ["PV-2026-021","Supermercado Valle Central","El pedido requiere reservar el lote producido.","Borrador","Preparar venta","sales"],
  ["ACE-2026-001","Aceite vegetal","Hay una observación de calidad abierta sobre este lote.","Incidente","Ver incidente","incidents"],
 ],
 bulk:[
  ["OF-PREP-001","Preparación de jugo base de mango","El tanque TQ-01 está pendiente de aprobación de calidad.","Calidad","Revisar preparación","bulk"],
  ["BASE-MANGO-2026-001","Jugo base · Tanque TQ-01","Hay 985 L aprobados y disponibles para envasar.","Disponible","Abrir envasado","bulk"],
  ["OF-ENV-001","Jugo de mango de 500 ml","La orden está lista para iniciar el envasado.","Lista","Iniciar envasado","bulk"],
  ["PV-2026-024","Distribuidora Junín","El pedido requiere 480 botellas del lote terminado.","Borrador","Preparar venta","sales"],
 ],
};
const traceTitles={
 distributor:"De la recepción del proveedor hasta la entrega al cliente",
 manufacturer:"De las materias primas al lote CHIP-2026-001",
 bulk:"De los ingredientes al jugo base y su presentación de 500 ml",
};
const routeFor=p=>p.includes("Compra")?"purchases":p.includes("Recepción")?"receipts":p.includes("Inventario")||p.includes("Almacenamiento")||p.includes("Disponibilidad")?"inventory":p.includes("Producción")||p.includes("Transformación")?"manufacturing":p.includes("Envasado")||p.includes("Preparación")||p.includes("tanque")?"bulk":p.includes("Venta")?"sales":p.includes("Entrega")?"deliveries":"lots";
