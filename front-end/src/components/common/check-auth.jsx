import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const CheckAuth = ({isAuthenticated,user,children}) => {
    const location=useLocation()  /* yedi login chaina bhaney ra yedi path chain login ya(or) register bahek aru ma cha bhaney we use */
    if (!isAuthenticated && !(location.pathname.includes('/login')||location.pathname.includes('/register') )) {
        return <Navigate to='/auth/login'></Navigate>
    }
    
   if (isAuthenticated && (location.pathname.includes('/login'))) {
       if(user?.role==='admin'){
        return <Navigate to='/admin/dashboard'></Navigate>

       }else{
        return <Navigate to="/shop/home"></Navigate>
       }
   }
   if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('admin')) {
      return <Navigate to='/unauth-page'></Navigate>
   }
   if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('shop')) {
    return <Navigate to='/admin/dashboard'></Navigate>
 }
 return <>{children}</>
}

export default CheckAuth