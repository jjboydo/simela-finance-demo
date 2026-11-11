import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PeriodProvider } from '@/context/PeriodContext';
import { OverviewPage } from '@/pages/OverviewPage';
import { InvoicingPage } from '@/pages/InvoicingPage';
import { CostsPage } from '@/pages/CostsPage';
import { ReceivablesPage } from '@/pages/ReceivablesPage';
import { ProfitabilityPage } from '@/pages/ProfitabilityPage';

export default function App() {
  return (
    <PeriodProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="facturacion" element={<InvoicingPage />} />
            <Route path="costos" element={<CostsPage />} />
            <Route path="cuentas-por-cobrar" element={<ReceivablesPage />} />
            <Route path="rentabilidad" element={<ProfitabilityPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PeriodProvider>
  );
}
