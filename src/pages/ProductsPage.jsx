import { useState } from "react";
import { Boxes, CalendarDays, Package, Plus, Save, Scale, Trash2, Warehouse } from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

const emptyProduct = {
  name: "", category: "Materia prima", unit: "kg", tracking: "Por lote",
  lifeValue: "", lifeUnit: "días", stock: 0, minimumStock: 0, status: "Activo",
};

export function ProductsPage({ route }) {
  const { state, dispatch } = useDemo();
  const [editing, setEditing] = useState(null);

  if (route === "recipes") return <Recipes />;

  function saveProduct(values) {
    const normalized = {
      ...values,
      stock: Number(values.stock),
      minimumStock: Number(values.minimumStock),
      life: values.lifeValue ? `${values.lifeValue} ${values.lifeUnit}` : "No aplica",
    };
    if (values.id) {
      dispatch({ type: "UPDATE", collection: "products", value: normalized });
    } else {
      const prefix = categoryPrefix(values.category);
      const sequence = Math.max(0, ...state.products.filter(product => product.id.startsWith(prefix)).map(product => Number(product.id.split("-")[1]) || 0)) + 1;
      dispatch({ type: "ADD", collection: "products", value: { ...normalized, id: `${prefix}-${String(sequence).padStart(3, "0")}` } });
    }
    setEditing(null);
  }

  return <>
    <PageHeader
      title="Productos"
      description="Materias primas, ingredientes, envases, productos en proceso y productos terminados."
      action="Nuevo producto"
      onAction={() => setEditing(emptyProduct)}
    />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {state.products.map(product => <button type="button" onClick={() => setEditing(toEditableProduct(product))} className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md" key={product.id}>
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Package /></span>
          <div className="min-w-0 flex-1">
            <small className="text-[9px] font-bold text-slate-400">{product.id}</small>
            <h3 className="truncate text-sm font-bold">{product.name}</h3>
            <p className="text-[10px] text-slate-500">{product.category} · {product.unit}</p>
          </div>
          <Badge>{product.tracking}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[10px]">
          <span><small className="block text-slate-400">Vida útil</small><b>{product.life}</b></span>
          <span><small className="block text-slate-400">Stock</small><b>{product.stock} {product.unit}</b></span>
        </div>
      </button>)}
    </div>
    {editing && <ProductModal initial={editing} onClose={() => setEditing(null)} onSave={saveProduct} />}
  </>;
}

function ProductModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const inputClass = "h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));

  function submit(event) {
    event.preventDefault();
    const required = ["name", "category", "unit", "tracking", "status"];
    const nextErrors = Object.fromEntries(required.filter(field => !String(form[field] || "").trim()).map(field => [field, "Completa este campo"]));
    if (Number(form.stock) < 0) nextErrors.stock = "El stock no puede ser negativo";
    if (Number(form.minimumStock) < 0) nextErrors.minimumStock = "El mínimo no puede ser negativo";
    if (form.category !== "Envase" && (!form.lifeValue || Number(form.lifeValue) <= 0)) nextErrors.lifeValue = "Ingresa una vida útil válida";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSave(form);
  }

  return <Modal title={form.id ? "Editar producto" : "Registrar producto"} onClose={onClose}>
    <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
      <ProductField label="Nombre del producto *" field="name" icon={Package} full form={form} update={update} errors={errors} inputClass={inputClass} />
      <ProductField label="Categoría *" field="category" form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.category} onChange={event => update("category", event.target.value)} className={inputClass}>
          {["Materia prima", "Ingrediente", "Envase", "Producto en proceso", "Producto terminado"].map(category => <option key={category}>{category}</option>)}
        </select>
      </ProductField>
      <ProductField label="Unidad de medida *" field="unit" icon={Scale} form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.unit} onChange={event => update("unit", event.target.value)} className={`${inputClass} pl-9`}>
          {["kg", "g", "L", "ml", "unidad", "bolsa", "botella", "caja"].map(unit => <option key={unit}>{unit}</option>)}
        </select>
      </ProductField>
      <ProductField label="Control de trazabilidad *" field="tracking" form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.tracking} onChange={event => update("tracking", event.target.value)} className={inputClass}>
          {["Por lote", "Por número de serie", "Sin seguimiento"].map(tracking => <option key={tracking}>{tracking}</option>)}
        </select>
      </ProductField>
      <ProductField label="Estado *" field="status" form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.status} onChange={event => update("status", event.target.value)} className={inputClass}>
          {["Activo", "En revisión", "Inactivo"].map(status => <option key={status}>{status}</option>)}
        </select>
      </ProductField>
      <ProductField label="Vida útil *" field="lifeValue" icon={CalendarDays} form={form} update={update} errors={errors} inputClass={inputClass}>
        <span className="grid grid-cols-[1fr_110px] gap-2">
          <input type="number" min="1" disabled={form.category === "Envase"} value={form.lifeValue} onChange={event => update("lifeValue", event.target.value)} className={`${inputClass} pl-9 disabled:bg-slate-50`} />
          <select disabled={form.category === "Envase"} value={form.lifeUnit} onChange={event => update("lifeUnit", event.target.value)} className={inputClass}>
            {["días", "meses", "años"].map(unit => <option key={unit}>{unit}</option>)}
          </select>
        </span>
      </ProductField>
      <ProductField label="Stock inicial" field="stock" icon={Warehouse} form={form} update={update} errors={errors} inputClass={inputClass}><input type="number" min="0" step="0.01" value={form.stock} onChange={event => update("stock", event.target.value)} className={`${inputClass} pl-9`} /></ProductField>
      <ProductField label="Stock mínimo" field="minimumStock" icon={Warehouse} form={form} update={update} errors={errors} inputClass={inputClass}><input type="number" min="0" step="0.01" value={form.minimumStock} onChange={event => update("minimumStock", event.target.value)} className={`${inputClass} pl-9`} /></ProductField>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:col-span-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit"><Save className="size-4" />{form.id ? "Guardar cambios" : "Registrar producto"}</Button>
      </div>
    </form>
  </Modal>;
}

