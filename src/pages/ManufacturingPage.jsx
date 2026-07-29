import { useState } from "react";
import { ArrowRight, CheckCircle2, Factory, Play, Save } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

export function ManufacturingPage({onNavigate}){
  const {state,dispatch}=useDemo();
  const [creating,setCreating]=useState(false);
  const [finishing,setFinishing]=useState(null);
  const orders=[...(state.productionOrders||[])].sort((a,b)=>numberOf(b.id)-numberOf(a.id));
  const active=orders.filter(order=>order.status!=="Terminada");
  const completed=orders.filter(order=>order.status==="Terminada");

  function createOrder(values){
    const recipe=state.recipes.find(item=>item.id===values.recipeId);
    const scale=Number(values.plannedQty)/Number(recipe.outputQty);
    const components=recipe.components.map(component=>{const lot=state.lots.find(item=>item.product===component.product&&Number(item.qty)>0&&!["Bloqueado","Cuarentena"].includes(item.status));return {...component,qty:round(Number(component.qty)*scale),lotId:lot?.id||""}});
    const sequence=Math.max(0,...orders.map(order=>numberOf(order.id)))+1;
    dispatch({type:"ADD",collection:"productionOrders",value:{...values,id:`OF-2026-${String(sequence).padStart(3,"0")}`,product:recipe.name,unit:recipe.outputUnit,plannedQty:Number(values.plannedQty),components,status:"Borrador"}});
    setCreating(false);
  }
  function complete(values){dispatch({type:"COMPLETE_PRODUCTION",value:{...values,producedQty:Number(values.producedQty),rejectedQty:Number(values.rejectedQty),sampleQty:Number(values.sampleQty),lossQty:Number(values.lossQty),status:"Terminada"}});setFinishing(null)}

  const current=active[0]||orders[0];
  return <><PageHeader title="Órdenes de producción" description="Planifica qué fabricar, reserva los lotes necesarios y registra el producto obtenido." action="Nueva orden" onAction={()=>setCreating(true)}/>
    <section className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4"><h2 className="text-xs font-bold text-blue-900">¿Cómo funciona?</h2><p className="mt-1 text-[10px] leading-4 text-blue-800">1. Elige una receta y cantidad. 2. El sistema calcula y asigna los lotes. 3. Inicia la orden. 4. Registra el resultado para actualizar Inventario y Trazabilidad.</p></section>
    {current&&<ProductionCard order={current} lots={state.lots} onStart={()=>dispatch({type:"ADVANCE_PRODUCTION",id:current.id,status:"En proceso"})} onFinish={()=>setFinishing(current)} onTrace={()=>onNavigate("traceability")}/>}
    <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white"><header className="border-b border-slate-200 p-4"><h2 className="text-sm font-bold">Historial de producción</h2><p className="text-[10px] text-slate-500">{completed.length} órdenes terminadas</p></header><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50 text-[9px] uppercase text-slate-500"><tr>{["Orden","Producto","Planificado","Producido","Lote obtenido","Estado"].map(column=><th className="px-4 py-3" key={column}>{column}</th>)}</tr></thead><tbody>{completed.map(order=><tr className="border-t border-slate-100" key={order.id}><td className="px-4 py-3 font-semibold">{order.id}</td><td className="px-4 py-3">{order.product}</td><td className="px-4 py-3">{order.plannedQty} {order.unit}</td><td className="px-4 py-3">{order.producedQty} {order.unit}</td><td className="px-4 py-3">{order.outputLotId}</td><td className="px-4 py-3"><Badge>{order.status}</Badge></td></tr>)}</tbody></table></div></section>
    {creating&&<CreateProductionModal recipes={state.recipes} lots={state.lots} onClose={()=>setCreating(false)} onSave={createOrder}/>}
    {finishing&&<FinishProductionModal order={finishing} onClose={()=>setFinishing(null)} onSave={complete}/>}
  </>;
}

