export function Badge({children}) {
 const text=String(children);
 const tone=/Bloqueado|Incidente|Rechaz/.test(text)?"bg-red-50 text-red-700 ring-red-200":/Próximo|Pendiente|Preparado|Calidad/.test(text)?"bg-amber-50 text-amber-700 ring-amber-200":/Terminado|Entregado|Activo|Aprobado|Disponible|Confirmado/.test(text)?"bg-emerald-50 text-emerald-700 ring-emerald-200":"bg-blue-50 text-blue-700 ring-blue-200";
 return <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${tone}`}>{children}</span>;
}
