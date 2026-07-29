import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Boxes, CalendarClock, MapPin, PackageCheck, Search, Warehouse } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

const tabs=[
  ["lots","Stock por lote"],
  ["locations","Por ubicación"],
  ["expiring","Próximos a vencer"],
  ["blocked","Bloqueados"],
];
const locations=["Frescos A-01","Insumos I-02","Envases E-01","Producción P-01","Tanque TQ-01","Terminados PT-01","Terminados PT-02","Cuarentena C-01"];

export function InventoryPage(){
  const {state,dispatch}=useDemo();
  const [tab,setTab]=useState("lots");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const [transfer,setTransfer]=useState(null);
  const lots=state.lots||[];

  const visible=useMemo(()=>lots.filter(lot=>{
    const matches=`${lot.product} ${lot.id} ${lot.location} ${lot.status}`.toLowerCase().includes(query.toLowerCase());
    if(!matches)return false;
    if(tab==="expiring")return daysUntil(lot.expiry)<=45;
    if(tab==="blocked")return ["Bloqueado","Cuarentena"].includes(lot.status);
    return true;
  }).sort((a,b)=>tab==="locations"?a.location.localeCompare(b.location):0),[lots,query,tab]);

  const blocked=lots.filter(lot=>["Bloqueado","Cuarentena"].includes(lot.status)).length;
  const expiring=lots.filter(lot=>daysUntil(lot.expiry)<=45).length;
  const locationCount=new Set(lots.map(lot=>lot.location)).size;

  function completeTransfer(values){
    dispatch({type:"TRANSFER_LOT",value:{
      id:`MOV-${Date.now()}`,lotId:values.id,product:values.product,origin:values.location,
      destination:values.destination,qty:values.qty,unit:values.unit,
      date:new Date().toLocaleString("es-PE"),reason:values.reason,
    }});
    setTransfer(null);
    setSelected(null);
  }

  return <>
    <PageHeader title="Inventario" description="Consulta dónde está cada lote, revisa alertas y selecciona una fila para realizar acciones."/>
    <section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={Boxes} label="Lotes registrados" value={lots.length} detail="con trazabilidad activa"/>
      <Metric icon={Warehouse} label="Ubicaciones ocupadas" value={locationCount} detail="almacenes y zonas"/>
      <Metric icon={CalendarClock} label="Por vencer" value={expiring} detail="en los próximos 45 días" warning={expiring>0}/>
      <Metric icon={AlertTriangle} label="Bloqueados" value={blocked} detail="sin disponibilidad" danger={blocked>0}/>
    </section>
    <section className="mb-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
      <PackageCheck className="mt-0.5 size-5 shrink-0 text-blue-600"/>
      <div><h2 className="text-xs font-bold text-blue-900">Uso rápido</h2><p className="mt-1 text-[10px] leading-4 text-blue-800">Busca el lote y selecciona su fila. Desde el detalle podrás moverlo usando destinos recomendados por el sistema. No necesitas memorizar almacenes ni códigos.</p></div>
    </section>
    <div className="mb-4 flex gap-2 overflow-x-auto">{tabs.map(([id,label])=><button onClick={()=>setTab(id)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${tab===id?"bg-blue-600 text-white":"bg-white text-slate-600 hover:bg-slate-50"}`} key={id}>{label}</button>)}</div>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 px-3"><Search className="size-4 text-slate-400"/><input value={query} onChange={event=>setQuery(event.target.value)} className="w-full border-0 text-xs outline-none" placeholder="Buscar producto, lote, ubicación o estado…"/></label>
        <span className="text-[10px] text-slate-500">{visible.length} de {lots.length} lotes</span>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs">
        <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500"><tr>{["Producto","Lote","Ubicación","Disponible","Reservado","Vencimiento","Estado",""].map((column,index)=><th className="px-4 py-3 font-semibold" key={index}>{column}</th>)}</tr></thead>
        <tbody>{visible.map(lot=><tr onClick={()=>setSelected(lot)} className="cursor-pointer border-t border-slate-100 hover:bg-blue-50/40" key={lot.id}>
          <td className="px-4 py-3 font-medium">{lot.product}</td><td className="px-4 py-3">{lot.id}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-1"><MapPin className="size-3 text-slate-400"/>{lot.location}</span></td>
          <td className="px-4 py-3">{lot.qty} {lot.unit}</td><td className="px-4 py-3">{lot.reserved||0} {lot.reserved?lot.unit:""}</td><td className="px-4 py-3">{lot.expiry}</td><td className="px-4 py-3"><Badge>{lot.status}</Badge></td><td className="px-4 py-3"><ArrowRight className="size-4 text-slate-400"/></td>
        </tr>)}</tbody>
      </table></div>
      {!visible.length&&<div className="p-10 text-center"><Search className="mx-auto size-7 text-slate-300"/><h3 className="mt-2 text-sm font-bold">No se encontraron lotes</h3><p className="mt-1 text-[10px] text-slate-500">Cambia el filtro o prueba con otro término de búsqueda.</p></div>}
    </section>
    {selected&&<LotDetail lot={selected} movements={(state.inventoryMovements||[]).filter(item=>item.lotId===selected.id)} onClose={()=>setSelected(null)} onTransfer={()=>setTransfer({lot:selected})}/>}
    {transfer&&<TransferModal lot={transfer.lot} onClose={()=>setTransfer(null)} onSave={completeTransfer}/>}
  </>;
}

function Metric({icon:Icon,label,value,detail,warning,danger}){return <article className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className={`grid size-10 place-items-center rounded-lg ${danger?"bg-red-50 text-red-600":warning?"bg-amber-50 text-amber-600":"bg-emerald-50 text-emerald-600"}`}><Icon className="size-5"/></span><div><small className="text-[9px] text-slate-500">{label}</small><b className="block text-xl">{value}</b><span className="text-[9px] text-slate-400">{detail}</span></div></article>}

function LotDetail({lot,movements,onClose,onTransfer}){return <Modal title={`Lote ${lot.id}`} onClose={onClose}><div className="grid gap-4 p-5"><div><h3 className="text-lg font-bold">{lot.product}</h3><p className="text-xs text-slate-500">Origen: {lot.origin}</p></div><div className="grid gap-2 sm:grid-cols-2"><Info label="Existencia disponible" value={`${lot.qty} ${lot.unit}`}/><Info label="Ubicación actual" value={lot.location}/><Info label="Fecha de vencimiento" value={lot.expiry}/><Info label="Estado" value={lot.status}/></div><section className="rounded-lg border border-slate-200 p-3"><h4 className="text-xs font-bold">Últimos movimientos</h4>{movements.length?movements.slice(0,3).map(move=><p className="mt-2 text-[10px] text-slate-500" key={move.id}>{move.date} · {move.origin} → {move.destination}</p>):<p className="mt-2 text-[10px] text-slate-500">No hay movimientos registrados para este lote.</p>}</section><div className="flex justify-end"><Button onClick={onTransfer}>Cambiar ubicación</Button></div></div></Modal>}

function TransferModal({lot,onClose,onSave}){
  const [destination,setDestination]=useState("");
  const [reason,setReason]=useState("Movimiento operativo");
  const [error,setError]=useState("");
  const suggestions=recommendedLocations(lot).filter(location=>location!==lot.location);
  function submit(event){event.preventDefault();if(!destination)return setError("Elige dónde se ubicará el lote");onSave({...lot,destination,reason})}
  return <Modal title="Cambiar ubicación del lote" onClose={onClose}><form onSubmit={submit} className="grid gap-5 p-5">
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4"><small className="text-[9px] font-bold text-blue-600">{lot.id}</small><h3 className="mt-1 text-base font-bold text-blue-950">{lot.product}</h3><p className="mt-1 text-[10px] text-blue-800">Actualmente en <b>{lot.location}</b> · {lot.qty} {lot.unit}</p></section>
    <section><h3 className="text-xs font-bold">¿A dónde se moverá?</h3><p className="mt-1 text-[10px] text-slate-500">Mostramos solo ubicaciones adecuadas para este producto.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{suggestions.map(location=><button type="button" onClick={()=>{setDestination(location);setError("")}} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${destination===location?"border-blue-500 bg-blue-50 ring-2 ring-blue-100":"border-slate-200 hover:border-blue-300"}`} key={location}><span className={`grid size-8 place-items-center rounded-lg ${destination===location?"bg-blue-600 text-white":"bg-slate-100 text-slate-500"}`}><MapPin className="size-4"/></span><span><b className="block text-xs">{friendlyLocation(location)}</b><small className="text-[9px] text-slate-500">{location}</small></span></button>)}</div>{error&&<small className="mt-2 block text-red-600">{error}</small>}</section>
    <label className="grid gap-1.5 text-xs font-medium">Motivo<select value={reason} onChange={event=>setReason(event.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500">{["Movimiento operativo","Abastecer producción","Guardar producto terminado","Enviar a cuarentena","Reorganización de almacén"].map(option=><option key={option}>{option}</option>)}</select></label>
    <p className="rounded-lg bg-slate-50 p-3 text-[10px] leading-4 text-slate-600">Se actualizará únicamente la ubicación del lote completo. La cantidad no cambia.</p>
    <div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button type="submit">Confirmar ubicación</Button></div>
  </form></Modal>
}
function Info({label,value}){return <div className="rounded-lg bg-slate-50 p-3"><small className="block text-[9px] text-slate-400">{label}</small><b className="mt-1 block text-xs">{value}</b></div>}
function daysUntil(date){const [day,month,year]=String(date||"").split("/").map(Number);if(!year)return Infinity;return Math.ceil((new Date(year,month-1,day)-new Date())/86400000)}
function recommendedLocations(lot){if(lot.status==="Bloqueado"||lot.status==="Cuarentena")return ["Cuarentena C-01"];if(lot.type==="Producto terminado")return ["Terminados PT-01","Terminados PT-02","Cuarentena C-01"];if(lot.type==="Producto en proceso"||lot.location.includes("Tanque"))return ["Tanque TQ-01","Producción P-01","Cuarentena C-01"];if(lot.type==="Envase")return ["Envases E-01","Producción P-01","Cuarentena C-01"];return ["Frescos A-01","Insumos I-02","Producción P-01","Cuarentena C-01"]}
function friendlyLocation(location){return {"Frescos A-01":"Almacén de frescos","Insumos I-02":"Almacén de insumos","Envases E-01":"Almacén de envases","Producción P-01":"Zona de producción","Tanque TQ-01":"Tanque de proceso","Terminados PT-01":"Productos terminados 1","Terminados PT-02":"Productos terminados 2","Cuarentena C-01":"Zona de cuarentena"}[location]||location}
