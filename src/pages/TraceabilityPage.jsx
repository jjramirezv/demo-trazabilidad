import { useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Building2, Factory, Package, Search, ShoppingCart, Truck } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";

const traceMap={
  "PAP-2026-001":{
    backward:[
      {type:"Proveedor",title:"Asociación de Productores de Papa del Mantaro",detail:"Sapallanga, Huancayo",icon:Building2},
      {type:"Compra",title:"OC-2026-001",detail:"500 kg de Papa Yungay",icon:ShoppingCart},
      {type:"Recepción",title:"REC-2026-001",detail:"480 kg aprobados por calidad",icon:Truck},
    ],
    process:[{type:"Lote consultado",title:"PAP-2026-001",detail:"Papa Yungay · Frescos A-01",icon:Package}],
    forward:[
      {type:"Producción",title:"OF-CHIPS-001",detail:"Consumo de 120 kg",icon:Factory},
      {type:"Lote obtenido",title:"CHIP-2026-001",detail:"970 bolsas de chips",icon:Package},
      {type:"Cliente",title:"Supermercado Valle Central",detail:"300 bolsas entregadas",icon:Building2},
    ],
  },
  "ACE-2026-001":{
    backward:[
      {type:"Proveedor",title:"Distribuidora de Aceites Andinos",detail:"El Tambo, Huancayo",icon:Building2},
      {type:"Compra",title:"OC-2026-002",detail:"200 L de aceite vegetal",icon:ShoppingCart},
      {type:"Recepción",title:"REC-2026-002",detail:"Lote aprobado inicialmente",icon:Truck},
    ],
    process:[{type:"Lote consultado",title:"ACE-2026-001",detail:"Aceite vegetal · Insumos I-02",icon:Package}],
    forward:[
      {type:"Producción",title:"OF-CHIPS-001",detail:"Consumo de 18 L",icon:Factory},
      {type:"Lote relacionado",title:"CHIP-2026-001",detail:"970 bolsas producidas",icon:Package},
      {type:"Destino",title:"Supermercado Valle Central",detail:"300 bolsas entregadas",icon:Building2},
    ],
  },
  "CHIP-2026-001":{
    backward:[
      {type:"Materias primas",title:"PAP-2026-001 · ACE-2026-001",detail:"Papa Yungay y aceite vegetal",icon:Package},
      {type:"Insumos",title:"SAL-2026-001 · BOL-2026-001",detail:"Sal y bolsas metalizadas",icon:Package},
      {type:"Producción",title:"OF-CHIPS-001",detail:"Orden que generó el lote",icon:Factory},
    ],
    process:[{type:"Lote consultado",title:"CHIP-2026-001",detail:"970 bolsas producidas · 670 disponibles",icon:Package}],
    forward:[
      {type:"Pedido",title:"PV-2026-021",detail:"300 bolsas reservadas",icon:ShoppingCart},
      {type:"Entrega",title:"ENT-2026-021",detail:"Salida desde Terminados PT-01",icon:Truck},
      {type:"Cliente",title:"Supermercado Valle Central",detail:"Entrega completada",icon:Building2},
    ],
  },
  "BASE-MANGO-2026-001":{
    backward:[
      {type:"Proveedor",title:"Frutas Andinas del Perú",detail:"Mango de Chanchamayo",icon:Building2},
      {type:"Ingredientes",title:"MAN-2026-004 · AZU-2026-008",detail:"Mango, agua tratada y azúcar",icon:Package},
      {type:"Preparación",title:"OF-PREP-001",detail:"Preparación en tanque TQ-01",icon:Factory},
    ],
    process:[{type:"Producto en proceso",title:"BASE-MANGO-2026-001",detail:"Jugo base aprobado · 985 L",icon:Package}],
    forward:[
      {type:"Envasado",title:"OF-ENV-001",detail:"Consumo de 970 L",icon:Factory},
      {type:"Producto terminado",title:"JM500-2026-001",detail:"1,940 botellas de 500 ml",icon:Package},
      {type:"Pedido",title:"PV-2026-024",detail:"480 botellas para Distribuidora Junín",icon:ShoppingCart},
    ],
  },
  "JM500-2026-001":{
    backward:[
      {type:"Producto base",title:"BASE-MANGO-2026-001",detail:"970 L de jugo base",icon:Package},
      {type:"Materiales",title:"BOT-2026-001 · TAP-2026-001",detail:"Botellas, tapas y etiquetas",icon:Package},
      {type:"Envasado",title:"OF-ENV-001",detail:"Orden de envasado",icon:Factory},
    ],
    process:[{type:"Lote consultado",title:"JM500-2026-001",detail:"Jugo de mango 500 ml",icon:Package}],
    forward:[
      {type:"Pedido",title:"PV-2026-024",detail:"480 botellas",icon:ShoppingCart},
      {type:"Despacho",title:"DES-2026-024",detail:"Preparado para salida",icon:Truck},
      {type:"Cliente",title:"Distribuidora Junín",detail:"Concepción, Junín",icon:Building2},
    ],
  },
};

