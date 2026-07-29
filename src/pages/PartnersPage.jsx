import { useMemo, useState } from "react";
import { CalendarDays, CreditCard, Mail, MapPin, Package, Phone, Save, UserRound } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { DataTable } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

const emptySupplier = {
  name: "", tax: "", type: "Productor agrícola", location: "",
  products: "", registeredAt: new Date().toLocaleDateString("es-PE"),
  status: "Activo",
};
const emptyCustomer = {
  name: "", tax: "", type: "Tienda minorista", location: "", contact: "",
  phone: "", email: "", channel: "Venta directa", paymentTerms: "Contado",
  registeredAt: new Date().toLocaleDateString("es-PE"), status: "Activo", orders: 0,
};

export function PartnersPage({ route }) {
  const { state, dispatch } = useDemo();
  const suppliers = route === "suppliers";
  const list = suppliers ? state.suppliers : state.customers;
  const [editing, setEditing] = useState(null);
  const rows = useMemo(() => list.map(item => suppliers
    ? [item.id, item.name, item.type, item.location, item.products, item.registeredAt || "—", item.status]
    : [item.id, item.name, item.type, item.contact || "—", item.phone || "—", item.location, item.orders, item.status]), [list, suppliers]);

  function savePartner(values) {
    const collection = suppliers ? "suppliers" : "customers";
    if (values.id) {
      dispatch({ type: "UPDATE", collection, value: values });
    } else {
      const sequence = Math.max(0, ...list.map(item => Number(item.id.split("-")[1]) || 0)) + 1;
      dispatch({
        type: "ADD",
        collection,
        value: { ...values, id: `${suppliers ? "SUP" : "CUS"}-${String(sequence).padStart(3, "0")}`, orders: 0 },
      });
    }
    setEditing(null);
  }

  return <>
    <PageHeader
      title={suppliers ? "Proveedores" : "Clientes"}
      description={suppliers ? "Empresas y productores que suministran ingredientes, materias primas o envases." : "Destinatarios de pedidos, entregas y lotes."}
      action={suppliers ? "Nuevo proveedor" : "Nuevo cliente"}
      onAction={() => setEditing(suppliers ? emptySupplier : emptyCustomer)}
    />
    <DataTable
      columns={suppliers ? ["Código", "Nombre", "Tipo", "Ubicación", "Productos", "Registro", "Estado"] : ["Código", "Nombre", "Tipo", "Contacto", "Teléfono", "Ubicación", "Pedidos", "Estado"]}
      rows={rows}
      onRow={index => setEditing(list[index])}
    />
    {editing && <PartnerModal
      supplier={suppliers}
      initial={editing}
      onClose={() => setEditing(null)}
      onSave={savePartner}
    />}
  </>;
}

function PartnerModal({ supplier, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const inputClass = "h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

  function submit(event) {
    event.preventDefault();
    const required = supplier
      ? ["name", "type", "location", "products", "registeredAt", "status"]
      : ["name", "type", "location", "contact", "phone", "channel", "paymentTerms", "registeredAt", "status"];
    const nextErrors = Object.fromEntries(required.filter(field => !String(form[field] || "").trim()).map(field => [field, "Completa este campo"]));
    if (form.tax && !/^\d{11}$/.test(form.tax)) nextErrors.tax = "El RUC debe tener 11 dígitos";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Ingresa un correo válido";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSave(form);
  }

  return <Modal title={`${form.id ? "Editar" : "Registrar"} ${supplier ? "proveedor" : "cliente"}`} onClose={onClose}>
    <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
      <FormField label="Nombre o razón social *" field="name" icon={UserRound} full form={form} update={update} errors={errors} inputClass={inputClass} />
      <FormField label="RUC" field="tax" form={form} update={update} errors={errors} inputClass={inputClass}><input inputMode="numeric" maxLength={11} value={form.tax || ""} onChange={event => update("tax", event.target.value.replace(/\D/g, ""))} className={inputClass} placeholder="11 dígitos" /></FormField>
      <FormField label={`${supplier ? "Tipo de proveedor" : "Tipo de cliente"} *`} field="type" form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.type} onChange={event => update("type", event.target.value)} className={inputClass}>
          {(supplier
            ? ["Productor agrícola", "Distribuidor", "Proveedor de insumos", "Proveedor de envases", "Transportista", "Servicio especializado"]
            : ["Tienda minorista", "Mayorista", "Supermercado", "Restaurante", "Distribuidor", "Institución"]).map(type => <option key={type}>{type}</option>)}
        </select>
      </FormField>
      {!supplier && <FormField label="Persona de contacto *" field="contact" icon={UserRound} form={form} update={update} errors={errors} inputClass={inputClass} />}
      {!supplier && <FormField label="Teléfono *" field="phone" icon={Phone} form={form} update={update} errors={errors} inputClass={inputClass} />}
      {!supplier && <FormField label="Correo electrónico" field="email" icon={Mail} full form={form} update={update} errors={errors} inputClass={inputClass} />}
      <FormField label={supplier ? "Ubicación *" : "Dirección de entrega *"} field="location" icon={MapPin} full form={form} update={update} errors={errors} inputClass={inputClass} />
      {supplier && <FormField label="Productos que suministra *" field="products" icon={Package} full form={form} update={update} errors={errors} inputClass={inputClass} />}
      {!supplier && <FormField label="Canal de venta *" field="channel" form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.channel} onChange={event => update("channel", event.target.value)} className={inputClass}>
          {["Venta directa", "Mayorista", "Distribuidor", "Tienda", "Institucional"].map(channel => <option key={channel}>{channel}</option>)}
        </select>
      </FormField>}
      {!supplier && <FormField label="Condición de pago *" field="paymentTerms" icon={CreditCard} form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.paymentTerms} onChange={event => update("paymentTerms", event.target.value)} className={`${inputClass} pl-9`}>
          {["Contado", "Crédito a 7 días", "Crédito a 15 días", "Crédito a 30 días"].map(term => <option key={term}>{term}</option>)}
        </select>
      </FormField>}
      <FormField label="Fecha de registro *" field="registeredAt" icon={CalendarDays} form={form} update={update} errors={errors} inputClass={inputClass}><input type="date" value={toInputDate(form.registeredAt)} onChange={event => update("registeredAt", toDisplayDate(event.target.value))} className={`${inputClass} pl-9`} /></FormField>
      <FormField label="Estado *" field="status" form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.status} onChange={event => update("status", event.target.value)} className={inputClass}>
          {["Activo", "En evaluación", "Suspendido", "Inactivo"].map(status => <option key={status}>{status}</option>)}
        </select>
      </FormField>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:col-span-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit"><Save className="size-4" />{form.id ? "Guardar cambios" : `Registrar ${supplier ? "proveedor" : "cliente"}`}</Button>
      </div>
    </form>
  </Modal>;
}

function FormField({ label, field, icon: Icon, children, full = false, form, update, errors, inputClass }) {
  return <label className={`grid gap-1.5 text-xs font-medium text-slate-700 ${full ? "sm:col-span-2" : ""}`}>
    <span>{label}</span>
    <span className="relative grid">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />}
      {children || <input value={form[field] || ""} onChange={event => update(field, event.target.value)} className={`${inputClass} ${Icon ? "pl-9" : ""}`} />}
    </span>
    {errors[field] && <small className="text-red-600">{errors[field]}</small>}
  </label>;
}

function toInputDate(value = "") {
  const [day, month, year] = value.split("/");
  return year ? `${year}-${month}-${day}` : value;
}

function toDisplayDate(value = "") {
  const [year, month, day] = value.split("-");
  return day ? `${day}/${month}/${year}` : value;
}
