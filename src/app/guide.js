export const guideByRoute={
  dashboard:{purpose:"Muestra las tareas pendientes y un resumen general de la operación.",action:"Úsalo para decidir qué actividad atender primero."},
  traceability:{purpose:"Permite seguir un lote desde su proveedor hasta el cliente.",action:"Selecciona un lote y elige si quieres ver su origen, destino o recorrido completo."},
  suppliers:{purpose:"Guarda a las empresas y productores que abastecen materiales.",action:"Registra sus datos y los productos que suministran."},
  customers:{purpose:"Guarda a las personas o empresas que reciben los productos.",action:"Registra contacto, dirección de entrega y condición de pago."},
  products:{purpose:"Organiza materias primas, insumos, envases y productos terminados.",action:"Crea el producto antes de usarlo en compras, recetas o ventas."},
  recipes:{purpose:"Define qué materiales se necesitan para elaborar un producto.",action:"Selecciona el producto final y agrega sus componentes con cantidades."},
  purchases:{purpose:"Registra lo que se solicitará a un proveedor.",action:"Crea la orden, revisa cantidades y confírmala para continuar con la recepción."},
  receipts:{purpose:"Confirma lo que realmente llegó y revisa su calidad.",action:"Compara la entrega con la compra y aprueba o rechaza el ingreso."},
  inventory:{purpose:"Muestra cuánto producto existe y dónde está cada lote.",action:"Busca un lote, revisa su estado y cambia su ubicación cuando sea necesario."},
  lots:{purpose:"Reúne la información individual de cada lote registrado.",action:"Abre un lote para consultar cantidad, ubicación, vencimiento y origen."},
  manufacturing:{purpose:"Controla la elaboración de productos a partir de materias primas.",action:"Revisa la receta, inicia la orden y registra el lote producido."},
  bulk:{purpose:"Controla el envasado de un producto preparado previamente.",action:"Selecciona el producto base y registra cuántas presentaciones se obtuvieron."},
  sales:{purpose:"Registra los productos solicitados por un cliente.",action:"Crea el pedido y reserva el lote que se utilizará para atenderlo."},
  deliveries:{purpose:"Controla la salida física de los pedidos confirmados.",action:"Verifica cantidades, cliente y lote antes de marcar el despacho."},
  incidents:{purpose:"Registra problemas de calidad relacionados con un lote.",action:"Bloquea el lote para evitar que siga utilizándose mientras se investiga."},
  recalls:{purpose:"Ayuda a retirar productos que ya fueron vendidos o entregados.",action:"Localiza clientes afectados y controla las cantidades recuperadas."},
  alerts:{purpose:"Reúne vencimientos, bloqueos y tareas que requieren atención.",action:"Revísalo diariamente para atender primero los eventos importantes."},
  reports:{purpose:"Resume la información registrada en compras, producción y trazabilidad.",action:"Elige el reporte relacionado con la consulta que necesitas."},
  settings:{purpose:"Configura almacenes, unidades y reglas generales del sistema.",action:"Modifica estos datos solamente cuando cambie la operación."},
};

export const quickWorkflow=[
  ["1","Registra","Crea proveedores, clientes y productos."],
  ["2","Compra","Genera una orden y confirma la recepción."],
  ["3","Controla","Revisa lotes, calidad y existencias."],
  ["4","Produce o vende","Elabora productos o prepara pedidos."],
  ["5","Consulta","Usa trazabilidad para conocer origen y destino."],
];
