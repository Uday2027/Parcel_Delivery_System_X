import { Navigate, Route, Routes } from 'react-router-dom';
import { useCurrentUser } from '@/redux/features/auth/authSlice';
import MainLayout from '@/components/layout/MainLayout';
import { Role } from '@/types';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import BookParcel from '@/pages/BookParcel';
import MyParcels from '@/pages/MyParcels';
import AdminParcels from '@/pages/AdminParcels';
import DeliveryAssignments from '@/pages/DeliveryAssignments';
import PublicTracking from '@/pages/PublicTracking';
import TrackParcel from '@/pages/TrackParcel';
import DeliveryCrew from '@/pages/DeliveryCrew';
import Landing from '@/pages/Landing';
import Profile from '@/pages/Profile';
import Features from '@/pages/Features';
import About from '@/pages/About';


const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: Role[] }) => {
  const user = useCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/track-public" element={<PublicTracking />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/my-parcels" element={<MyParcels />} />
        <Route path="/dashboard/book-parcel" element={<BookParcel />} />
        <Route path="/dashboard/track" element={<TrackParcel />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/admin-parcels" element={<AdminParcels />} />
        <Route path="/dashboard/delivery-crew" element={<DeliveryCrew />} />
        <Route path="/dashboard/delivery-assignments" element={<DeliveryAssignments />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
