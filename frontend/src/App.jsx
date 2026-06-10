// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import ResourceDetail from './pages/ResourceDetail';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import StudyAssistant from './pages/StudyAssistant';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import ForumHome from './pages/ForumHome';
import ForumPost from './pages/ForumPost';
import NewPost from './pages/NewPost';
import SubjectForum from './pages/SubjectForum';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineBanner from './components/OfflineBanner';
import MobileNav from './components/MobileNav';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <OfflineBanner />
      {/* OnboardingTour disabled due to UI issues - can be re-enabled after debugging */}
      <div id="main-content" className="pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
        <Route path="/search" element={<Search />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/forum" element={<ForumHome />} />
        <Route path="/forum/post/:id" element={<ForumPost />} />
        <Route path="/forum/new-post" element={
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        } />
        <Route path="/forum/category/:subject" element={<SubjectForum />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <StudyAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute adminOnly>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      <MobileNav />
      <InstallPrompt />
    </Router>
  );
}

export default App;
