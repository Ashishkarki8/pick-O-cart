// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useMemo } from 'react';

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const location = useLocation();
//   const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

//   // Memoize the result of checking if the current route is an auth route
//   const isAuthRoute = useMemo(() => location.pathname.includes('/auth/'), [location.pathname]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }
//   // useMemo ensures that the check for isAuthRoute only runs when location.pathname changes
//   if (isAuthRoute) {
//     if (isAuthenticated) {
//       return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/shop/home'} replace />;
//     }
//     return children;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/unauth-page" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;




// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const location = useLocation();
//   const { user, isAuthenticated, isLoading, isInitialized } = useSelector((state) => state.auth);

//   // Show loading during initialization
//   /* if (!isInitialized || isLoading ) {
//     return <div>Loading...</div>;
//   } */
  
//     if (isLoading && !location.pathname.includes('/auth') && isInitialized) {
//       return <div>Loading...</div>;
//     }

//   // Handle non-authenticated users
//   if (!isAuthenticated) {
//     // Allow access to login/register pages
//     if (location.pathname.includes('/auth/')) {
//       return children;
//     }
//     // Redirect to login for all other pages
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   // Handle authenticated users
//   if (isAuthenticated) {
//     // Redirect from auth pages based on role
//     if (location.pathname.includes('/auth/')) {
//       const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/shop/home';
//       return <Navigate to={redirectPath} replace />;
//     }

//     // Prevent admin accessing shop routes
//     if (user?.role === 'admin' && location.pathname.includes('/shop')) {
//       return <Navigate to="/admin/dashboard" replace />;
//     }

//     // Prevent regular users accessing admin routes
//     if (user?.role !== 'admin' && location.pathname.includes('/admin')) {
//       return <Navigate to="/unauth-page" replace />;
//     }

//     // Check specific role requirements
//     if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
//       return <Navigate to="/unauth-page" replace />;
//     }
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  // Only show loading during initial auth check
  /* if (!isInitialized) {
    return <div>Loading...</div>;
  }
 */
  // Auth routes handling (login/register)
  if (location.pathname.includes('/auth/')) {
    if (isAuthenticated) {
      return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/shop/home'} replace />;
    }
    return children;
  }

  // Protected routes handling
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Additional role-specific protection
  if (user?.role === 'admin' && location.pathname.includes('/shop')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role !== 'admin' && location.pathname.includes('/admin')) {
    return <Navigate to="/unauth-page" replace />;
  }

  return children;
};

export default ProtectedRoute;