import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageSkeleton } from './components/common';
import { UserProvider } from './contexts/UserContext';

// Lazy load Finance pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Investments = lazy(() => import('./pages/Investments'));
const Treasury = lazy(() => import('./pages/Treasury'));
const Invoices = lazy(() => import('./pages/Invoices'));
const WhatsApp = lazy(() => import('./pages/WhatsApp'));
const FinancialRequests = lazy(() => import('./pages/FinancialRequests'));

// Lazy load HCMS pages for code splitting
const HCMSDashboard = lazy(() => import('./pages/hcms/HCMSDashboard'));
const Employees = lazy(() => import('./pages/hcms/Employees'));
const Attendance = lazy(() => import('./pages/hcms/Attendance'));
const Leave = lazy(() => import('./pages/hcms/Leave'));
const Payroll = lazy(() => import('./pages/hcms/Payroll'));
const Recruitment = lazy(() => import('./pages/hcms/Recruitment'));
const Performance = lazy(() => import('./pages/hcms/Performance'));
const Training = lazy(() => import('./pages/hcms/Training'));
const HCMSCompliance = lazy(() => import('./pages/hcms/Compliance'));

// Lazy load LCRMS pages for code splitting
const LCRMSDashboard = lazy(() => import('./pages/lcrms/LCRMSDashboard'));
const Contracts = lazy(() => import('./pages/lcrms/Contracts'));
const LCRMSCompliance = lazy(() => import('./pages/lcrms/Compliance'));
const KnowledgeBase = lazy(() => import('./pages/lcrms/KnowledgeBase'));
const RiskManagement = lazy(() => import('./pages/lcrms/RiskManagement'));
const Litigation = lazy(() => import('./pages/lcrms/Litigation'));
const Secretarial = lazy(() => import('./pages/lcrms/Secretarial'));

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          {/* Finance Routes - Lazy loaded */}
          <Route index element={<Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense>} />
          <Route path="investments" element={<Suspense fallback={<PageSkeleton />}><Investments /></Suspense>} />
          <Route path="treasury" element={<Suspense fallback={<PageSkeleton />}><Treasury /></Suspense>} />
          <Route path="invoices" element={<Suspense fallback={<PageSkeleton />}><Invoices /></Suspense>} />
          <Route path="financial-requests" element={<Suspense fallback={<PageSkeleton />}><FinancialRequests /></Suspense>} />
          <Route path="whatsapp" element={<Suspense fallback={<PageSkeleton />}><WhatsApp /></Suspense>} />
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
                <HCMSCompliance />
              </Suspense>
            }
          />
          {/* LCRMS Routes - Lazy loaded */}
          <Route
            path="lcrms"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <LCRMSDashboard />
              </Suspense>
            }
          />
          <Route
            path="lcrms/contracts"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Contracts />
              </Suspense>
            }
          />
          <Route
            path="lcrms/compliance"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <LCRMSCompliance />
              </Suspense>
            }
          />
          <Route
            path="lcrms/knowledge"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <KnowledgeBase />
              </Suspense>
            }
          />
          <Route
            path="lcrms/risks"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <RiskManagement />
              </Suspense>
            }
          />
          <Route
            path="lcrms/litigation"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Litigation />
              </Suspense>
            }
          />
          <Route
            path="lcrms/secretarial"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Secretarial />
              </Suspense>
            }
          />
        </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