function ProductionCard({order,lots,onStart,onFinish,onTrace}){
  const ready=order.components.every(component=>component.lotId&&Number(lots.find(lot=>lot.id===component.lotId)?.qty||0)>=Number(component.qty));
  return <section className="rounded-xl border border-slate-200 bg-white"><header className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center"><div><small className="text-[9px] text-slate-400">ORDEN ACTUAL · {order.id}</small><h2 className="text-lg font-bold">{order.product}</h2><p className="text-xs text-slate-500">Plan: {order.plannedQty} {order.unit} · {order.workCenter}</p></div><Badge>{order.status}</Badge></header>
    <div className="p-5"><h3 className="mb-3 text-xs font-bold">Materiales asignados</h3><div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[650px] text-left text-xs"><thead className="bg-slate-50 text-[9px] uppercase text-slate-500"><tr>{["Componente","Lote asignado","Necesario","Disponible","Validación"].map(column=><th className="px-3 py-2" key={column}>{column}</th>)}</tr></thead><tbody>{order.components.map(component=>{const lot=lots.find(item=>item.id===component.lotId),enough=lot&&Number(lot.qty)>=Number(component.qty);return <tr className="border-t border-slate-100" key={component.product}><td className="px-3 py-3">{component.product}</td><td className="px-3 py-3">{component.lotId||"Sin lote disponible"}</td><td className="px-3 py-3">{component.qty} {component.unit}</td><td className="px-3 py-3">{lot?`${lot.qty} ${lot.unit}`:"—"}</td><td className="px-3 py-3"><Badge>{enough?"Disponible":"Faltante"}</Badge></td></tr>})}</tbody></table></div>{!ready&&<p className="mt-3 text-[10px] text-red-600">No se puede iniciar: faltan lotes o cantidades disponibles.</p>}{order.status==="Terminada"&&<div className="mt-4 grid gap-2 sm:grid-cols-4"><Fact label="Conformes" value={`${order.producedQty} ${order.unit}`}/><Fact label="Rechazadas" value={order.rejectedQty}/><Fact label="Pérdida" value={order.lossQty}/><Fact label="Lote creado" value={order.outputLotId}/></div>}</div>
    <footer className="flex justify-end border-t border-slate-200 p-4">{order.status==="Terminada"?<Button onClick={onTrace}>Ver trazabilidad <ArrowRight className="size-4"/></Button>:order.status==="En proceso"?<Button onClick={onFinish}><CheckCircle2 className="size-4"/>Registrar resultado</Button>:<Button disabled={!ready} onClick={onStart}><Play className="size-4"/>Iniciar producción</Button>}</footer>
  </section>;
}

