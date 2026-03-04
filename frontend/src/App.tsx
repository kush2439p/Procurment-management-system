import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Requisitions from "./pages/Requisitions";
import RequisitionForm from "./pages/RequisitionForm";
import RequisitionDetail from "./pages/RequisitionDetail";
import PurchaseOrders from "./pages/PurchaseOrders";
import PurchaseOrderForm from "./pages/PurchaseOrderForm";
import PurchaseOrderDetail from "./pages/PurchaseOrderDetail";
import Approvals from "./pages/Approvals";
import Reports from "./pages/Reports";
import AdminPanel from "./pages/AdminPanel";
import VendorLogin from "./pages/VendorLogin";
import VendorPortal from "./pages/VendorPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/vendor-login" element={<PublicRoute><VendorLogin /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
      <Route path="/requisitions" element={<ProtectedRoute><Requisitions /></ProtectedRoute>} />
      <Route path="/requisitions/new" element={<ProtectedRoute><RequisitionForm /></ProtectedRoute>} />
      <Route path="/requisitions/:id" element={<ProtectedRoute><RequisitionDetail /></ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
      <Route path="/purchase-orders/new" element={<ProtectedRoute><PurchaseOrderForm /></ProtectedRoute>} />
      <Route path="/purchase-orders/:id" element={<ProtectedRoute><PurchaseOrderDetail /></ProtectedRoute>} />
      <Route path="/approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/vendor-portal" element={<ProtectedRoute><VendorPortal /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AnimatePresence>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
