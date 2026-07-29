import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, PackageCheck, Save } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

const destinations=["Frescos A-01","Insumos I-02","Envases E-01","Cuarentena C-01"];

export function ReceiptsPage({onNavigate}) {
  const {state,dispatch}=useDemo();
  const [editing,setEditing]=useState(null);
  const [filter,setFilter]=useState("all");
  const [page,setPage]=useState(1);
  const receipts=state.receipts||[];
  const pending=receipts.filter(item=>item.status==="Pendiente de recepción").length;

  function save(receipt){dispatch({type:"COMPLETE_RECEIPT",value:receipt});setEditing(null)}

  const ordered=[...receipts].sort((a,b)=>receiptNumber(b.id)-receiptNumber(a.id));
  const latest=ordered[0];
  const history=ordered.slice(1).filter(item=>filter==="all"||(filter==="pending"?item.status==="Pendiente de recepción":item.status!=="Pendiente de recepción"));
  const pageSize=6,totalPages=Math.max(1,Math.ceil(history.length/pageSize)),visible=history.slice((page-1)*pageSize,page*pageSize);

  return <><PageHeader title="Recepción y calidad" description="Atiende primero la llegada más reciente y consulta las anteriores en el historial."/>
    <div className="mb-4 flex gap-2 text-xs"><span className="rounded-lg bg-white px-3 py-2"><b>{receipts.length}</b> recepciones</span><span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800"><b>{pending}</b> pendientes</span></div>
    {latest&&<section className="mb-5 rounded-xl border border-blue-200 bg-white shadow-sm"><header className="flex items-center justify-between border-b border-slate-100 px-5 py-3"><div><small className="text-[9px] font-bold uppercase tracking-wide text-blue-600">Recepción más reciente</small><p className="text-[10px] text-slate-500">{latest.id} · desde {latest.purchaseId}</p></div><Badge>{latest.status}</Badge></header><div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="text-lg font-bold">{latest.product}</h2><p className="mt-1 text-xs text-slate-500">{latest.supplier}</p><div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[10px]"><span>Solicitado: <b>{latest.requestedQty} {latest.unit}</b></span><span>Recibido: <b>{latest.receivedQty!==""?`${latest.receivedQty} ${latest.unit}`:"Por registrar"}</b></span>{latest.lotId&&<span>Lote: <b>{latest.lotId}</b></span>}</div></div>{latest.status==="Pendiente de recepción"?<Button onClick={()=>setEditing(latest)}><PackageCheck className="size-4"/>Registrar llegada</Button>:<div className="flex gap-2"><Button variant="secondary" onClick={()=>setEditing(latest)}>Editar</Button><Button onClick={()=>onNavigate("lots")}>Ver lote</Button></div>}</div></section>}
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><header className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-bold">Historial de recepciones</h2><p className="text-[10px] text-slate-500">Los controles anteriores se conservan en formato resumido.</p></div><div className="flex gap-2">{[["all","Todas"],["pending","Pendientes"],["completed","Procesadas"]].map(([id,label])=><button onClick={()=>{setFilter(id);setPage(1)}} className={`rounded-lg px-3 py-2 text-[10px] font-semibold ${filter===id?"bg-blue-600 text-white":"bg-slate-100 text-slate-600"}`} key={id}>{label}</button>)}</div></header>
      <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-xs"><thead className="bg-slate-50 text-[9px] uppercase text-slate-500"><tr>{["Recepción","Compra","Producto","Proveedor","Solicitado","Resultado","Lote",""].map((column,index)=><th className="px-4 py-3" key={index}>{column}</th>)}</tr></thead><tbody>{visible.map(receipt=><tr className="border-t border-slate-100 hover:bg-slate-50" key={receipt.id}><td className="px-4 py-3 font-semibold">{receipt.id}</td><td className="px-4 py-3">{receipt.purchaseId}</td><td className="px-4 py-3">{receipt.product}</td><td className="max-w-52 truncate px-4 py-3 text-slate-500">{receipt.supplier}</td><td className="px-4 py-3">{receipt.requestedQty} {receipt.unit}</td><td className="px-4 py-3"><Badge>{receipt.status}</Badge></td><td className="px-4 py-3">{receipt.lotId||"—"}</td><td className="px-4 py-3"><button onClick={()=>setEditing(receipt)} className="text-[10px] font-semibold text-blue-600">{receipt.status==="Pendiente de recepción"?"Registrar":"Abrir"}</button></td></tr>)}</tbody></table></div>
      {!visible.length&&<p className="p-8 text-center text-xs text-slate-500">No hay recepciones en este filtro.</p>}
      {history.length>pageSize&&<footer className="flex items-center justify-between border-t border-slate-200 p-3 text-[10px] text-slate-500"><span>Página {page} de {totalPages}</span><div className="flex gap-1"><button disabled={page===1} onClick={()=>setPage(value=>value-1)} className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-30"><ChevronLeft className="size-4"/></button><button disabled={page===totalPages} onClick={()=>setPage(value=>value+1)} className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-30"><ChevronRight className="size-4"/></button></div></footer>}
    </section>
    {!receipts.length&&<div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><ClipboardCheck className="mx-auto size-8 text-slate-300"/><h2 className="mt-2 text-sm font-bold">No hay recepciones</h2><p className="mt-1 text-[10px] text-slate-500">Confirma una orden de compra para generar su recepción.</p></div>}
    {editing&&<QualityModal initial={editing} onClose={()=>setEditing(null)} onSave={save}/>}
  </>;
}

function QualityModal({initial,onClose,onSave}){
  const completed=initial.status!=="Pendiente de recepción";
  const initialMode=completed?(Number(initial.rejectedQty)>0||[initial.appearance,initial.packaging,initial.documentation].includes("No conforme")?"issues":"conform"):"";
  const [mode,setMode]=useState(initialMode);
  const [form,setForm]=useState({
    ...initial,
    receivedQty:initial.receivedQty===""?initial.requestedQty:initial.receivedQty,
    approvedQty:initial.approvedQty===""?initial.requestedQty:initial.approvedQty,
    rejectedQty:initial.rejectedQty===""?0:initial.rejectedQty,
    destination:initial.destination||suggestDestination(initial.product),
  });
  const [errors,setErrors]=useState({});
  const inputClass="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const update=(field,value)=>setForm(current=>({...current,[field]:value}));
  function chooseMode(value){setMode(value);setErrors({});if(value==="conform")setForm(current=>({...current,appearance:"Conforme",packaging:"Conforme",documentation:"Conforme",approvedQty:Number(current.receivedQty||0),rejectedQty:0,notes:""}));}
  function submit(event){
    event.preventDefault();
    const next={};
    ["receivedQty","supplierLot","expiry","destination"].forEach(field=>{if(String(form[field]??"").trim()==="")next[field]="Completa este campo"});
    if(!mode)next.mode="Indica si la recepción está conforme";
    if(Number(form.receivedQty)<=0)next.receivedQty="Ingresa la cantidad recibida";
    if(mode==="issues"){
      ["appearance","packaging","documentation"].forEach(field=>{if(!form[field]||form[field]==="Pendiente")next[field]="Selecciona un resultado"});
      if(Number(form.approvedQty)+Number(form.rejectedQty)!==Number(form.receivedQty))next.approvedQty="Las cantidades deben sumar lo recibido";
    }
    setErrors(next);
    if(Object.keys(next).length)return;
    const approved=mode==="conform"?Number(form.receivedQty):Number(form.approvedQty);
    const rejected=mode==="conform"?0:Number(form.rejectedQty);
    const result=approved===Number(form.receivedQty)?"Recibido":approved>0?"Recibido parcialmente":"Rechazado";
    const lotId=form.lotId||makeLotId(form.product,form.id);
    onSave({...form,receivedQty:Number(form.receivedQty),approvedQty:approved,rejectedQty:rejected,lotId,status:result});
  }
  return <Modal title={`Recibir compra · ${form.purchaseId}`} onClose={onClose} size="lg"><form onSubmit={submit} className="grid gap-5 p-5 sm:p-6">
    <section className="flex flex-col justify-between gap-3 rounded-xl bg-blue-50 p-4 sm:flex-row sm:items-center"><div><small className="text-[9px] font-bold text-blue-600">DATOS DE LA COMPRA</small><h3 className="mt-1 text-base font-bold">{form.product}</h3><p className="mt-1 text-[10px] text-slate-600">{form.supplier}</p></div><div className="rounded-lg bg-white px-4 py-2 text-right"><small className="block text-[9px] text-slate-400">Cantidad solicitada</small><b className="text-sm">{form.requestedQty} {form.unit}</b></div></section>
    <section><h3 className="mb-3 text-xs font-bold">1. Confirma la llegada</h3><div className="grid gap-4 sm:grid-cols-3"><Field label={`Cantidad recibida (${form.unit}) *`} error={errors.receivedQty}><input type="number" min="0" step="0.01" value={form.receivedQty} onChange={event=>{const value=event.target.value;update("receivedQty",value);if(mode==="conform"){update("approvedQty",value);update("rejectedQty",0)}}} className={inputClass}/></Field><Field label="Lote indicado por el proveedor *" error={errors.supplierLot}><input value={form.supplierLot} onChange={event=>update("supplierLot",event.target.value)} className={inputClass} placeholder="Ej. LT-4582"/></Field><Field label="Fecha de vencimiento *" error={errors.expiry}><input type="date" value={toInputDate(form.expiry)} onChange={event=>update("expiry",toDisplayDate(event.target.value))} className={inputClass}/></Field></div>{Number(form.receivedQty)!==Number(form.requestedQty)&&<p className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-[10px] text-amber-800"><AlertTriangle className="size-4 shrink-0"/>Llegaron {Math.abs(Number(form.requestedQty)-Number(form.receivedQty))} {form.unit} {Number(form.receivedQty)<Number(form.requestedQty)?"menos":"más"} de lo solicitado. La diferencia quedará registrada.</p>}</section>
    <section><h3 className="text-xs font-bold">2. Resultado de la revisión</h3><p className="mt-1 text-[10px] text-slate-500">Elige una opción. Solo pediremos detalles si encontraste un problema.</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>chooseMode("conform")} className={`flex items-center gap-3 rounded-xl border p-4 text-left ${mode==="conform"?"border-blue-500 bg-blue-50 ring-2 ring-blue-100":"border-slate-200 hover:border-blue-300"}`}><span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-5"/></span><span><b className="block text-xs">Todo está conforme</b><small className="mt-1 block text-[10px] text-slate-500">Aprobar toda la cantidad recibida.</small></span></button><button type="button" onClick={()=>chooseMode("issues")} className={`flex items-center gap-3 rounded-xl border p-4 text-left ${mode==="issues"?"border-amber-500 bg-amber-50 ring-2 ring-amber-100":"border-slate-200 hover:border-amber-300"}`}><span className="grid size-9 place-items-center rounded-full bg-amber-100 text-amber-700"><AlertTriangle className="size-5"/></span><span><b className="block text-xs">Encontré observaciones</b><small className="mt-1 block text-[10px] text-slate-500">Separar o rechazar una cantidad.</small></span></button></div>{errors.mode&&<small className="mt-2 block text-red-600">{errors.mode}</small>}</section>
    {mode==="issues"&&<section className="rounded-xl border border-amber-200 bg-amber-50/40 p-4"><h3 className="mb-3 text-xs font-bold">Detalle de las observaciones</h3><div className="grid gap-4 sm:grid-cols-3">{[["appearance","Aspecto del producto"],["packaging","Envase o embalaje"],["documentation","Documentación"]].map(([field,label])=><Field label={label} error={errors[field]} key={field}><select value={form[field]} onChange={event=>update(field,event.target.value)} className={inputClass}>{["Pendiente","Conforme","No conforme"].map(value=><option key={value}>{value}</option>)}</select></Field>)}</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label={`Cantidad aprobada (${form.unit})`} error={errors.approvedQty}><input type="number" min="0" step="0.01" value={form.approvedQty} onChange={event=>update("approvedQty",event.target.value)} className={inputClass}/></Field><Field label={`Cantidad rechazada (${form.unit})`} error={errors.rejectedQty}><input type="number" min="0" step="0.01" value={form.rejectedQty} onChange={event=>update("rejectedQty",event.target.value)} className={inputClass}/></Field></div><label className="mt-4 grid gap-1.5 text-xs font-medium">¿Qué ocurrió?<textarea rows="2" value={form.notes} onChange={event=>update("notes",event.target.value)} className="resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs outline-none focus:border-blue-500" placeholder="Describe brevemente el problema…"/></label></section>}
    <section className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"><div><h3 className="text-xs font-bold">Ubicación sugerida</h3><p className="mt-1 text-[10px] text-slate-500">Se eligió automáticamente según el tipo de producto.</p></div><Field label="" error={errors.destination}><select value={form.destination} onChange={event=>update("destination",event.target.value)} className={`${inputClass} min-w-56`}>{destinations.map(value=><option key={value}>{value}</option>)}</select></Field></section>
    <div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit"><Save className="size-4"/>Confirmar recepción</Button></div>
  </form></Modal>;
}
function Field({label,error,children}){return <label className="grid gap-1.5 text-xs font-medium text-slate-700"><span>{label}</span>{children}{error&&<small className="text-red-600">{error}</small>}</label>}
function makeLotId(product,receiptId){const prefix=product.split(" ").map(word=>word[0]).join("").slice(0,4).toUpperCase();return `${prefix}-2026-${receiptId.split("-").at(-1)}`}
function suggestDestination(product){const name=product.toLowerCase();if(name.includes("papa")||name.includes("mango")||name.includes("fruta"))return"Frescos A-01";if(name.includes("bolsa")||name.includes("botella")||name.includes("tapa")||name.includes("envase"))return"Envases E-01";return"Insumos I-02"}
function toInputDate(value=""){const [day,month,year]=value.split("/");return year?`${year}-${month}-${day}`:value}
function toDisplayDate(value=""){const [year,month,day]=value.split("-");return day?`${day}/${month}/${year}`:value}
function receiptNumber(id=""){return Number(id.split("-").at(-1))||0}
