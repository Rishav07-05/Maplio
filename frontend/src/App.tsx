import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from './redux/store'
import './App.css'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import AuthPage from './pages/AuthPage'
import SharedRoadmapPage from './pages/SharedRoadmapPage'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

function App() {
  const theme = useSelector((state: RootState) => state.ui.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('theme-dark', theme === 'dark')
    root.style.colorScheme = theme
    localStorage.setItem('maplio-theme', theme)
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />
      <Route path="/shared/:shareId" element={<SharedRoadmapPage />} />
    </Routes>
  )
}

export default App