function CreateProductionModal({recipes,lots,onClose,onSave}){
  const available=recipes.filter(recipe=>recipe.status==="Activa");
  const [form,setForm]=useState({recipeId:available[0]?.id||"",plannedQty:available[0]?.outputQty||1,plannedDate:new Date().toLocaleDateString("es-PE"),workCenter:"Línea de producción 1"});
  const recipe=recipes.find(item=>item.id===form.recipeId);
  const scale=recipe?Number(form.plannedQty)/Number(recipe.outputQty):0;
  return <Modal title="Nueva orden de producción" onClose={onClose} size="lg"><form onSubmit={event=>{event.preventDefault();onSave(form)}} className="grid gap-5 p-5 sm:p-6"><section className="grid gap-4 sm:grid-cols-2"><Field label="Receta *"><select value={form.recipeId} onChange={event=>{const next=recipes.find(item=>item.id===event.target.value);setForm(current=>({...current,recipeId:event.target.value,plannedQty:next.outputQty}))}} className="input-agro">{available.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></Field><Field label={`Cantidad planificada (${recipe?.outputUnit||""}) *`}><input type="number" min="1" value={form.plannedQty} onChange={event=>setForm(current=>({...current,plannedQty:event.target.value}))} className="input-agro"/></Field><Field label="Fecha planificada"><input type="date" value={toInputDate(form.plannedDate)} onChange={event=>setForm(current=>({...current,plannedDate:toDisplayDate(event.target.value)}))} className="input-agro"/></Field><Field label="Área de trabajo"><select value={form.workCenter} onChange={event=>setForm(current=>({...current,workCenter:event.target.value}))} className="input-agro">{["Línea de producción 1","Línea de fritura 1","Área de preparación","Área de mezclado"].map(value=><option key={value}>{value}</option>)}</select></Field></section><section className="rounded-xl border border-slate-200 p-4"><h3 className="text-xs font-bold">Materiales calculados</h3><div className="mt-3 grid gap-2">{recipe?.components.map(component=>{const required=round(Number(component.qty)*scale),lot=lots.find(item=>item.product===component.product&&Number(item.qty)>0);return <div className="flex justify-between rounded-lg bg-slate-50 p-3 text-[10px]" key={component.product}><span>{component.product}</span><span><b>{required} {component.unit}</b> · {lot?`Lote ${lot.id}`:"Sin lote disponible"}</span></div>})}</div></section><div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit"><Save className="size-4"/>Crear orden</Button></div></form></Modal>;
}

function FinishProductionModal({order,onClose,onSave}){const [form,setForm]=useState({...order,producedQty:order.plannedQty,rejectedQty:0,sampleQty:0,lossQty:0,outputLotId:`${initials(order.product)}-2026-${order.id.split("-").at(-1)}`,expiry:""});const update=(field,value)=>setForm(current=>({...current,[field]:value}));return <Modal title={`Resultado de producción · ${order.id}`} onClose={onClose}><form onSubmit={event=>{event.preventDefault();onSave(form)}} className="grid gap-4 p-5"><p className="rounded-lg bg-blue-50 p-3 text-[10px] text-blue-800">Registra las cantidades obtenidas. Al confirmar se descontarán los insumos y se creará el nuevo lote.</p><div className="grid gap-4 sm:grid-cols-2"><Field label={`Cantidad conforme (${order.unit})`}><input required type="number" min="0" value={form.producedQty} onChange={event=>update("producedQty",event.target.value)} className="input-agro"/></Field><Field label="Cantidad rechazada"><input required type="number" min="0" value={form.rejectedQty} onChange={event=>update("rejectedQty",event.target.value)} className="input-agro"/></Field><Field label="Muestras"><input required type="number" min="0" value={form.sampleQty} onChange={event=>update("sampleQty",event.target.value)} className="input-agro"/></Field><Field label="Pérdida"><input required type="number" min="0" value={form.lossQty} onChange={event=>update("lossQty",event.target.value)} className="input-agro"/></Field><Field label="Nuevo lote"><input required value={form.outputLotId} onChange={event=>update("outputLotId",event.target.value)} className="input-agro"/></Field><Field label="Vencimiento"><input required type="date" value={toInputDate(form.expiry)} onChange={event=>update("expiry",toDisplayDate(event.target.value))} className="input-agro"/></Field></div><div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit">Finalizar y crear lote</Button></div></form></Modal>}
function Field({label,children}){return <label className="grid gap-1.5 text-xs font-medium text-slate-700"><span>{label}</span>{children}</label>}
function Fact({label,value}){return <div className="rounded-lg bg-slate-50 p-3"><small className="text-[9px] text-slate-400">{label}</small><b className="mt-1 block text-xs">{value}</b></div>}
function numberOf(id=""){return Number(id.split("-").at(-1))||0}
function round(value){return Math.round(value*100)/100}
function initials(text){return text.split(" ").filter(word=>word.length>2).map(word=>word[0]).join("").slice(0,4).toUpperCase()}
function toInputDate(value=""){const [day,month,year]=value.split("/");return year?`${year}-${month}-${day}`:value}
function toDisplayDate(value=""){const [year,month,day]=value.split("-");return day?`${day}/${month}/${year}`:value}
