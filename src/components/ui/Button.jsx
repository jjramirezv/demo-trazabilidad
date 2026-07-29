export function Button({children,onClick,variant="primary",type="button",disabled=false}) {
 const styles={primary:"bg-blue-600 text-white hover:bg-blue-700",secondary:"border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",danger:"bg-red-600 text-white hover:bg-red-700",orange:"bg-orange-500 text-white hover:bg-orange-600"};
 return <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}>{children}</button>;
}
