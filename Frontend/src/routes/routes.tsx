import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
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


const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: Role[] }) => {
  const user = useSelector(useCurrentUser);

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
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-parcels" element={<MyParcels />} />
        <Route path="/book-parcel" element={<BookParcel />} />
        <Route path="/track" element={<TrackParcel />} />
        <Route path="/admin/parcels" element={<AdminParcels />} />
        <Route path="/admin/delivery-crew" element={<DeliveryCrew />} />
        <Route path="/delivery/assignments" element={<DeliveryAssignments />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
