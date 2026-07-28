# Raíz · Demo de trazabilidad Huancayo

Demo local creada para explicar, de forma simple, la trazabilidad de papa, zanahoria y maíz.

Al abrir la aplicación se debe elegir un producto. Cada producto funciona como un espacio independiente: cambia el tema visual, los lotes, los movimientos, los formularios, los controles técnicos y las alertas.

`Productor → Lote → Ingreso → Stock → Venta → Trazabilidad`

## Ejecutar

```powershell
npm install
npm run dev
```

Luego abre la dirección que muestre Vite (normalmente `http://localhost:5173`).

## Qué se puede probar

- Cambiar entre Resumen, Productores, Lotes, Ingresos, Ventas y Trazabilidad.
- Elegir Papa, Maíz o Zanahoria sin mezclar sus registros.
- Cambiar de producto desde el menú lateral o mediante “Salir”.
- Seleccionar un lote desde el resumen.
- Registrar un ingreso o una venta con campos específicos del cultivo y comprobar que el stock cambia.
- Consultar la trazabilidad por lote, producto, productor u origen.
- Usar el buscador superior para abrir directamente la consulta de trazabilidad.
- Abrir la ayuda contextual del producto.
- Probar la vista adaptable en computadora o celular.
- Los cambios quedan guardados por producto en `localStorage`; no requiere servidor ni base de datos.

## Controles incluidos por producto

- **Papa:** variedad y semilla, calibre/clasificación, curado, almacenamiento y daño en selección.
- **Maíz:** variedad y semilla, destino, secado, humedad y control de plagas/hongos en almacén.
- **Zanahoria:** aplicaciones y periodo de carencia, lavado, selección, presentación e inocuidad.

## Navegación guiada

La versión actual organiza cada producto como un expediente por lote:

1. Parcela.
2. Manejo del cultivo.
3. Cosecha.
4. Calidad.
5. Salida.

Las subpáginas son `Parcela`, `Manejo del cultivo`, `Cosecha y calidad`, `Movimientos` y `Expediente`. El expediente permite ver rápidamente qué está completo, qué debe revisarse y cuál es el siguiente paso.

## Fuentes técnicas locales

Los campos y explicaciones se adaptaron a las guías BPA guardadas en `docs/`:

- `Guia-BPA-PAPA.pdf`
- `Guia-BPA-MAIZ-CHOCLO.pdf`
- `Guia-BPA-ZANAHORIA.pdf`

Las tres guías requieren identificación de parcela, control de producto cosechado mediante el registro R6 y conservación de registros por un mínimo de dos años.

## Estructura principal

- `src/App.jsx`: estado y composición general.
- `src/components/`: selector, navegación, progreso y modales.
- `src/pages/`: expediente, etapas y movimientos.
- `src/config/traceability.js`: diferencias técnicas entre cultivos.
- `src/data.js`: datos demostrativos independientes por producto.

## Alcance

Es una demo conceptual. En producción convendría añadir autenticación, base de datos, roles, adjuntos, exportación a Excel/PDF, auditoría de cambios y copias de seguridad.
