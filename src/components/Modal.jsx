import { X } from "lucide-react";

export function Modal({ title, subtitle, onClose, children }) {
  return <div className="guided-overlay" onMouseDown={onClose}><section role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}><header><div><h2>{title}</h2><p>{subtitle}</p></div><button onClick={onClose}><X /></button></header>{children}</section></div>;
}
