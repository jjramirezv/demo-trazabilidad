export const PRODUCTS = {
  papa: {
    id: "papa",
    name: "Papa",
    description: "Variedad, calibre, curado y almacenamiento",
    theme: { primary: "#6f3f22", strong: "#4d2b18", soft: "#f4e9df", accent: "#b86b35", warning: "#a8512d" },
    lotLabel: "Lote de tubérculos",
    qualityLabel: "Clasificación",
    qualityOptions: ["Extra", "Primera", "Segunda"],
    controlLabel: "Días de curado",
    controlSuffix: "días",
    flow: ["Productor", "Parcela", "Cosecha", "Clasificación", "Almacén", "Venta"],
    focus: ["Variedad y origen de semilla", "Calibre y clasificación", "Curado y condiciones de almacén"],
    alerts: [
      { tone: "warning", title: "Curado por confirmar", text: "El lote PAP-024 necesita registrar el cierre de curado." },
      { tone: "danger", title: "Daño en selección", text: "Revisar 85 kg separados por daño mecánico." },
    ],
  },
  maiz: {
    id: "maiz",
    name: "Maíz",
    description: "Semilla, secado, humedad y calidad del grano",
    theme: { primary: "#d89400", strong: "#8b5a00", soft: "#fff4cf", accent: "#ef7d00", warning: "#b45f06" },
    lotLabel: "Lote de grano",
    qualityLabel: "Destino",
    qualityOptions: ["Grano seco", "Choclo", "Semilla"],
    controlLabel: "Humedad",
    controlSuffix: "%",
    flow: ["Productor", "Parcela", "Cosecha", "Secado", "Almacén", "Venta"],
    focus: ["Variedad y categoría de semilla", "Fecha y método de secado", "Humedad y control de plagas"],
    alerts: [
      { tone: "danger", title: "Humedad fuera de objetivo", text: "El lote MAI-014 registra 16.2%; continuar secado." },
      { tone: "warning", title: "Control de almacén", text: "Corresponde revisión de insectos y hongos esta semana." },
    ],
  },
  zanahoria: {
    id: "zanahoria",
    name: "Zanahoria",
    description: "Aplicaciones, lavado, selección e inocuidad",
    theme: { primary: "#e85d0b", strong: "#a53b00", soft: "#fff0e5", accent: "#4f7c38", warning: "#bd4b08" },
    lotLabel: "Lote de raíces",
    qualityLabel: "Presentación",
    qualityOptions: ["Lavada", "Sin lavar", "Seleccionada"],
    controlLabel: "Última aplicación",
    controlSuffix: "días",
    flow: ["Productor", "Parcela", "Cosecha", "Lavado", "Empaque", "Venta"],
    focus: ["Aplicaciones y periodo de carencia", "Agua y proceso de lavado", "Selección, empaque e inocuidad"],
    alerts: [
      { tone: "warning", title: "Periodo de carencia", text: "Validar la última aplicación antes de liberar ZAN-011." },
      { tone: "danger", title: "Registro de lavado", text: "Falta adjuntar el control de agua del turno de mañana." },
    ],
  },
};

