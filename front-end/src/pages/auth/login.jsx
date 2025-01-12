import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { toast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = (data,event) => {
    event.preventDefault();
    dispatch(loginUser(data)).then((data) => {  //if fullfilled  if succes true then then runs and later its gets updated in  state.user = action.payload.user || null
       
      if (data?.payload?.success) {
        toast({
          // variant: "destructive" ,
           title: data.payload.message,
           duration:3000 ,// Default duration for toasts in 3 seconds
        })
        //  navigate('/auth/login');
      }else{
        toast({
           variant: "destructive" ,
           title: data.payload.message,
           duration:3000 ,// Default duration for toasts in 3 seconds
        })
      }
    })
  };
  
  return (
    <section className="bg-white">
      <div className="flex items-center justify-center px-4 py-10 bg-white border sm:px-6 lg:px-8 sm:py-16 lg:py-24">
        <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
            Sign In
          </h2>

          <p>
            Dont have account? 
            <Link
              className="py-2 ml-2 text-blue-700 hover:underline"
              to="/auth/register"
            >create
            </Link>
          </p>

          {/* CommonForm manages form data internally with react-hook-form */}
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Sign In"}
            onSubmit={onSubmit}  // Here, you pass onSubmit to handle the form submission
          />
        </div>
      </div>
    </section>
  );
};

export default AuthLogin;