export function TraceabilityPage(){
  const {state}=useDemo();
  const [lotId,setLotId]=useState(state.lots?.[0]?.id||"");
  const [view,setView]=useState("full");
  const [selectedNode,setSelectedNode]=useState(null);
  const lot=state.lots.find(item=>item.id===lotId);
  const trace=useMemo(()=>withSales(traceMap[lotId]||genericTrace(lot,state),lotId,state),[lotId,lot,state]);

  return <><PageHeader title="Trazabilidad de lotes" description="Consulta de dónde vino un lote, qué operaciones lo transformaron y a quién se entregó."/>
    <section className="mb-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-end">
      <label className="grid flex-1 gap-1.5 text-xs font-medium">Selecciona el producto y lote<span className="relative grid"><Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400"/><select value={lotId} onChange={event=>{setLotId(event.target.value);setSelectedNode(null)}} className="h-11 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-blue-500">{state.lots.map(item=><option value={item.id} key={item.id}>{item.product} · {item.id}</option>)}</select></span></label>
      <div><span className="mb-1.5 block text-[10px] font-medium text-slate-500">¿Qué necesitas consultar?</span><div className="flex gap-2 overflow-x-auto">{[["backward","De dónde vino",ArrowLeft],["full","Ver todo el recorrido",ArrowDown],["forward","A dónde fue",ArrowRight]].map(([id,label,Icon])=><button onClick={()=>{setView(id);setSelectedNode(null)}} className={`inline-flex h-11 whitespace-nowrap items-center gap-2 rounded-lg px-3 text-xs font-semibold ${view===id?"bg-blue-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`} key={id}><Icon className="size-4"/>{label}</button>)}</div></div>
    </section>
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 border-b border-slate-100 pb-4"><h2 className="text-lg font-bold">{view==="backward"?"Origen del lote":view==="forward"?"Destino e impacto":"Historia completa del lote"}</h2><p className="mt-1 text-xs text-slate-500">{view==="backward"?"Partimos del lote seleccionado y retrocedemos hasta su proveedor.":view==="forward"?"Partimos del lote seleccionado y seguimos todos sus usos y entregas.":"Lectura cronológica desde el proveedor hasta el último cliente registrado."}</p></div>
        <TraceFlow trace={trace} view={view} selectedNode={selectedNode} onSelect={setSelectedNode}/>
      </section>
      <aside className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold">{selectedNode?"Detalle del punto":"Resumen del lote"}</h2>{selectedNode?<div className="mt-4 grid gap-3"><div className="rounded-xl border border-blue-200 bg-blue-50 p-4"><small className="text-[9px] font-bold uppercase text-blue-600">{selectedNode.type}</small><h3 className="mt-1 text-sm font-bold">{selectedNode.title}</h3><p className="mt-2 text-[10px] leading-4 text-slate-600">{selectedNode.detail}</p></div><button onClick={()=>setSelectedNode(null)} className="text-left text-[10px] font-semibold text-blue-600">← Volver al resumen</button></div>:<div className="mt-4 grid gap-2"><Info label="Lote consultado" value={lotId}/><Info label="Producto" value={lot?.product||"Sin información"}/><Info label="Ubicación actual" value={lot?.location||"Sin ubicación"}/><Info label="Estado" value={lot?.status||"Sin estado"}/><Info label="Relaciones encontradas" value={`${trace.backward.length+trace.process.length+trace.forward.length} registros`}/></div>}<div className="mt-4"><Badge>{view==="backward"?"Trazabilidad hacia atrás":view==="forward"?"Trazabilidad hacia adelante":"Vista integral"}</Badge></div></aside>
    </div>
  </>;
}

