import { Check } from "lucide-react";
import { STATUS_LABEL } from "../config/traceability";

export function ProgressRail({ stages, activeStage, onSelect }) {
  return <div className="progress-rail">{stages.map((stage, index) => <button key={stage.id} className={`${stage.status} ${activeStage === stage.id ? "active" : ""}`} onClick={() => onSelect(stage.id)}>
    <span>{stage.status === "complete" ? <Check /> : index + 1}</span>
    <strong>{index + 1}</strong>
    <small>{stage.label}</small>
    <em>{STATUS_LABEL[stage.status]}</em>
  </button>)}</div>;
}