function ProductField({ label, field, icon: Icon, children, full = false, form, update, errors, inputClass }) {
  return <label className={`grid gap-1.5 text-xs font-medium text-slate-700 ${full ? "sm:col-span-2" : ""}`}>
    <span>{label}</span>
    <span className="relative grid">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-2.5 z-[1] size-4 text-slate-400" />}
      {children || <input value={form[field] || ""} onChange={event => update(field, event.target.value)} className={`${inputClass} ${Icon ? "pl-9" : ""}`} />}
    </span>
    {errors[field] && <small className="text-red-600">{errors[field]}</small>}
  </label>;
}

function toEditableProduct(product) {
  const match = product.life?.match(/^(\d+)\s(.+)$/);
  return { minimumStock: 0, status: "Activo", ...product, lifeValue: match?.[1] || "", lifeUnit: match?.[2] || "días" };
}

function categoryPrefix(category) {
  return { "Materia prima": "MP", Ingrediente: "ING", Envase: "ENV", "Producto en proceso": "PP", "Producto terminado": "PT" }[category] || "PRD";
}

function Recipes() {
  const { state, dispatch } = useDemo();
  const [editing, setEditing] = useState(null);

  function saveRecipe(values) {
    const normalized = { ...values, outputQty: Number(values.outputQty), components: values.components.map(component => ({ ...component, qty: Number(component.qty) })) };
    if (values.id) {
      dispatch({ type: "UPDATE", collection: "recipes", value: normalized });
    } else {
      const sequence = state.recipes.length + 1;
      dispatch({ type: "ADD", collection: "recipes", value: { ...normalized, id: `BOM-${String(sequence).padStart(3, "0")}` } });
    }
    setEditing(null);
  }

  return <>
    <PageHeader title="Recetas" description="Listas de materiales que calculan consumos y generan productos nuevos." action="Nueva receta" onAction={() => setEditing({ name: "", outputQty: 1, outputUnit: "unidad", status: "Activa", components: [{ product: "", qty: 1, unit: "kg" }] })} />
    <div className="space-y-3">
      {state.recipes.map(recipe => <button type="button" onClick={() => setEditing(recipe)} className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm" key={recipe.id}>
        <Boxes className="size-6 shrink-0 text-blue-600" />
        <div className="min-w-0 flex-1">
          <small className="text-[9px] text-slate-400">{recipe.id}</small>
          <h3 className="text-sm font-bold">{recipe.name}</h3>
          <p className="truncate text-[10px] text-slate-500">{recipe.components.map(component => component.product).join(", ")}</p>
        </div>
        <div className="text-right"><b className="block text-xs">{Number(recipe.outputQty).toLocaleString("es-PE")} {recipe.outputUnit}</b><small className="text-[9px] text-emerald-600">{recipe.status}</small></div>
      </button>)}
    </div>
    {editing && <RecipeModal initial={editing} products={state.products} onClose={() => setEditing(null)} onSave={saveRecipe} />}
  </>;
}

