import { Plus } from "lucide-react";
import { Button } from "./Button";
export function PageHeader({title,description,action,onAction}) {return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1><p className="mt-1 max-w-3xl text-sm text-slate-500">{description}</p></div>{action&&<Button onClick={onAction}><Plus className="size-4"/>{action}</Button>}</div>}
