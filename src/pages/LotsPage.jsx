import { useState } from "react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { DataTable } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
export function LotsPage({onNavigate}){const {state}=useDemo(),[selected,setSelected]=useState(null);const rows=state.lots.map(l=>[l.id,l.product,l.type,`${l.qty} ${l.unit}`,l.location,l.expiry,l.status]);return <><PageHeader title="Lotes" description="Origen, existencia, ubicación, vencimiento y estado sanitario de cada lote."/><DataTable columns={["Lote","Producto","Tipo","Cantidad","Ubicación","Vencimiento","Estado"]} rows={rows} onRow={i=>setSelected(state.lots[i])}/>{selected&&<Modal title={selected.id} onClose={()=>setSelected(null)}><div className="grid gap-3 p-5 sm:grid-cols-2">{Object.entries({Producto:selected.product,Tipo:selected.type,Cantidad:`${selected.qty} ${selected.unit}`,Ubicación:selected.location,Vencimiento:selected.expiry,Origen:selected.origin}).map(([a,b])=><div className="rounded-lg bg-slate-50 p-3" key={a}><small className="text-[9px] text-slate-400">{a}</small><b className="block text-xs">{b}</b></div>)}</div><div className="flex justify-between border-t border-slate-200 p-4"><Badge>{selected.status}</Badge><Button onClick={()=>onNavigate("traceability")}>Abrir trazabilidad</Button></div></Modal>}</>}
