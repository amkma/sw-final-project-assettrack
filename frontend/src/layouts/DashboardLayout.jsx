import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  function toggleSidebar() {
    setSidebarCollapsed((prev) => !prev)
  }

  return (
    <div
      className={`dashboard-layout ${sidebarCollapsed ? 'dashboard-layout--collapsed' : ''}`}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="dashboard-layout__main">
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
