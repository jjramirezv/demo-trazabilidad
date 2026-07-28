export const TRACEABILITY_CONFIG = {
  papa: {
    short: "Calibre y almacenamiento",
    stages: [
      { id: "parcela", label: "Parcela", title: "Origen identificado", detail: "Código, ubicación, área y responsable", status: "complete" },
      { id: "manejo", label: "Manejo", title: "Manejo registrado", detail: "Riego, fertilización y aplicaciones", status: "complete" },
      { id: "cosecha", label: "Cosecha", title: "Producto cosechado", detail: "Fecha, variedad y cantidad del R6", status: "complete" },
      { id: "calidad", label: "Calidad", title: "Calidad verificada", detail: "Calibre, defectos y descarte", status: "review" },
      { id: "salida", label: "Salida", title: "Destino registrado", detail: "Venta, transporte y comprador", status: "pending" },
    ],
    important: ["Una sola variedad por lote", "Clasificar Extra, Primera o Segunda", "Almacenar en oscuridad y con ventilación"],
    pages: {
      parcela: {
        title: "Parcela y origen",
        intro: "Identifica de forma única el lugar donde se produjo este lote.",
        groups: [
          ["Identificación", ["Código de parcela", "Fundo o predio", "Distrito y referencia", "Área cultivada"]],
          ["Material de siembra", ["Variedad", "Origen de semilla", "Fecha de siembra", "Responsable técnico"]],
        ],
      },
      manejo: {
        title: "Manejo del cultivo",
        intro: "Conserva la evidencia de las labores realizadas antes de la cosecha.",
        groups: [
          ["Registros BPA", ["Riego", "Fertilización", "Aplicaciones de plaguicidas", "Periodo de carencia"]],
          ["Control de campo", ["Plagas y enfermedades", "Capacitaciones", "Observaciones del responsable"]],
        ],
      },
      calidad: {
        title: "Cosecha y calidad",
        intro: "Registra el producto cosechado y clasifica los tubérculos por calibre y condición.",
        groups: [
          ["Registro R6", ["Fecha de cosecha", "Variedad", "Cantidad cosechada", "Observaciones"]],
          ["Clasificación", ["Extra / Primera / Segunda", "Daño mecánico", "Verdeamiento o brotamiento", "Descarte"]],
          ["Almacenamiento", ["Oscuridad", "Ventilación", "Sacos con circulación de aire"]],
        ],
      },
    },
  },
  maiz: {
    short: "Humedad y categoría",
    stages: [
      { id: "parcela", label: "Parcela", title: "Origen identificado", detail: "Código, ubicación, área y responsable", status: "complete" },
      { id: "manejo", label: "Manejo", title: "Manejo registrado", detail: "Riego, fertilización y aplicaciones", status: "complete" },
      { id: "cosecha", label: "Cosecha", title: "Mazorca cosechada", detail: "Fecha y ventana comercial", status: "complete" },
      { id: "calidad", label: "Calidad", title: "Calidad verificada", detail: "Humedad, tamaño y categoría", status: "review" },
      { id: "salida", label: "Salida", title: "Destino registrado", detail: "Transporte y planta procesadora", status: "pending" },
    ],
    important: ["Cosechar con grano turgente y lechoso", "Controlar humedad entre 20 % y 25 %", "Proteger mazorcas del sol, polvo y lluvia"],
    pages: {
      parcela: {
        title: "Parcela y origen",
        intro: "Vincula la mazorca con la parcela, la variedad y el responsable.",
        groups: [
          ["Identificación", ["Código de parcela", "Fundo o predio", "Distrito y referencia", "Área cultivada"]],
          ["Cultivo", ["Variedad", "Categoría de semilla", "Fecha de siembra", "Responsable técnico"]],
        ],
      },
      manejo: {
        title: "Manejo del cultivo",
        intro: "Registra las labores que influyen en formación, maduración y seguridad del producto.",
        groups: [
          ["Registros BPA", ["Riego por etapa fenológica", "Fertilización", "Aplicaciones", "Periodo de carencia"]],
          ["Control", ["Plagas y enfermedades", "Calidad anual del agua", "Capacitaciones"]],
        ],
      },
      calidad: {
        title: "Cosecha y calidad",
        intro: "Controla la corta ventana comercial del choclo y sus requisitos poscosecha.",
        groups: [
          ["Registro R6", ["Fecha de cosecha", "Variedad", "Cantidad cosechada", "Observaciones"]],
          ["Calidad", ["Humedad 20–25 %", "Longitud de mazorca", "Extra / Primera / Segunda / Tercera", "Daño o humedad externa"]],
          ["Salida", ["Protección en transporte", "Temperatura de almacenamiento", "Código de planta procesadora"]],
        ],
      },
    },
  },
  zanahoria: {
    short: "Lavado e inocuidad",
    stages: [
      { id: "parcela", label: "Parcela", title: "Origen identificado", detail: "Código, ubicación, área y responsable", status: "complete" },
      { id: "manejo", label: "Manejo", title: "Manejo registrado", detail: "Agua, aplicaciones y carencia", status: "complete" },
      { id: "cosecha", label: "Cosecha", title: "Raíz cosechada", detail: "Fecha, madurez y cantidad", status: "complete" },
      { id: "calidad", label: "Calidad", title: "Lavado y calidad", detail: "Agua, tamaño, color y selección", status: "review" },
      { id: "salida", label: "Salida", title: "Destino registrado", detail: "Empaque, transporte y comprador", status: "pending" },
    ],
    important: ["Lavar inmediatamente con agua no contaminada", "Controlar diámetro, longitud y color", "Registrar aplicaciones y periodo de carencia"],
    pages: {
      parcela: {
        title: "Parcela y origen",
        intro: "Identifica el predio y la variedad de cada lote de raíces.",
        groups: [
          ["Identificación", ["Código de parcela", "Fundo o predio", "Distrito y referencia", "Área cultivada"]],
          ["Cultivo", ["Variedad", "Origen de semilla", "Fecha de siembra", "Responsable técnico"]],
        ],
      },
      manejo: {
        title: "Manejo del cultivo",
        intro: "Da seguimiento al agua, los insumos y la inocuidad antes de cosechar.",
        groups: [
          ["Registros BPA", ["Riego y fuente de agua", "Fertilización", "Aplicaciones", "Periodo de carencia"]],
          ["Control", ["Plagas", "Análisis de agua", "Capacitaciones e higiene"]],
        ],
      },
      calidad: {
        title: "Cosecha y calidad",
        intro: "Documenta la cosecha, el lavado inmediato y la selección comercial.",
        groups: [
          ["Registro R6", ["Fecha de cosecha", "Variedad", "Cantidad cosechada", "Observaciones"]],
          ["Lavado y selección", ["Agua sin contaminantes", "Diámetro máximo 4,5 cm", "Longitud de primera 7,5–18 cm", "Color naranja sin manchas verdes"]],
          ["Empaque", ["Categoría", "Número de lote", "Cantidad y procedencia"]],
        ],
      },
    },
  },
};

export const STATUS_LABEL = {
  complete: "Completo",
  review: "Por revisar",
  pending: "Pendiente",
};
