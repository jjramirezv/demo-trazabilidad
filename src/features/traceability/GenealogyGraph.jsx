import { ArrowDown, AlertTriangle, Factory, Package, ShoppingCart, Truck, Users, Warehouse } from "lucide-react";

const flows = {
  distributor: {
    inputs: [["PT-PROV-026", "Producto recibido"], ["REC-2026-014", "Control de ingreso"]],
    operation: ["ALM-2026-014", "Ingreso al almacén", Warehouse],
    output: ["LOT-DIST-2026-014", "Lote disponible: 460 kg", Package],
    destination: ["PV-2026-018", "Pedido a Mercado Mayorista", Truck],
  },
  manufacturer: {
    inputs: [["PAP-2026-001", "Papa Yungay"], ["ACE-2026-001", "Aceite vegetal"], ["SAL-2026-001", "Sal"], ["BOL-2026-001", "Bolsas"]],
    operation: ["OF-CHIPS-001", "Orden de transformación", Factory],
    output: ["CHIP-2026-001", "970 bolsas producidas", Package],
    destination: ["Supermercado Valle Central", "300 bolsas entregadas", Users],
  },
  bulk: {
    inputs: [["MAN-2026-004", "Mango de Chanchamayo"], ["AZU-2026-008", "Azúcar"], ["BOT-2026-001", "Botellas"], ["TAP-2026-001", "Tapas"]],
    operation: ["OF-PREP-001", "Preparación en tanque TQ-01", Factory],
    output: ["BASE-MANGO-2026-001", "Jugo base aprobado: 985 L", Package],
    destination: ["OF-ENV-001", "1,940 botellas de 500 ml", ShoppingCart],
  },
};

export function GenealogyGraph({ incident = false, model = "manufacturer" }) {
  const flow = flows[model] ?? flows.manufacturer;
  return (
    <div className="flex flex-col items-center text-[10px]">
      <div className="grid w-full grid-cols-2 gap-2">
        {flow.inputs.map(([id, name]) => {
          const affected = incident && id === "ACE-2026-001";
          return <div className={`rounded-lg border p-2 ${affected ? "border-red-300 bg-red-50" : "border-emerald-200 bg-emerald-50"}`} key={id}>
            <b className={affected ? "text-red-700" : "text-emerald-700"}>{affected && <AlertTriangle className="mr-1 inline size-3" />}{id}</b>
            <span className="block text-slate-500">{name}</span>
          </div>;
        })}
      </div>
      <ArrowDown className="my-2 size-4 text-slate-400" />
      <Node icon={flow.operation[2]} title={flow.operation[0]} text={flow.operation[1]} blue />
      <ArrowDown className="my-2 size-4 text-slate-400" />
      <Node icon={flow.output[2]} title={flow.output[0]} text={flow.output[1]} />
      <ArrowDown className="my-2 size-4 text-slate-400" />
      <Node icon={flow.destination[2]} title={flow.destination[0]} text={flow.destination[1]} />
    </div>
  );
}

function Node({ icon: Icon, title, text, blue }) {
  return <div className={`flex w-64 max-w-full items-center gap-3 rounded-lg border p-3 ${blue ? "border-blue-300 bg-blue-50" : "border-emerald-200 bg-white"}`}>
    <Icon className={`size-5 shrink-0 ${blue ? "text-blue-600" : "text-emerald-600"}`} />
    <span><b className="block">{title}</b><small className="text-slate-500">{text}</small></span>
  </div>;
}
