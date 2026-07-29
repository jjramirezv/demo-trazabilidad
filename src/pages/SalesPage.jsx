import { useState } from "react";
import { ArrowRight, CheckCircle2, PackageCheck, Save, Truck } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

export function SalesPage({route,onNavigate}){
  return route==="deliveries"?<DeliveriesPage onNavigate={onNavigate}/>:<SalesOrdersPage onNavigate={onNavigate}/>;
}

function SalesOrdersPage({onNavigate}){
  const {state,dispatch}=useDemo();
  const [editing,setEditing]=useState(null);
  const orders=[...(state.salesOrders||[])].sort((a,b)=>numberOf(b.id)-numberOf(a.id));
  const latest=orders[0],history=orders.slice(1);

  function save(values){
    const customer=state.customers.find(item=>item.id===values.customerId),lot=state.lots.find(item=>item.id===values.lotId);
    const normalized={...values,customer:customer?.name||"",product:lot?.product||"",unit:lot?.unit||"",qty:Number(values.qty),unitPrice:Number(values.unitPrice)};
    if(values.id)dispatch({type:"UPDATE",collection:"salesOrders",value:normalized});
    else{const sequence=Math.max(0,...orders.map(item=>numberOf(item.id)))+1;dispatch({type:"ADD",collection:"salesOrders",value:{...normalized,id:`PV-2026-${String(sequence).padStart(3,"0")}`,status:"Borrador"}})}
    setEditing(null);
  }
  return <><PageHeader title="Pedidos de venta" description="Registra lo solicitado por el cliente y reserva un lote disponible para su despacho." action="Nuevo pedido" onAction={()=>setEditing({customerId:"",lotId:"",qty:1,unitPrice:0,currency:"PEN",deliveryDate:"",paymentTerms:"Contado",notes:"",status:"Borrador"})}/>
    <section className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4"><h2 className="text-xs font-bold text-blue-900">Flujo conectado</h2><p className="mt-1 text-[10px] text-blue-800">Al confirmar el pedido, la cantidad queda reservada en Inventario y se genera un despacho pendiente.</p></section>
    {latest&&<SaleCard order={latest} onEdit={()=>setEditing(latest)} onConfirm={()=>dispatch({type:"CONFIRM_SALE",id:latest.id})} onDelivery={()=>onNavigate("deliveries")}/>}
    <History title="Historial de pedidos" rows={history.map(order=>[order.id,order.customer,order.product,`${order.qty} ${order.unit}`,order.lotId,order.status])} columns={["Pedido","Cliente","Producto","Cantidad","Lote","Estado"]}/>{editing&&<SaleModal initial={editing} customers={state.customers} lots={state.lots} onClose={()=>setEditing(null)} onSave={save}/>}
  </>;
}

function SaleCard({order,onEdit,onConfirm,onDelivery}){return <section className="mb-5 rounded-xl border border-slate-200 bg-white"><header className="flex justify-between border-b border-slate-200 p-5"><div><small className="text-[9px] text-slate-400">PEDIDO MÁS RECIENTE · {order.id}</small><h2 className="text-lg font-bold">{order.product}</h2><p className="text-xs text-slate-500">{order.customer}</p></div><Badge>{order.status}</Badge></header><div className="grid gap-3 p-5 sm:grid-cols-4"><Fact label="Cantidad" value={`${order.qty} ${order.unit}`}/><Fact label="Lote reservado" value={order.lotId}/><Fact label="Entrega prevista" value={order.deliveryDate}/><Fact label="Total" value={money(order.qty*order.unitPrice,order.currency)}/></div><footer className="flex justify-end gap-2 border-t border-slate-200 p-4">{order.status==="Borrador"?<><Button variant="secondary" onClick={onEdit}>Editar</Button><Button onClick={onConfirm}><CheckCircle2 className="size-4"/>Confirmar y reservar</Button></>:<Button onClick={onDelivery}>Abrir despacho <ArrowRight className="size-4"/></Button>}</footer></section>}

