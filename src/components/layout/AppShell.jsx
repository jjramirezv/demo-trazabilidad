import { Bell, BookOpen, Menu, Search, Sprout, X } from "lucide-react";
import { useState } from "react";
import { navGroups } from "../../app/navigation";
import { guideByRoute, quickWorkflow } from "../../app/guide";
import { useDemo } from "../../state/DemoContext";

export function AppShell({ route, onNavigate, children }) {
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { dispatch } = useDemo();

  return (
    <div className="min-h-screen bg-[#f5f6f1] lg:grid lg:grid-cols-[230px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[230px] flex-col bg-[#173d2f] text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <Sprout className="size-8 text-emerald-400" />
          <div><strong className="block text-base">AgroTrace</strong><small className="text-[10px] uppercase tracking-widest text-emerald-300">Huancayo</small></div>
        </div>
        <button onClick={() => setOpen(false)} className="absolute right-3 top-3 lg:hidden"><X /></button>
        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map(([group, items]) => (
            <section className="mb-4" key={group}>
              <h3 className="mb-1 px-2 text-[9px] font-bold uppercase tracking-widest text-emerald-200/70">{group}</h3>
              {items.map(([id, label, Icon]) => (
                <button key={id} onClick={() => { onNavigate(id); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition ${route === id ? "bg-blue-600 text-white" : "text-emerald-50 hover:bg-white/8"}`}>
                  <Icon className="size-4" />{label}
                </button>
              ))}
            </section>
          ))}
        </nav>
        <button onClick={() => dispatch({ type: "RESET" })} className="m-3 rounded-lg border border-white/10 p-3 text-left text-[10px] text-emerald-100">Restablecer datos operativos</button>
      </aside>

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button onClick={() => setOpen(true)} className="lg:hidden"><Menu /></button>
          <div className="hidden text-sm font-bold sm:block">Agroindustrias Valle del Mantaro S.A.C.</div>
          <label className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-lg border border-slate-200 px-3 md:flex">
            <Search className="size-4 text-slate-400" />
            <input className="w-full border-0 text-xs outline-none" placeholder="Buscar en AgroTrace…" />
          </label>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">Operación activa · Huancayo</span>
          <button onClick={() => setGuideOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"><BookOpen className="size-4 text-blue-600" /><span className="hidden sm:inline">Guía rápida</span></button>
          <Bell className="size-4" />
        </header>
        <main className="mx-auto max-w-[1500px] p-4 lg:p-6">{children}</main>
      </div>
      {guideOpen && <QuickGuide route={route} onClose={() => setGuideOpen(false)} onNavigate={id => { onNavigate(id); setGuideOpen(false); }} />}
    </div>
  );
}

function QuickGuide({ route, onClose, onNavigate }) {
  const current = guideByRoute[route];
  return <div className="fixed inset-0 z-50 bg-slate-950/35" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-[#f8f9f5] shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><BookOpen className="size-5" /></span><div><h2 className="text-sm font-bold">Guía rápida</h2><p className="text-[10px] text-slate-500">Aprende el sistema paso a paso</p></div></div>
        <button onClick={onClose} className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"><X className="size-5" /></button>
      </header>
      <div className="flex-1 overflow-y-auto p-5">
        {current && <section className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4"><small className="text-[9px] font-bold uppercase tracking-wide text-blue-600">Estás en esta sección</small><h3 className="mt-1 text-sm font-bold">{findLabel(route)}</h3><p className="mt-2 text-xs leading-5 text-slate-700">{current.purpose}</p><p className="mt-2 text-[10px] leading-4 text-slate-600"><b>Qué hacer:</b> {current.action}</p></section>}
        <section className="mb-6"><h3 className="mb-3 text-xs font-bold">Recorrido recomendado</h3><div className="grid gap-2">{quickWorkflow.map(([number,title,text])=><div className="flex gap-3 rounded-lg bg-white p-3" key={number}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{number}</span><div><b className="block text-xs">{title}</b><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{text}</p></div></div>)}</div></section>
        <section><h3 className="mb-3 text-xs font-bold">¿Para qué sirve cada opción?</h3><div className="grid gap-4">{navGroups.map(([group,items])=><div key={group}><h4 className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">{group}</h4>{items.map(([id,label,Icon])=><button onClick={() => onNavigate(id)} className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${route===id?"bg-blue-50":"hover:bg-white"}`} key={id}><Icon className={`mt-0.5 size-4 shrink-0 ${route===id?"text-blue-600":"text-slate-400"}`}/><span className="flex-1"><b className="block text-xs">{label}</b><small className="mt-0.5 block text-[10px] leading-4 text-slate-500">{guideByRoute[id]?.purpose}</small></span></button>)}</div>)}</div></section>
      </div>
    </aside>
  </div>;
}

function findLabel(route) {
  for (const [, items] of navGroups) {
    const item = items.find(([id]) => id === route);
    if (item) return item[1];
  }
  return "Esta sección";
}
