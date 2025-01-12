import AuthLayout from "@/components/auth/layout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
// import CheckAuth from "@/components/common/check-auth";
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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized  } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     dispatch(checkAuth());
  //   }
  // }, [dispatch, isAuthenticated]);
 
  useEffect(() => {
    dispatch(checkAuth());
  }, []); // Remove isAuthenticated dependency

  if (!isInitialized) {
    return <div>Loading...</div>; // Or your loading component
  }


  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <h1>Header Component</h1>
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






// const App = () => {
//   // const isAuthenticated=false;
//   // const user=false;

//   const {user,isAuthenticated,isLoading} =useSelector((state)=>{ return state.auth}); //for login
//   console.log('isLoading:', isLoading)
//   console.log('isAuthenticated:', isAuthenticated)
//   console.log('user:', user)

//   const dispatch=useDispatch();
//   useEffect(() => {
//     alert("inside useeffect");
//     dispatch(checkAuth());
//   },[dispatch])
//   /* we are calling the dispactch for the checkAuth here because everytimne we go to the page we need to check the user has excess or not */
 


//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
//       <h1>header component
//       </h1>
//       <Routes>
//         <Route path="/auth" element={
//           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//             <AuthLayout></AuthLayout> {/* parent mah children call garna milcha as a call back */}
//           </CheckAuth>
//         }>
//           <Route path="login" element={<AuthLogin></AuthLogin>}></Route>
//           <Route path="register" element={<AuthRegister></AuthRegister>}></Route>
//         </Route>

//         <Route path="/admin" element={
//            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//             <AdminLayout/>
//           </CheckAuth>
//         }>
//           <Route path="dashboard" element={<AdminDashboard/>}></Route>
//           <Route path="products" element={<AdminProducts/>}></Route>
//           <Route path="orders" element={<AdminOrders/>}></Route>
//           <Route path="features" element={<AdminFeatures/>}></Route>
//         </Route>

//         <Route path="/shop" element={                                      //user
//           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//             <ShoppingLayout/>
//           </CheckAuth>}>
//           <Route path="home" element={<ShoppingHome/>}></Route>
//           <Route path="listing" element={<ShoppingListing/>}></Route>
//           <Route path="account" element={<ShoppingAccount/>}></Route>
//         </Route>
       
        
//         <Route path="*" element={<Notfound/>}></Route>
//         <Route path="/unauth-page" element={<UnauthPage/>}></Route>
//       </Routes>
//     </div>
//   );
// };



{/* <div className="flex flex-col overflow-hidden bg-white">
      <h1>header component
      </h1>
      <Routes>
        <Route path="/auth" element={<AuthLayout></AuthLayout>}>
          <Route path="login" element={<AuthLogin></AuthLogin>}></Route>
          <Route path="register" element={<AuthRegister></AuthRegister>}></Route>
        </Route>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route path="dashboard" element={<AdminDashboard/>}></Route>
          <Route path="products" element={<AdminProducts/>}></Route>
          <Route path="orders" element={<AdminOrders/>}></Route>
          <Route path="features" element={<AdminFeatures/>}></Route>
        </Route>
        <Route path="/shop" element={<ShoppingLayout/>}>
          <Route path="home" element={<ShoppingHome/>}></Route>
          <Route path="listing" element={<ShoppingListing/>}></Route>
          <Route path="account" element={<ShoppingAccount/>}></Route>
        </Route>
       
        
        <Route path="*" element={<Notfound/>}></Route>
      </Routes>
    </div> */}