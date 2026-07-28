import { ArrowDownToLine, ArrowUpFromLine, Plus } from "lucide-react";
import { formatDate, formatKg } from "../data";

export function MovementsPage({ product, movements, onAdd }) {
  return <div className="guided-page"><div className="guided-heading"><div><h1>Movimientos de {product.name.toLowerCase()}</h1><p>Entradas y salidas vinculadas al lote y a sus documentos.</p></div><button className="guided-primary" onClick={onAdd}><Plus /> Registrar movimiento</button></div>
    <div className="movement-list"><header><span>Fecha</span><span>Tipo</span><span>Documento</span><span>Producto</span><span>Cantidad</span><span>Estado</span></header>{movements.map(movement => <article key={movement.id}><span>{formatDate(movement.date)}</span><span className="movement-type">{movement.type === "Ingreso" ? <ArrowDownToLine /> : <ArrowUpFromLine />}{movement.type}</span><strong>{movement.document}</strong><span>{movement.product}</span><strong>{formatKg(movement.quantity)}</strong><em>{movement.status}</em></article>)}</div>
  </div>;
}
