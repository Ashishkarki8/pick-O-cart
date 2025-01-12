import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { toast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AuthRegister = () => {
  // Initial state is no longer necessary since react-hook-form will manage the form data
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data, event) => {
    event.preventDefault();
   console.log("Form submitted with:", data);
    dispatch(registerUser(data)).then((data) => {  //if fullfilled  if succes true then then runs and later its gets updated in  state.user = action.payload.user || null
        
        if (data?.payload?.success) {
          toast({
            // variant: "destructive" ,
             title: data.payload.message,
             duration:3000 ,// Default duration for toasts in 3 seconds
          })
           navigate('/auth/login');
        }else{
          toast({
             variant: "destructive" ,
             title: data.payload.message,
             duration:3000 ,// Default duration for toasts in 3 seconds
          })
        }
      })
    ;
    // Handle the data here (e.g., send it to an API, etc.)
  };

  return (
    <section className="bg-white">
      <div className="flex items-center justify-center px-4 py-10 bg-white border sm:px-6 lg:px-8 sm:py-16 lg:py-24">
        <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
            Sign Up
          </h2>

          <p>
            Already have an account?
            <Link
              className="py-2 ml-3 text-lg text-blue-700 hover:underline"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
          {/* CommonForm manages form data internally with react-hook-form */}
          <CommonForm
            formControls={registerFormControls}
            buttonText={"Sign Up"}
            onSubmit={onSubmit} // Here, you pass onSubmit to handle the form submission
          />
        </div>
      </div>
    </section>
  );
};

export default AuthRegister;

// /* import CommonForm from "@/components/common/form";
// import { registerFormControls } from "@/config";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// const AuthRegister = () => {
//   const initialState = { userName: "", email: "", password: "" };
//   const [formData, setFormData] = useState(initialState);
//   const onSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted with:", formData);

//   };
//   return (
//     <section className="bg-white">
//       <div className="flex items-center justify-center px-4 py-10 bg-white border sm:px-6 lg:px-8 sm:py-16 lg:py-24">
//         <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
//           <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
//             Login
//           </h2>
//           {/* <p className="mt-2 text-base text-gray-600">Already have an account? <a href="#" title="" className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700">Login</a></p> */}

//           <p>
//             Already have account
//             <Link
//               className="py-2 ml-3 text-lg text-blue-700 hover:underline"
//               to="/auth/login"
//             >
//               Login
//             </Link>
//           </p>
//           <CommonForm
//             formControls={registerFormControls}
//             buttonText={"Sign Up"}
//             formData={formData}
//             // yo form form ko data chain form mah pathako
//             setFormData={setFormData}
//             onSubmit={onSubmit}
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AuthRegister; */

// import CommonForm from '@/components/common/form';
// import { registerFormControls } from '@/config';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// const AuthRegister = () => {
//   const initialState={userName:"",email:"",password:""};
//   const [formData,setFormData]=useState(initialState);
//   const onSubmit =() => {

//   }
//   return (
//     <section className="bg-white">
//         <div className="flex items-center justify-center px-4 py-10 bg-white border sm:px-6 lg:px-8 sm:py-16 lg:py-24">
//             <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
//                 <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up to Celebration</h2>
//                 {/* <p className="mt-2 text-base text-gray-600">Already have an account? <a href="#" title="" className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700">Login</a></p> */}

//                 <form action="#" method="POST" className="mt-8">
//                     <div className="space-y-5">
//                         <div>
//                             <label  className="text-base font-medium text-gray-900"> Full Name </label>
//                             <div className="mt-2.5">
//                                 <input
//                                     type="text"
//                                     name=""
//                                     id=""
//                                     placeholder="Enter your full name"
//                                     className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label  className="text-base font-medium text-gray-900"> Email address </label>
//                             <div className="mt-2.5">
//                                 <input
//                                     type="email"
//                                     name=""
//                                     id=""
//                                     placeholder="Enter email to get started"
//                                     className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label  className="text-base font-medium text-gray-900"> Password </label>
//                             <div className="mt-2.5">
//                                 <input
//                                     type="password"
//                                     name=""
//                                     id=""
//                                     placeholder="Enter your password"
//                                     className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
//                                 />
//                             </div>
//                         </div>

//                        {/*  <div className="flex items-center">
//                             <input type="checkbox" name="agree" id="agree" className="w-5 h-5 text-blue-600 bg-white border-gray-200 rounded" />

//                             <label for="agree" className="ml-3 text-sm font-medium text-gray-500">
//                                 I agree to Postcraft’s <a href="#" title="" className="text-blue-600 hover:text-blue-700 hover:underline">Terms of Service</a> and <a href="#" title="" className="text-blue-600 hover:text-blue-700 hover:underline">Privacy Policy</a>
//                             </label>
//                         </div> */}

//                         <div>
//                             <button type="submit" className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700">
//                                 Create free account
//                             </button>
//                         </div>
//                     </div>
//                 </form>

//                 <div className="mt-3 space-y-3">
//                     <button
//                         type="button"
//                         className="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
//                     >
//                         <div className="absolute inset-y-0 left-0 p-4">
//                             <svg className="w-6 h-6 text-rose-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                 <path
//                                     d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
//                                 ></path>
//                             </svg>
//                         </div>
//                         Sign up with Google
//                     </button>

//                     <button
//                         type="button"
//                         className="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
//                     >
//                         <div className="absolute inset-y-0 left-0 p-4">
//                             <svg className="w-6 h-6 text-[#2563EB]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                                 <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
//                             </svg>
//                         </div>
//                         Sign up with Facebook
//                     </button>
//                     <p>Already have account
//                     <Link className='py-2 ml-3 text-lg text-blue-700 hover:underlin ' to="/auth/login">Login</Link></p>
//                 </div>
//                 <CommonForm formControls={registerFormControls} buttonText={'Sign Up'} formData={formData} setFormData={setFormData} onSubmit={onSubmit}
//                 />
//             </div>
//         </div>

// </section>
//   )
// }

// export default AuthRegister
