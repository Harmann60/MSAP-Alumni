import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import StoriesPage from './pages/StoriesPage'
import CommunityPage from './pages/CommunityPage'
import AboutPage from './pages/AboutPage'
import RegisterPage from './pages/RegisterPage'
import AccountsPage from './pages/AccountsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AlumniLoginPage from './pages/AlumniLoginPage'
import GalleryPage from './pages/GalleryPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-parchment text-stone font-sans flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<AlumniLoginPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
