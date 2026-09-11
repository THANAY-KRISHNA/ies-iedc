import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Achievements } from './pages/Achievements';
import { Ideas } from './pages/Ideas';
import { Startups } from './pages/Startups';
import { Workshops } from './pages/Workshops';
import { Resources } from './pages/Resources';
import { Gallery } from './pages/Gallery';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Join } from './pages/Join';
import { Contact } from './pages/Contact';

// Admin CMS Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHomepage } from './pages/admin/AdminHomepage';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminPosters } from './pages/admin/AdminPosters';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminAchievements } from './pages/admin/AdminAchievements';
import { AdminWorkshops } from './pages/admin/AdminWorkshops';
import { AdminIdeas } from './pages/admin/AdminIdeas';
import { AdminStartups } from './pages/admin/AdminStartups';
import { AdminResources } from './pages/admin/AdminResources';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/startups" element={<Startups />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/join" element={<Join />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin CMS Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/homepage"
            element={
              <ProtectedRoute>
                <AdminHomepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posters"
            element={
              <ProtectedRoute>
                <AdminPosters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <AdminNews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/team"
            element={
              <ProtectedRoute>
                <AdminTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/achievements"
            element={
              <ProtectedRoute>
                <AdminAchievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/workshops"
            element={
              <ProtectedRoute>
                <AdminWorkshops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ideas"
            element={
              <ProtectedRoute>
                <AdminIdeas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/startups"
            element={
              <ProtectedRoute>
                <AdminStartups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resources"
            element={
              <ProtectedRoute>
                <AdminResources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/media"
            element={
              <ProtectedRoute>
                <AdminMedia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