function RecipeModal({ initial, products, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const inputClass = "h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const updateComponent = (index, field, value) => update("components", form.components.map((component, position) => position === index ? { ...component, [field]: value } : component));

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Ingresa el producto resultante";
    if (!form.outputQty || Number(form.outputQty) <= 0) nextErrors.outputQty = "Ingresa un rendimiento válido";
    if (!form.components.length || form.components.some(component => !component.product || !component.qty || Number(component.qty) <= 0)) nextErrors.components = "Completa todos los componentes y sus cantidades";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSave(form);
  }

  return <Modal title={form.id ? "Editar receta" : "Crear receta"} onClose={onClose} size="lg">
    <form onSubmit={submit} className="grid grid-cols-1 gap-6 p-4 sm:p-6">
      <ProductField label="Producto resultante *" field="name" icon={Package} form={form} update={update} errors={errors} inputClass={inputClass}>
        <select value={form.name} onChange={event => update("name", event.target.value)} className={`${inputClass} pl-9`}>
          <option value="">Seleccionar producto</option>
          {products.filter(product => ["Producto en proceso", "Producto terminado"].includes(product.category)).map(product => <option key={product.id} value={product.name}>{product.name}</option>)}
        </select>
      </ProductField>
      <section className="grid grid-cols-1 gap-3">
        <div><h3 className="text-sm font-bold text-slate-900">Resultado de producción</h3><p className="mt-0.5 text-[10px] text-slate-500">Define cuánto producto se obtiene con esta receta.</p></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ProductField label="Rendimiento *" field="outputQty" form={form} update={update} errors={errors} inputClass={inputClass}><input type="number" min="0.01" step="0.01" value={form.outputQty} onChange={event => update("outputQty", event.target.value)} className={inputClass} /></ProductField>
        <ProductField label="Unidad de salida *" field="outputUnit" form={form} update={update} errors={errors} inputClass={inputClass}><select value={form.outputUnit} onChange={event => update("outputUnit", event.target.value)} className={inputClass}>{["kg", "L", "unidad", "bolsas", "botella", "caja"].map(unit => <option key={unit}>{unit}</option>)}</select></ProductField>
        <ProductField label="Estado" field="status" form={form} update={update} errors={errors} inputClass={inputClass}><select value={form.status} onChange={event => update("status", event.target.value)} className={inputClass}>{["Activa", "En revisión", "Inactiva"].map(status => <option key={status}>{status}</option>)}</select></ProductField>
        </div>
      </section>
      <section className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/40">
        <header className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-xs font-bold">Componentes</h3><p className="text-[10px] text-slate-500">Materias primas, insumos y envases requeridos.</p></div>
          <Button variant="secondary" onClick={() => update("components", [...form.components, { product: "", qty: 1, unit: "kg" }])}><Plus className="size-4" />Agregar</Button>
        </header>
        <div className="grid min-w-0 gap-3 p-4">
          <div className="hidden grid-cols-[minmax(0,1fr)_100px_110px_36px] gap-2 px-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:grid"><span>Componente</span><span>Cantidad</span><span>Unidad</span><span /></div>
          {form.components.map((component, index) => <div className="grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_100px_110px_36px] sm:bg-transparent sm:p-0" key={index}>
            <label className="grid gap-1"><span className="text-[9px] font-semibold text-slate-500 sm:hidden">Componente</span><select aria-label={`Componente ${index + 1}`} value={component.product} onChange={event => updateComponent(index, "product", event.target.value)} className={`${inputClass} min-w-0 w-full`}>
              <option value="">Seleccionar componente</option>
              {products.map(product => <option key={product.id} value={product.name}>{product.name}</option>)}
            </select></label>
            <label className="grid gap-1"><span className="text-[9px] font-semibold text-slate-500 sm:hidden">Cantidad</span><input aria-label="Cantidad" type="number" min="0.01" step="0.01" value={component.qty} onChange={event => updateComponent(index, "qty", event.target.value)} className={`${inputClass} min-w-0 w-full`} /></label>
            <label className="grid gap-1"><span className="text-[9px] font-semibold text-slate-500 sm:hidden">Unidad</span><select aria-label="Unidad" value={component.unit} onChange={event => updateComponent(index, "unit", event.target.value)} className={`${inputClass} min-w-0 w-full`}>{["kg", "g", "L", "ml", "unidad"].map(unit => <option key={unit}>{unit}</option>)}</select></label>
            <button type="button" aria-label="Quitar componente" disabled={form.components.length === 1} onClick={() => update("components", form.components.filter((_, position) => position !== index))} className="grid size-9 place-items-center self-end rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"><Trash2 className="size-4" /></button>
          </div>)}
          {errors.components && <small className="text-red-600">{errors.components}</small>}
        </div>
      </section>
      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white pt-4">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit"><Save className="size-4" />{form.id ? "Guardar cambios" : "Crear receta"}</Button>
      </div>
    </form>
  </Modal>;
}
