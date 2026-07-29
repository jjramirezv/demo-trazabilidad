import { useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Save, ShoppingCart } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

const emptyPurchase = {
  supplierId:"", supplier:"", product:"", qty:1, unit:"kg", unitPrice:0,
  currency:"PEN", expectedDate:"", paymentTerms:"Contado", notes:"", status:"Borrador",
};

export function PurchasesPage({onNavigate}) {
  const {state,dispatch}=useDemo();
  const [editing,setEditing]=useState(null);
  const [filter,setFilter]=useState("all");
  const [page,setPage]=useState(1);

  function savePurchase(values) {
    const supplier=state.suppliers.find(item=>item.id===values.supplierId);
    const normalized={...values,supplier:supplier?.name||values.supplier,qty:Number(values.qty),unitPrice:Number(values.unitPrice)};
    if(values.id) dispatch({type:"UPDATE",collection:"purchaseOrders",value:normalized});
    else {
      const sequence=Math.max(0,...state.purchaseOrders.map(order=>Number(order.id.split("-").at(-1))||0))+1;
      dispatch({type:"ADD",collection:"purchaseOrders",value:{...normalized,id:`OC-2026-${String(sequence).padStart(3,"0")}`}});
    }
    setEditing(null);
  }

  const ordered=[...state.purchaseOrders].sort((a,b)=>orderNumber(b.id)-orderNumber(a.id));
  const latest=ordered[0];
  const history=ordered.slice(1).filter(order=>filter==="all"||(filter==="draft"?order.status==="Borrador":order.status==="Confirmado"));
  const pageSize=6,totalPages=Math.max(1,Math.ceil(history.length/pageSize)),visible=history.slice((page-1)*pageSize,page*pageSize);
  const drafts=state.purchaseOrders.filter(order=>order.status==="Borrador").length;

  return <><PageHeader title="Órdenes de compra" description="Crea solicitudes a proveedores y revisa el historial sin perder de vista lo más reciente." action="Nueva compra" onAction={()=>setEditing(emptyPurchase)}/>
    <div className="mb-4 flex gap-2"><span className="rounded-lg bg-white px-3 py-2 text-xs"><b>{state.purchaseOrders.length}</b> órdenes</span><span className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800"><b>{drafts}</b> por confirmar</span></div>
    {latest&&<section className="mb-5 rounded-xl border border-blue-200 bg-white shadow-sm"><header className="flex items-center justify-between border-b border-slate-100 px-5 py-3"><div><small className="text-[9px] font-bold uppercase tracking-wide text-blue-600">Orden más reciente</small><p className="text-[10px] text-slate-500">{latest.id}</p></div><Badge>{latest.status}</Badge></header><div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="text-lg font-bold">{latest.product}</h2><p className="mt-1 text-xs text-slate-500">{latest.supplier}</p><div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[10px]"><span><b>{latest.qty} {latest.unit}</b> solicitados</span><span>Entrega: <b>{latest.expectedDate}</b></span><span>Total: <b>{money(latest.qty*latest.unitPrice,latest.currency)}</b></span></div></div><div className="flex gap-2"><Button variant="secondary" onClick={()=>setEditing(latest)}>Ver / editar</Button>{latest.status==="Confirmado"?<Button onClick={()=>onNavigate("receipts")}>Ir a recepción <ArrowRight className="size-4"/></Button>:<Button onClick={()=>dispatch({type:"CONFIRM_PURCHASE",id:latest.id})}><CheckCircle2 className="size-4"/>Confirmar</Button>}</div></div></section>}
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><header className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-bold">Historial de órdenes</h2><p className="text-[10px] text-slate-500">Las órdenes anteriores se guardan aquí de forma resumida.</p></div><div className="flex gap-2">{[["all","Todas"],["draft","Borradores"],["confirmed","Confirmadas"]].map(([id,label])=><button onClick={()=>{setFilter(id);setPage(1)}} className={`rounded-lg px-3 py-2 text-[10px] font-semibold ${filter===id?"bg-blue-600 text-white":"bg-slate-100 text-slate-600"}`} key={id}>{label}</button>)}</div></header>
      <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-xs"><thead className="bg-slate-50 text-[9px] uppercase text-slate-500"><tr>{["Orden","Producto","Proveedor","Cantidad","Entrega","Total","Estado",""].map((column,index)=><th className="px-4 py-3" key={index}>{column}</th>)}</tr></thead><tbody>{visible.map(order=><tr className="border-t border-slate-100 hover:bg-slate-50" key={order.id}><td className="px-4 py-3 font-semibold">{order.id}</td><td className="px-4 py-3">{order.product}</td><td className="max-w-56 truncate px-4 py-3 text-slate-500">{order.supplier}</td><td className="px-4 py-3">{order.qty} {order.unit}</td><td className="px-4 py-3">{order.expectedDate}</td><td className="px-4 py-3 font-semibold">{money(order.qty*order.unitPrice,order.currency)}</td><td className="px-4 py-3"><Badge>{order.status}</Badge></td><td className="px-4 py-3"><button onClick={()=>setEditing(order)} className="text-[10px] font-semibold text-blue-600">Abrir</button></td></tr>)}</tbody></table></div>
      {!visible.length&&<p className="p-8 text-center text-xs text-slate-500">No hay órdenes en este filtro.</p>}
      {history.length>pageSize&&<footer className="flex items-center justify-between border-t border-slate-200 p-3 text-[10px] text-slate-500"><span>Página {page} de {totalPages}</span><div className="flex gap-1"><button disabled={page===1} onClick={()=>setPage(value=>value-1)} className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-30"><ChevronLeft className="size-4"/></button><button disabled={page===totalPages} onClick={()=>setPage(value=>value+1)} className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-30"><ChevronRight className="size-4"/></button></div></footer>}
    </section>
    {editing&&<PurchaseModal initial={editing} suppliers={state.suppliers} products={state.products} onClose={()=>setEditing(null)} onSave={savePurchase}/>}
  </>;
}

function PurchaseModal({initial,suppliers,products,onClose,onSave}) {
  const [form,setForm]=useState(initial);
  const [errors,setErrors]=useState({});
  const inputClass="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const update=(field,value)=>setForm(current=>({...current,[field]:value}));
  const total=Number(form.qty||0)*Number(form.unitPrice||0);

  function submit(event) {
    event.preventDefault();
    const required=["supplierId","product","qty","unit","unitPrice","expectedDate","paymentTerms"];
    const nextErrors=Object.fromEntries(required.filter(field=>!String(form[field]??"").trim()).map(field=>[field,"Completa este campo"]));
    if(Number(form.qty)<=0)nextErrors.qty="La cantidad debe ser mayor que cero";
    if(Number(form.unitPrice)<=0)nextErrors.unitPrice="Ingresa un precio válido";
    setErrors(nextErrors);
    if(!Object.keys(nextErrors).length)onSave(form);
  }

  return <Modal title={form.id?"Editar orden de compra":"Nueva orden de compra"} onClose={onClose} size="lg">
    <form onSubmit={submit} className="grid grid-cols-1 gap-5 p-4 sm:p-6">
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Proveedor *" field="supplierId" errors={errors}>
          <select value={form.supplierId} onChange={event=>update("supplierId",event.target.value)} className={inputClass}><option value="">Seleccionar proveedor</option>{suppliers.filter(item=>item.status==="Activo").map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select>
        </Field>
        <Field label="Producto *" field="product" errors={errors}>
          <select value={form.product} onChange={event=>{const product=products.find(item=>item.name===event.target.value);update("product",event.target.value);if(product)update("unit",product.unit)}} className={inputClass}><option value="">Seleccionar producto</option>{products.filter(item=>["Materia prima","Ingrediente","Envase"].includes(item.category)).map(item=><option key={item.id}>{item.name}</option>)}</select>
        </Field>
      </section>
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="mb-3 text-sm font-bold">Detalle económico</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Cantidad *" field="qty" errors={errors}><input type="number" min="0.01" step="0.01" value={form.qty} onChange={event=>update("qty",event.target.value)} className={inputClass}/></Field>
          <Field label="Unidad *" field="unit" errors={errors}><select value={form.unit} onChange={event=>update("unit",event.target.value)} className={inputClass}>{["kg","L","unidad","caja","bolsa"].map(unit=><option key={unit}>{unit}</option>)}</select></Field>
          <Field label="Precio unitario *" field="unitPrice" errors={errors}><input type="number" min="0.01" step="0.01" value={form.unitPrice} onChange={event=>update("unitPrice",event.target.value)} className={inputClass}/></Field>
          <Field label="Moneda" field="currency" errors={errors}><select value={form.currency} onChange={event=>update("currency",event.target.value)} className={inputClass}><option value="PEN">Soles (S/)</option><option value="USD">Dólares (US$)</option></select></Field>
        </div>
        <div className="mt-4 flex justify-between rounded-lg bg-white p-3 text-xs"><span className="text-slate-500">Total de la orden</span><b className="text-base">{money(total,form.currency)}</b></div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha prevista *" field="expectedDate" errors={errors}><span className="relative grid"><CalendarDays className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400"/><input type="date" value={toInputDate(form.expectedDate)} onChange={event=>update("expectedDate",toDisplayDate(event.target.value))} className={`${inputClass} pl-9`}/></span></Field>
        <Field label="Condición de pago *" field="paymentTerms" errors={errors}><select value={form.paymentTerms} onChange={event=>update("paymentTerms",event.target.value)} className={inputClass}>{["Contado","Crédito a 7 días","Crédito a 15 días","Crédito a 30 días"].map(term=><option key={term}>{term}</option>)}</select></Field>
      </section>
      <Field label="Observaciones" field="notes" errors={errors}><textarea rows="3" value={form.notes} onChange={event=>update("notes",event.target.value)} className="resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Indicaciones de entrega, calidad o documentación…"/></Field>
      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit"><Save className="size-4"/>{form.id?"Guardar cambios":"Crear orden"}</Button></div>
    </form>
  </Modal>;
}

function Field({label,field,errors,children}){return <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-700"><span>{label}</span>{children}{errors[field]&&<small className="text-red-600">{errors[field]}</small>}</label>}
export function Fact({label,value,l,v}){return <div className="rounded-lg bg-slate-50 p-3"><small className="block text-[9px] text-slate-400">{label??l}</small><b className="mt-1 block text-xs">{value??v}</b></div>}
function money(value,currency){return new Intl.NumberFormat("es-PE",{style:"currency",currency:currency||"PEN"}).format(value||0)}
function toInputDate(value=""){const [day,month,year]=value.split("/");return year?`${year}-${month}-${day}`:value}
function toDisplayDate(value=""){const [year,month,day]=value.split("-");return day?`${day}/${month}/${year}`:value}
function orderNumber(id=""){return Number(id.split("-").at(-1))||0}