function TraceFlow({trace,view,selectedNode,onSelect}){
  const nodes=view==="backward"
    ? [...trace.process,...[...trace.backward].reverse()]
    : view==="forward"
      ? [...trace.process,...trace.forward]
      : [...trace.backward,...trace.process,...trace.forward];
  return <div className="mx-auto max-w-3xl">{nodes.map((node,index)=><div className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-3" key={`${node.title}-${index}`}>
    <div className="flex flex-col items-center"><span className={`z-[1] grid size-9 place-items-center rounded-full border-4 border-white text-xs font-bold shadow-sm ${stageColor(node,selectedNode===node)}`}>{index+1}</span>{index<nodes.length-1&&<span className="min-h-8 w-0.5 flex-1 bg-slate-200"/>}</div>
    <div className={index<nodes.length-1?"pb-4":"pb-0"}><TraceNode node={node} active={selectedNode===node} onSelect={onSelect}/>{index<nodes.length-1&&<p className="ml-3 mt-2 text-[9px] font-medium text-slate-400">{connectionText(view,index,nodes)}</p>}</div>
  </div>)}</div>
}
function TraceNode({node,active,onSelect}){const Icon=node.icon;return <button type="button" onClick={()=>onSelect(node)} className={`flex min-h-20 w-full items-center gap-4 rounded-xl border p-4 text-left transition hover:border-blue-400 hover:shadow-sm ${active?"border-blue-500 bg-blue-50 ring-2 ring-blue-100":"border-slate-200 bg-white"}`}><span className={`grid size-10 shrink-0 place-items-center rounded-lg ${active?"bg-blue-600 text-white":"bg-slate-100 text-blue-600"}`}><Icon className="size-5"/></span><div className="min-w-0 flex-1"><small className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{node.type}</small><h4 className="mt-0.5 text-sm font-bold text-slate-900">{node.title}</h4><p className="mt-1 text-[10px] leading-4 text-slate-500">{node.detail}</p></div><span className="hidden text-[9px] font-semibold text-blue-600 sm:block">Ver detalle</span></button>}
function stageColor(node,active){if(active)return"bg-blue-600 text-white";if(["Proveedor","Compra","Recepción","Materias primas","Ingredientes","Insumos","Producto base","Materiales"].includes(node.type))return"bg-emerald-500 text-white";if(["Cliente","Destino","Pedido","Entrega","Despacho"].includes(node.type))return"bg-soil-500 text-white";return"bg-blue-500 text-white"}
function connectionText(view,index,nodes){if(view==="backward")return index===0?"Este lote proviene de":"Relacionado con el registro anterior";if(view==="forward")return index===0?"Este lote se utilizó en":"Continuó hacia";return index<nodes.length-1?"Continuó hacia":""}
function Info({label,value}){return <div className="rounded-lg bg-slate-50 p-3"><small className="block text-[9px] text-slate-400">{label}</small><b className="mt-1 block text-xs">{value}</b></div>}
function genericTrace(lot,state){
  const packaging=(state.packagingOrders||[]).find(order=>order.id===lot?.origin);
  const production=(state.productionOrders||[]).find(order=>order.id===lot?.origin);
  if(packaging)return {backward:[{type:"Lote base",title:packaging.sourceLotId,detail:`Creado por ${packaging.productionOrderId}`,icon:Package},{type:"Envasado",title:packaging.id,detail:`Consumió materiales y generó ${lot.id}`,icon:Factory}],process:[{type:"Lote consultado",title:lot.id,detail:`${lot.product} · ${lot.qty} ${lot.unit}`,icon:Package}],forward:[]};
  if(production){const next=(state.packagingOrders||[]).find(order=>order.sourceLotId===lot.id);return {backward:production.components.map(component=>({type:"Componente",title:component.lotId||component.product,detail:`${component.qty} ${component.unit} de ${component.product}`,icon:Package})),process:[{type:"Orden de producción",title:production.id,detail:`Generó ${lot.id}`,icon:Factory},{type:"Lote consultado",title:lot.id,detail:`${lot.product} · ${lot.qty} ${lot.unit}`,icon:Package}],forward:next?[{type:"Orden de envasado",title:next.id,detail:`Usa este lote para producir ${next.product}`,icon:Factory}]:[]}}
  return {backward:[{type:"Documento de origen",title:lot?.origin||"No registrado",detail:"Registro que creó el lote",icon:Truck}],process:[{type:"Lote consultado",title:lot?.id||"Sin lote",detail:lot?.product||"Sin producto",icon:Package}],forward:[]};
}
function withSales(trace,lotId,state){
  const orders=(state.salesOrders||[]).filter(order=>order.lotId===lotId&&order.status!=="Borrador");
  if(!orders.length)return trace;
  const extra=orders.flatMap(order=>{const delivery=(state.deliveries||[]).find(item=>item.salesOrderId===order.id);return [{type:"Pedido",title:order.id,detail:`${order.qty} ${order.unit} para ${order.customer}`,icon:ShoppingCart},...(delivery?[{type:"Despacho",title:delivery.id,detail:`${delivery.status} · ${delivery.destination}`,icon:Truck},{type:"Cliente",title:order.customer,detail:delivery.destination,icon:Building2}]:[])]});
  const known=new Set(trace.forward.map(node=>node.title));
  return {...trace,forward:[...trace.forward,...extra.filter(node=>!known.has(node.title))]};
}