function SaleModal({initial,customers,lots,onClose,onSave}){
  const [form,setForm]=useState(initial);
  const [errors,setErrors]=useState({});
  const lot=lots.find(item=>item.id===form.lotId),available=lot?Number(lot.qty)-Number(lot.reserved||0):0;
  const update=(field,value)=>setForm(current=>({...current,[field]:value}));
  function submit(event){event.preventDefault();const next={};["customerId","lotId","qty","unitPrice","deliveryDate"].forEach(field=>{if(!String(form[field]??"").trim())next[field]="Completa este campo"});if(Number(form.qty)>available)next.qty=`Solo hay ${available} ${lot?.unit||""} disponibles`;if(Number(form.qty)<=0)next.qty="Ingresa una cantidad válida";setErrors(next);if(!Object.keys(next).length)onSave(form)}
  return <Modal title={form.id?"Editar pedido":"Nuevo pedido de venta"} onClose={onClose} size="lg"><form onSubmit={submit} className="grid gap-5 p-5 sm:p-6"><section className="grid gap-4 sm:grid-cols-2"><Field label="Cliente *" error={errors.customerId}><select value={form.customerId} onChange={event=>update("customerId",event.target.value)} className="input-agro"><option value="">Seleccionar cliente</option>{customers.filter(item=>item.status==="Activo").map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></Field><Field label="Producto y lote disponible *" error={errors.lotId}><select value={form.lotId} onChange={event=>update("lotId",event.target.value)} className="input-agro"><option value="">Seleccionar lote</option>{lots.filter(item=>Number(item.qty)-Number(item.reserved||0)>0&&item.status!=="Bloqueado").map(item=><option value={item.id} key={item.id}>{item.product} · {item.id} · {Number(item.qty)-Number(item.reserved||0)} {item.unit}</option>)}</select></Field><Field label={`Cantidad ${lot?`(${lot.unit})`:""} *`} error={errors.qty}><input type="number" min="0.01" step="0.01" value={form.qty} onChange={event=>update("qty",event.target.value)} className="input-agro"/></Field><Field label="Precio unitario *" error={errors.unitPrice}><input type="number" min="0.01" step="0.01" value={form.unitPrice} onChange={event=>update("unitPrice",event.target.value)} className="input-agro"/></Field><Field label="Fecha de entrega *" error={errors.deliveryDate}><input type="date" value={toInputDate(form.deliveryDate)} onChange={event=>update("deliveryDate",toDisplayDate(event.target.value))} className="input-agro"/></Field><Field label="Condición de pago"><select value={form.paymentTerms} onChange={event=>update("paymentTerms",event.target.value)} className="input-agro">{["Contado","Crédito a 7 días","Crédito a 15 días","Crédito a 30 días"].map(value=><option key={value}>{value}</option>)}</select></Field></section>{lot&&<p className="rounded-lg bg-blue-50 p-3 text-[10px] text-blue-800">Disponible para vender: <b>{available} {lot.unit}</b>. La reserva se aplicará cuando confirmes el pedido.</p>}<Field label="Observaciones"><textarea rows="2" value={form.notes} onChange={event=>update("notes",event.target.value)} className="resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none"/></Field><div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit"><Save className="size-4"/>Guardar pedido</Button></div></form></Modal>}

function DeliveriesPage(){
  const {state,dispatch}=useDemo();
  const [editing,setEditing]=useState(null);
  const deliveries=[...(state.deliveries||[])].sort((a,b)=>numberOf(b.id)-numberOf(a.id));
  const latest=deliveries[0],history=deliveries.slice(1);
  return <><PageHeader title="Despachos" description="Confirma la salida del lote reservado y registra quién realizó y recibió la entrega."/>
    <section className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4"><h2 className="text-xs font-bold text-blue-900">Conexión con Ventas e Inventario</h2><p className="mt-1 text-[10px] text-blue-800">Cada pedido confirmado genera un despacho. Al completarlo se descuenta el lote y queda registrado el cliente de destino.</p></section>
    {latest&&<section className="mb-5 rounded-xl border border-slate-200 bg-white"><header className="flex justify-between border-b border-slate-200 p-5"><div><small className="text-[9px] text-slate-400">{latest.id} · desde {latest.salesOrderId}</small><h2 className="text-lg font-bold">{latest.product}</h2><p className="text-xs text-slate-500">{latest.customer}</p></div><Badge>{latest.status}</Badge></header><div className="grid gap-3 p-5 sm:grid-cols-4"><Fact label="Cantidad" value={`${latest.qty} ${latest.unit}`}/><Fact label="Lote" value={latest.lotId}/><Fact label="Destino" value={latest.destination}/><Fact label="Fecha prevista" value={latest.deliveryDate}/></div><footer className="flex justify-end border-t border-slate-200 p-4">{latest.status==="Pendiente"?<Button onClick={()=>setEditing(latest)}><Truck className="size-4"/>Registrar despacho</Button>:<Button variant="secondary" onClick={()=>setEditing(latest)}>Ver comprobante</Button>}</footer></section>}
    <History title="Historial de despachos" rows={history.map(item=>[item.id,item.salesOrderId,item.customer,item.lotId,`${item.qty} ${item.unit}`,item.status])} columns={["Despacho","Pedido","Cliente","Lote","Cantidad","Estado"]}/>{editing&&<DeliveryModal initial={editing} onClose={()=>setEditing(null)} onSave={value=>{dispatch({type:"COMPLETE_DELIVERY",value});setEditing(null)}}/>}
  </>;
}

function DeliveryModal({initial,onClose,onSave}){
  const [form,setForm]=useState(initial);
  const update=(field,value)=>setForm(current=>({...current,[field]:value}));
  const completed=form.status==="Entregado";
  function submit(event){event.preventDefault();onSave({...form,status:"Entregado",deliveredAt:new Date().toLocaleString("es-PE")})}
  return <Modal title={`${completed?"Comprobante":"Registrar"} despacho · ${form.id}`} onClose={onClose}>
    <form onSubmit={submit} className="grid gap-4 p-5">
      <section className="rounded-xl bg-blue-50 p-4"><h3 className="text-sm font-bold">{form.product}</h3><p className="mt-1 text-[10px] text-slate-600">{form.qty} {form.unit} · Lote {form.lotId} → {form.customer}</p></section>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Transportista"><input required disabled={completed} value={form.carrier} onChange={event=>update("carrier",event.target.value)} className="input-agro"/></Field>
        <Field label="Vehículo / placa"><input required disabled={completed} value={form.vehicle} onChange={event=>update("vehicle",event.target.value)} className="input-agro"/></Field>
        <Field label="Guía de remisión"><input required disabled={completed} value={form.guideNumber} onChange={event=>update("guideNumber",event.target.value)} className="input-agro"/></Field>
        <Field label="Recibido por"><input required disabled={completed} value={form.receivedBy} onChange={event=>update("receivedBy",event.target.value)} className="input-agro"/></Field>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={onClose}>{completed?"Cerrar":"Cancelar"}</Button>{!completed&&<Button type="submit"><PackageCheck className="size-4"/>Confirmar entrega</Button>}</div>
    </form>
  </Modal>;
}

function History({title,columns,rows}){return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><header className="border-b border-slate-200 p-4"><h2 className="text-sm font-bold">{title}</h2><p className="text-[10px] text-slate-500">{rows.length} registros anteriores</p></header><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-slate-50 text-[9px] uppercase text-slate-500"><tr>{columns.map(column=><th className="px-4 py-3" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr className="border-t border-slate-100" key={index}>{row.map((value,position)=><td className="px-4 py-3" key={position}>{position===row.length-1?<Badge>{value}</Badge>:value}</td>)}</tr>)}</tbody></table></div></section>}
function Field({label,error,children}){return <label className="grid gap-1.5 text-xs font-medium text-slate-700"><span>{label}</span>{children}{error&&<small className="text-red-600">{error}</small>}</label>}
function Fact({label,value}){return <div className="rounded-lg bg-slate-50 p-3"><small className="text-[9px] text-slate-400">{label}</small><b className="mt-1 block text-xs">{value}</b></div>}
function numberOf(id=""){return Number(id.split("-").at(-1))||0}
function money(value,currency){return new Intl.NumberFormat("es-PE",{style:"currency",currency:currency||"PEN"}).format(value||0)}
function toInputDate(value=""){const [day,month,year]=value.split("/");return year?`${year}-${month}-${day}`:value}
function toDisplayDate(value=""){const [year,month,day]=value.split("-");return day?`${day}/${month}/${year}`:value}
