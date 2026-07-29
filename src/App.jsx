import { useState } from "react";
import { DemoProvider } from "./state/DemoContext";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { PartnersPage } from "./pages/PartnersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { PurchasesPage } from "./pages/PurchasesPage";
import { ReceiptsPage } from "./pages/ReceiptsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ManufacturingPage } from "./pages/ManufacturingPage";
import { BulkPackagingPage } from "./pages/BulkPackagingPage";
import { SalesPage } from "./pages/SalesPage";
import { LotsPage } from "./pages/LotsPage";
import { TraceabilityPage } from "./pages/TraceabilityPage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { ReportsPage } from "./pages/ReportsPage";

const pages = {
  dashboard: DashboardPage, suppliers: PartnersPage, customers: PartnersPage,
  products: ProductsPage, recipes: ProductsPage, purchases: PurchasesPage,
  receipts: ReceiptsPage, inventory: InventoryPage, manufacturing: ManufacturingPage,
  bulk: BulkPackagingPage, sales: SalesPage, deliveries: SalesPage, lots: LotsPage,
  traceability: TraceabilityPage, incidents: IncidentsPage, recalls: IncidentsPage,
  alerts: ReportsPage, reports: ReportsPage, settings: ReportsPage,
};

export default function App() {
  const [route, setRoute] = useState("dashboard");
  const Page = pages[route] || DashboardPage;
  return <DemoProvider><AppShell route={route} onNavigate={setRoute}><Page route={route} onNavigate={setRoute}/></AppShell></DemoProvider>;
}
