import { Outlet } from "react-router-dom";
//  common layoput
const AuthLayout = () => {
  return (
    <div className="border border-4 border-red-800 flex min-h-screen w-full">

      <div className=" border border-2 border-yellow-600 hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="border border-2 border-blue-600   max-w-md    space-y-6 text-center  text-primary-foreground">
          <h1 className="text-4xl font-extrabold tracking-tight ">welcome to the ecommerce </h1>
        </div>
       
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 ">
          <Outlet/>  {/* others layout */}  {/* login rah register which is child routes ko lagi pani yo mathi ko layout apply huncha */}
        </div>
    </div>
  );
};

export default AuthLayout;





{/* <div className="min-h-screen bg-purple-400 flex justify-center items-center">
<div className="absolute w-60 h-60 rounded-xl bg-purple-300 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
<div className="absolute w-48 h-48 rounded-xl bg-purple-300 -bottom-6 -right-10 transform rotate-12 hidden md:block"></div>
<div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
  <div>
    <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
      Create An Account
    </h1>
    <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
      Create an account to enjoy all the services without any ads for
      free!
    </p>
  </div>
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Email Addres"
      className="block text-sm py-3 px-4 rounded-lg w-full border outline-purple-500"
    />
    <input
      type="text"
      placeholder="Password"
      className="block text-sm py-3 px-4 rounded-lg w-full border outline-purple-500"
    />
  </div>
  <div className="text-center mt-6">
    <button className="w-full py-2 text-xl text-white bg-purple-400 rounded-lg hover:bg-purple-500 transition-all">
      Create Account
    </button>
    <p className="mt-4 text-sm">
      Already Have An Account?{" "}
      <span className="underline  cursor-pointer"> Sign In</span>
    </p>
  </div>
</div>
<div className="w-40 h-40 absolute bg-purple-300 rounded-full top-0 right-12 hidden md:block"></div>
<div className="w-20 h-40 absolute bg-purple-300 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
</div> */}