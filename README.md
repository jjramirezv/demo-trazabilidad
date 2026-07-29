# AgroTrace Huancayo

Plataforma de trazabilidad agroalimentaria construida con React, Vite y Tailwind CSS.

## Puesta en marcha

```bash
npm install
npm run dev
```

Para compilar la aplicación:

```bash
npm run build
```

## Flujos incluidos

- Registro de proveedores, clientes y productos.
- Compra y recepción con control de calidad.
- Inventario y seguimiento por lote.
- Fabricación, consumo de componentes y creación de producto terminado.
- Producción a granel y posterior envasado.
- Venta, reserva de existencias y entrega.
- Trazabilidad hacia atrás y hacia adelante.
- Gestión de incidentes y retiro de productos.
- Alertas, reportes y parámetros operativos.

El botón “Restablecer datos operativos” recupera el estado inicial de la aplicación.

## Estructura

```text
src/
  app/                  navegación
  components/           interfaz y composición
  data/                 información operativa inicial
  features/             vistas especializadas
  pages/                módulos funcionales
  state/                estado y persistencia local
```

Los registros incluidos mantienen relaciones consistentes entre órdenes, recepciones, lotes, fabricación, inventario y entregas. Las integraciones con servicios tributarios, sanitarios o dispositivos se incorporan en la etapa de conexión con los sistemas autorizados.
