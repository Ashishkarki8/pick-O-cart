import AdminHeader from '@/pages/admin-view/header'
import AdminSidebar from '@/pages/admin-view/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div>
        <AdminSidebar></AdminSidebar>
        <div>
         <AdminHeader></AdminHeader>
        <main><Outlet></Outlet></main>
        </div>
    </div>
  )
}

export default AdminLayout                                                                   