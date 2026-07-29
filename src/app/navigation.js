import { AlertTriangle, BarChart3, Boxes, Factory, FlaskConical, Home, Package, ReceiptText, Search, Settings, ShoppingCart, Tags, Truck, Users, Warehouse } from "lucide-react";
export const navGroups=[
 ["General",[["dashboard","Inicio",Home],["traceability","Trazabilidad",Search]]],
 ["Datos maestros",[["suppliers","Proveedores",Users],["customers","Clientes",Users],["products","Productos",Package],["recipes","Recetas de producción",Boxes]]],
 ["Abastecimiento",[["purchases","Órdenes de compra",ShoppingCart],["receipts","Recepción y calidad",ReceiptText]]],
 ["Almacén",[["inventory","Existencias",Warehouse],["lots","Consulta de lotes",Tags]]],
 ["Producción",[["manufacturing","Órdenes de producción",Factory],["bulk","Envasado",FlaskConical]]],
 ["Ventas y despacho",[["sales","Pedidos de venta",ShoppingCart],["deliveries","Despachos",Truck]]],
 ["Calidad y seguridad",[["incidents","Incidentes",AlertTriangle],["recalls","Retiro de productos",Truck]]],
 ["Control",[["alerts","Alertas",AlertTriangle],["reports","Reportes",BarChart3],["settings","Configuración",Settings]]],
];
