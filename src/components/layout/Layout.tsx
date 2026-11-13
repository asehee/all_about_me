import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return <div className="min-h-screen overflow-x-hidden"><Outlet /></div>
}