export const seedByProduct = {
  papa: {
    lots: [
      { id: "PAP-024", product: "Papa Yungay", variety: "Yungay", producer: "Rosa Quispe", origin: "Sapallanga", area: 1.8, planted: "2025-01-12", harvest: "2025-05-10", incoming: 4800, sold: 2150, quality: "Primera", control: 10, seedOrigin: "Semilla certificada INIA", storage: "Almacén ventilado A" },
      { id: "PAP-027", product: "Papa Canchán", variety: "Canchán", producer: "Elena Huamán", origin: "Chupaca", area: 2.1, planted: "2025-01-18", harvest: "2025-05-22", incoming: 2450, sold: 900, quality: "Extra", control: 8, seedOrigin: "Semilla registrada", storage: "Almacén ventilado B" },
    ],
    movements: [
      { id: 1, date: "2025-05-18", type: "Venta", document: "FAC-P-1235", product: "Papa Yungay", lotId: "PAP-024", quantity: 2150, party: "Mercado Mayorista Huancayo", status: "Completado" },
      { id: 2, date: "2025-05-16", type: "Ingreso", document: "GUI-P-1121", product: "Papa Yungay", lotId: "PAP-024", quantity: 4800, party: "Rosa Quispe", status: "Falta guía" },
      { id: 3, date: "2025-05-13", type: "Ingreso", document: "GUI-P-1114", product: "Papa Canchán", lotId: "PAP-027", quantity: 2450, party: "Elena Huamán", status: "Completado" },
      { id: 4, date: "2025-05-19", type: "Venta", document: "FAC-P-1240", product: "Papa Canchán", lotId: "PAP-027", quantity: 900, party: "Bodega Central", status: "Completado" },
    ],
  },
  maiz: {
    lots: [
      { id: "MAI-014", product: "Maíz amiláceo", variety: "INIA 628 Yuracc Choccllo", producer: "Asociación Alayo", origin: "Concepción", area: 3.4, planted: "2024-10-20", harvest: "2025-05-14", incoming: 3000, sold: 1750, quality: "Grano seco", control: 16.2, seedOrigin: "Semilla INIA 628", storage: "Silo M-02" },
      { id: "MAI-018", product: "Maíz choclo", variety: "San Jerónimo", producer: "Comunidad de Sicaya", origin: "Sicaya", area: 2.2, planted: "2024-11-02", harvest: "2025-05-21", incoming: 2200, sold: 640, quality: "Choclo", control: 12.8, seedOrigin: "Semilla seleccionada", storage: "Almacén seco M-01" },
    ],
    movements: [
      { id: 11, date: "2025-05-17", type: "Ingreso", document: "GUI-M-2041", product: "Maíz amiláceo", lotId: "MAI-014", quantity: 3000, party: "Asociación Alayo", status: "En secado" },
      { id: 12, date: "2025-05-20", type: "Venta", document: "FAC-M-0840", product: "Maíz amiláceo", lotId: "MAI-014", quantity: 1750, party: "Molino Mantaro", status: "Completado" },
      { id: 13, date: "2025-05-21", type: "Ingreso", document: "GUI-M-2050", product: "Maíz choclo", lotId: "MAI-018", quantity: 2200, party: "Comunidad de Sicaya", status: "Completado" },
      { id: 14, date: "2025-05-22", type: "Venta", document: "FAC-M-0846", product: "Maíz choclo", lotId: "MAI-018", quantity: 640, party: "Mercado Modelo", status: "Completado" },
    ],
  },
  zanahoria: {
    lots: [
      { id: "ZAN-011", product: "Zanahoria Chantenay", variety: "Chantenay", producer: "Julio Cárdenas", origin: "El Tambo", area: 1.2, planted: "2025-02-04", harvest: "2025-05-16", incoming: 1200, sold: 1020, quality: "Lavada", control: 12, seedOrigin: "Semilla certificada", storage: "Cámara fresca Z-01" },
      { id: "ZAN-015", product: "Zanahoria Nantes", variety: "Nantes", producer: "María Samaniego", origin: "Pilcomayo", area: 1.6, planted: "2025-02-12", harvest: "2025-05-24", incoming: 1900, sold: 450, quality: "Seleccionada", control: 19, seedOrigin: "Semilla registrada", storage: "Cámara fresca Z-02" },
    ],
    movements: [
      { id: 21, date: "2025-05-17", type: "Ingreso", document: "GUI-Z-3022", product: "Zanahoria Chantenay", lotId: "ZAN-011", quantity: 1200, party: "Julio Cárdenas", status: "Por liberar" },
      { id: 22, date: "2025-05-20", type: "Venta", document: "FAC-Z-0931", product: "Zanahoria Chantenay", lotId: "ZAN-011", quantity: 1020, party: "Mercado Mayorista", status: "Completado" },
      { id: 23, date: "2025-05-24", type: "Ingreso", document: "GUI-Z-3030", product: "Zanahoria Nantes", lotId: "ZAN-015", quantity: 1900, party: "María Samaniego", status: "Completado" },
      { id: 24, date: "2025-05-25", type: "Venta", document: "FAC-Z-0938", product: "Zanahoria Nantes", lotId: "ZAN-015", quantity: 450, party: "Bioferia Huancayo", status: "Completado" },
    ],
  },
};

export const STORAGE_VERSION = "raiz-demo-v2";
export const formatKg = (value) => `${new Intl.NumberFormat("es-PE").format(value)} kg`;
export const formatDate = (value) => new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`));
