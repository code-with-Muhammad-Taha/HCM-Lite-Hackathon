import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth
import Login from "./pages/Auth/Login";
import FirstRun from "./pages/Auth/FirstRun";
import ChangePassword from "./pages/Auth/ChangePassword";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CompanySetup from "./pages/Admin/CompanySetup";
import Departments from "./pages/Admin/Departments";
import LeaveTypes from "./pages/Admin/LeaveTypes";
import Holidays from "./pages/Admin/Holidays";
import UserManagement from "./pages/Admin/UserManagement";
import CreateHR from "./pages/Admin/CreateHR";
import PayrollFinalize from "./pages/Admin/PayrollFinalize";
import AuditLog from "./pages/Admin/AuditLog";

// HR
import HRDashboard from "./pages/HR/HRDashboard";
import Employees from "./pages/HR/Employees";
import EmployeeForm from "./pages/HR/EmployeeForm";
import AttendanceBoard from "./pages/HR/AttendanceBoard";
import LeaveApprovals from "./pages/HR/LeaveApprovals";
import PayrollDraft from "./pages/HR/PayrollDraft";
import Announcements from "./pages/HR/Announcements";

// Employee
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import MyAttendance from "./pages/Employee/MyAttendance";
import MyLeave from "./pages/Employee/MyLeave";
import MyPayslips from "./pages/Employee/MyPayslips";
import MyProfile from "./pages/Employee/MyProfile";

// Shared
import AIAssistant from "./pages/Shared/AIAssistant";
import AnnouncementsView from "./pages/Shared/AnnouncementsView";
import Unauthorized from "./pages/Shared/Unauthorized";
import NotFound from "./pages/Shared/NotFound";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/first-run" element={<FirstRun />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><Layout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="company" element={<CompanySetup />} />
          <Route path="departments" element={<Departments />} />
          <Route path="leave-types" element={<LeaveTypes />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="create-hr" element={<CreateHR />} />
          <Route path="payroll" element={<PayrollFinalize />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="ai" element={<AIAssistant />} />
        </Route>

        <Route path="/hr" element={<ProtectedRoute allowedRoles={["hr"]}><Layout /></ProtectedRoute>}>
          <Route index element={<HRDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="attendance" element={<AttendanceBoard />} />
          <Route path="leave" element={<LeaveApprovals />} />
          <Route path="payroll" element={<PayrollDraft />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="ai" element={<AIAssistant />} />
        </Route>

        <Route path="/employee" element={<ProtectedRoute allowedRoles={["employee"]}><Layout /></ProtectedRoute>}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="leave" element={<MyLeave />} />
          <Route path="payslips" element={<MyPayslips />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="announcements" element={<AnnouncementsView />} />
          <Route path="ai" element={<AIAssistant />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;