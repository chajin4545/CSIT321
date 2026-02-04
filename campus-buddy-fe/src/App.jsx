import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Guest Pages
import Home from './pages/guest/Home';
import Login from './pages/guest/Login';
import Events from './pages/guest/Events';
import Map from './pages/guest/Map';
import Chat from './pages/guest/Chat';

// Student Pages
import AdminChat from './pages/student/AdminChat';
import CourseChat from './pages/student/CourseChat';
import StudentAnnouncements from './pages/student/Announcements';
import Review from './pages/student/Review';

// Professor Pages
import ProfessorSchedule from './pages/professor/Schedule';
import ProfessorModules from './pages/professor/Modules';
import ProfessorStudents from './pages/professor/Students';
import ProfessorAnnouncements from './pages/professor/Announcements';

// School Admin Pages
import AdminSchedules from './pages/school-admin/Schedules';
import AdminExams from './pages/school-admin/Exams';
import AdminUsers from './pages/school-admin/Users';
import AdminEvents from './pages/school-admin/Events';
import AdminModules from './pages/school-admin/Modules';
import AdminClasses from './pages/school-admin/Classes';

// Sys Admin Pages
import SysAdminDashboard from './pages/sys-admin/Dashboard';
import SysAdminFeedback from './pages/sys-admin/Feedback';
import SysAdminAccounts from './pages/sys-admin/Accounts';

// Common
import Profile from './pages/Profile';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="guest/events" element={<Events />} />
            <Route path="guest/map" element={<Map />} />
            <Route path="guest/chat" element={<Chat />} />
            
            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="student/admin-chat" element={<AdminChat />} />
              <Route path="student/course-chat" element={<CourseChat />} />
              <Route path="student/announcements" element={<StudentAnnouncements />} />
              <Route path="student/review" element={<Review />} />
            </Route>

            {/* Professor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['professor']} />}>
              <Route path="professor/schedule" element={<ProfessorSchedule />} />
              <Route path="professor/modules" element={<ProfessorModules />} />
              <Route path="professor/students" element={<ProfessorStudents />} />
              <Route path="professor/announcements" element={<ProfessorAnnouncements />} />
            </Route>

             {/* School Admin Routes */}
             <Route element={<ProtectedRoute allowedRoles={['school_admin']} />}>
               <Route path="school-admin/schedules" element={<AdminSchedules />} />
               <Route path="school-admin/exams" element={<AdminExams />} />
               <Route path="school-admin/users" element={<AdminUsers />} />
               <Route path="school-admin/events" element={<AdminEvents />} />
               <Route path="school-admin/modules" element={<AdminModules />} />
               <Route path="school-admin/classes" element={<AdminClasses />} />
             </Route>

             {/* Sys Admin Routes */}
             <Route element={<ProtectedRoute allowedRoles={['sys_admin']} />}>
               <Route path="sys-admin/dashboard" element={<SysAdminDashboard />} />
               <Route path="sys-admin/feedback" element={<SysAdminFeedback />} />
               <Route path="sys-admin/accounts" element={<SysAdminAccounts />} />
             </Route>

             {/* Common Protected Route */}
             <Route element={<ProtectedRoute allowedRoles={['student', 'professor', 'school_admin', 'sys_admin']} />}>
                <Route path="profile" element={<Profile />} />
             </Route>

             {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;