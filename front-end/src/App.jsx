// import AuthLayout from "@/components/auth/layout";
// import ProtectedRoute from "@/components/common/ProtectedRoute";
// // import CheckAuth from "@/components/common/check-auth";
// import AdminDashboard from "@/pages/admin-view/dashboard";
// import AdminFeatures from "@/pages/admin-view/features";
// import AdminLayout from "@/pages/admin-view/layout";
// import AdminOrders from "@/pages/admin-view/orders";
// import AdminProducts from "@/pages/admin-view/products";
// import AuthLogin from "@/pages/auth/login";
// import AuthRegister from "@/pages/auth/register";
// import Notfound from "@/pages/not-found";
// import ShoppingAccount from "@/pages/shopping-view/account";
// import ShoppingHome from "@/pages/shopping-view/home";
// import ShoppingLayout from "@/pages/shopping-view/layout";
// import ShoppingListing from "@/pages/shopping-view/listing";
// import UnauthPage from "@/pages/unauth-page";
// import { checkAuth } from "@/store/auth-slice";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Route, Routes } from "react-router-dom";

// const App = () => {
//   const dispatch = useDispatch();
//   const { isInitialized  } = useSelector((state) => state.auth);

//   // useEffect(() => {
//   //   if (!isAuthenticated) {
//   //     dispatch(checkAuth());
//   //   }
//   // }, [dispatch, isAuthenticated]);
 
//   useEffect(() => {
//     dispatch(checkAuth());
//   }, []); // Remove isAuthenticated dependency

//   if (!isInitialized) {
//     return <div>Loading...</div>; // Or your loading component
//   }


//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
//       <h1>Header Component</h1>
      // <Routes>
      //   {/* Auth Routes */}
      //   <Route path="/auth" element={
      //     <ProtectedRoute>
      //       <AuthLayout />
      //     </ProtectedRoute>
      //   }>
      //     <Route path="login" element={<AuthLogin />} />
      //     <Route path="register" element={<AuthRegister />} />
      //   </Route>

      //   {/* Admin Routes */}
      //   <Route path="/admin" element={
      //     <ProtectedRoute allowedRoles={['admin']}>
      //       <AdminLayout />
      //     </ProtectedRoute>
      //   }>
      //     <Route path="dashboard" element={<AdminDashboard />} />
      //     <Route path="products" element={<AdminProducts />} />
      //     <Route path="orders" element={<AdminOrders />} />
      //     <Route path="features" element={<AdminFeatures />} />
      //   </Route>

      //   {/* User Routes */}
      //   <Route path="/shop" element={
      //     <ProtectedRoute allowedRoles={['user']}>
      //       <ShoppingLayout />
      //     </ProtectedRoute>
      //   }>
      //     <Route path="home" element={<ShoppingHome />} />
      //     <Route path="listing" element={<ShoppingListing />} />
      //     <Route path="account" element={<ShoppingAccount />} />
      //   </Route>

      //   <Route path="/unauth-page" element={<UnauthPage />} />
      //   <Route path="*" element={<Notfound />} />
      // </Routes>
//     </div>
//   );
// };

// export default App;


import AuthLayout from "@/components/auth/layout";
import Header from "@/components/common/header";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminDashboard from "@/pages/admin-view/dashboard";
import AdminFeatures from "@/pages/admin-view/features";
import AdminLayout from "@/pages/admin-view/layout";
import AdminOrders from "@/pages/admin-view/orders";
import AdminProducts from "@/pages/admin-view/products";
import AuthLogin from "@/pages/auth/login";
import AuthRegister from "@/pages/auth/register";
import Notfound from "@/pages/not-found";
import ShoppingAccount from "@/pages/shopping-view/account";
import ShoppingHome from "@/pages/shopping-view/home";
import ShoppingLayout from "@/pages/shopping-view/layout";
import ShoppingListing from "@/pages/shopping-view/listing";
import UnauthPage from "@/pages/unauth-page";
import { checkAuth } from "@/store/auth-slice";
import { initiateSilentRefresh } from "@/store/auth-slice/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

const App = () => {
  

  const dispatch = useDispatch();

  const { isInitialized, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(initiateSilentRefresh());
    }
  }, [isAuthenticated, dispatch]);
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
 /*  if (!isInitialized && !window.location.pathname.includes('/auth/')) {
    return <div>Loading...</div>;
  } */
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Header />
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* User Routes */}
        <Route path="/shop" element={
          <ProtectedRoute allowedRoles={['user']}>
            <ShoppingLayout />
          </ProtectedRoute>
        }>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
};

export default App;