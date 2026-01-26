import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard, Investments, Treasury, Invoices, WhatsApp, FinancialRequests } from './pages';
import { PageSkeleton } from './components/common';

// Lazy load HCMS pages for code splitting
const HCMSDashboard = lazy(() => import('./pages/hcms/HCMSDashboard'));
const Employees = lazy(() => import('./pages/hcms/Employees'));
const Attendance = lazy(() => import('./pages/hcms/Attendance'));
const Leave = lazy(() => import('./pages/hcms/Leave'));
const Payroll = lazy(() => import('./pages/hcms/Payroll'));
const Recruitment = lazy(() => import('./pages/hcms/Recruitment'));
const Performance = lazy(() => import('./pages/hcms/Performance'));
const Training = lazy(() => import('./pages/hcms/Training'));
const Compliance = lazy(() => import('./pages/hcms/Compliance'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="investments" element={<Investments />} />
          <Route path="treasury" element={<Treasury />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="financial-requests" element={<FinancialRequests />} />
          <Route path="whatsapp" element={<WhatsApp />} />
          {/* HCMS Routes - Lazy loaded */}
          <Route
            path="hcms"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <HCMSDashboard />
              </Suspense>
            }
          />
          <Route
            path="hcms/employees"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Employees />
              </Suspense>
            }
          />
          <Route
            path="hcms/attendance"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Attendance />
              </Suspense>
            }
          />
          <Route
            path="hcms/leave"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Leave />
              </Suspense>
            }
          />
          <Route
            path="hcms/payroll"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Payroll />
              </Suspense>
            }
          />
          <Route
            path="hcms/recruitment"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Recruitment />
              </Suspense>
            }
          />
          <Route
            path="hcms/performance"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Performance />
              </Suspense>
            }
          />
          <Route
            path="hcms/training"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Training />
              </Suspense>
            }
          />
          <Route
            path="hcms/compliance"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Compliance />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
