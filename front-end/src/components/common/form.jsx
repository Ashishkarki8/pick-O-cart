import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CommonForm = ({ formControls, onSubmit, buttonText }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const [passwordStates, setPasswordStates] = useState(
    formControls.reduce((acc, control) => {
      if (control.componentType === "input" && control.type === "password") {
        acc[control.name] = { show: false, hasValue: false };
      }
      return acc;
    }, {})
  );

  const handlePasswordToggle = (fieldName) => {
    setPasswordStates((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], show: !prev[fieldName].show },
    }));
  };

  const handlePasswordInputChange = (fieldName, value) => {
    setPasswordStates((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], hasValue: value.length > 0 },
    }));
  };

  const renderInputsByComponentType = (controlItem) => {
    switch (controlItem.componentType) {
      case "input":
        return (
          <div className="relative">
            <Input
              id={controlItem.name}
              type={
                controlItem.type === "password" && !passwordStates[controlItem.name]?.show
                  ? "password"
                  : "text"
              }
              placeholder={controlItem.placeholder}
              {...register(controlItem.name, {
                ...controlItem.validation,
                onChange: (e) => handlePasswordInputChange(controlItem.name, e.target.value),
              })}
              className={`border ${
                errors[controlItem.name] ? "border-red-600" : "border-gray-300"
              }`}
            />
            {controlItem.type === "password" && passwordStates[controlItem.name]?.hasValue && (
              <button
                type="button"
                onClick={() => handlePasswordToggle(controlItem.name)}
                className="absolute p-1 -translate-y-1/2 rounded-full right-2 top-1/2 hover:bg-gray-100"
              >
                {passwordStates[controlItem.name]?.show ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        );
      case "select":
        return (
          <Controller
            name={controlItem.name}
            control={control}
            rules={controlItem.validation}
            render={({ field }) => (
              <Select {...field}>
                <SelectTrigger>
                  <SelectValue placeholder={controlItem.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {controlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.value} value={optionItem.value}>
                      {optionItem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
      case "textarea":
        return (
          <Input
            id={controlItem.name}
            type="textarea"
            placeholder={controlItem.placeholder}
            {...register(controlItem.name, controlItem.validation)}
            className={`border ${
              errors[controlItem.name] ? "border-red-500" : "border-gray-300"
            }`}
          />
        );
      default:
        return (
          <Input
            id={controlItem.name}
            type={controlItem.type}
            placeholder={controlItem.placeholder}
            {...register(controlItem.name, controlItem.validation)}
            className={`border ${
              errors[controlItem.name] ? "border-red-500" : "border-gray-300"
            }`}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {formControls.map((controlItem) => (
        <div key={controlItem.name} className="flex flex-col gap-2">
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderInputsByComponentType(controlItem)}
          {errors[controlItem.name] && (
            <span className="text-sm text-red-700">
              {errors[controlItem.name].message}
            </span>
          )}
        </div>
      ))}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`mt-4 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;


// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// const CommonForm = ({ formControls, onSubmit, buttonText }) => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isSubmitting },
//     watch, // Use watch here from the same useForm instance
//   } = useForm();

//   // Watching all form fields
//   const watchedData = watch(); 
//   console.log("Real-time Data:", watchedData);

//   const renderInputsByComponentType = (controlItem) => {
//     switch (controlItem.componentType) {
//       case "input":
//         return (
//           <Input
//             id={controlItem.name}
//             type={controlItem.type}
//             placeholder={controlItem.placeholder}
//             {...register(controlItem.name, controlItem.validation)}
//             className={`border ${
//               errors[controlItem.name] ? " border-red-600" : "border-gray-300"
//             }`}
//           />
//         );
//       case "select":
//         return (
//           <Controller
//             name={controlItem.name}
//             control={control}
//             rules={controlItem.validation}
//             render={({ field }) => (
//               <Select {...field}>
//                 <SelectTrigger>
//                   <SelectValue placeholder={controlItem.placeholder} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {controlItem.options.map((optionItem) => (
//                     <SelectItem key={optionItem.value} value={optionItem.value}>
//                       {optionItem.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
//         );
//       case "textarea":
//         return (
//           <Input
//             id={controlItem.name}
//             type="textarea"
//             placeholder={controlItem.placeholder}
//             {...register(controlItem.name, controlItem.validation)}
//             className={`border ${
//               errors[controlItem.name] ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//         );
//       default:
//         return (
//           <Input
//             varients=""
//             id={controlItem.name}
//             type={controlItem.type}
//             placeholder={controlItem.placeholder}
//             {...register(controlItem.name, controlItem.validation)}
//             className={`border ${
//               errors[controlItem.name] ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//         );
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//       {formControls.map((controlItem) => (
//         <div key={controlItem.name} className="flex flex-col gap-2">
//           <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
//           {renderInputsByComponentType(controlItem)}
//           {errors[controlItem.name] && (
//             <span className="text-sm text-red-700">
//               {errors[controlItem.name].message}
//             </span>
//           )}
//         </div>
//       ))}
//       <Button
//         type="submit"
//         disabled={isSubmitting}
//         className={`mt-4 ${
//           isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//       >
//         {buttonText || "Submit"}
//       </Button>
//     </form>
//   );
// };

// export default CommonForm;


// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useForm } from "react-hook-form";

// const CommonForm = ({formControls = [], formData = {}, setFormData, onSubmit, buttonText}) => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (onSubmit) onSubmit(formData);
//   };

//   const renderInputsByComponentType = (controlItem) => {
//     console.log(controlItem);
//     const value = formData[controlItem.name] || '';

//     switch (controlItem.componentType) {
//       case "input":
//         return (
//           <Input
//             key={`input-${controlItem.name}`}
//             name={controlItem.name}
//             placeholder={controlItem.placeholder}
//             id={controlItem.name}
//             type={controlItem.type}
//             value={value}
//             onChange={(e) => {
//               setFormData({...formData, [controlItem.name]: e.target.value})
//             }}
//           />
//         );
//       case "select":
//         return (
//           <Select
//             key={`select-${controlItem.name}`}
//             onValueChange={(value) => {
//               setFormData({...formData, [controlItem.name]: value})
//             }}
//             value={value}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder={controlItem.placeholder} />
//             </SelectTrigger>
//             <SelectContent>
//               {controlItem.options && controlItem.options.length > 0 ?
//                 controlItem.options.map((optionItem) => (
//                   <SelectItem
//                     key={`option-${controlItem.name}-${optionItem.id}`}
//                     value={optionItem.value}
//                   >
//                     {optionItem.label}
//                   </SelectItem>
//                 ))
//               : null}
//             </SelectContent>
//           </Select>
//         );
//       case "textarea":
//         return (
//           <Input
//             key={`textarea-${controlItem.name}`}
//             name={controlItem.name}
//             placeholder={controlItem.placeholder}
//             id={controlItem.name}
//             type="textarea"
//             value={value}
//             onChange={(e) => {
//               setFormData({...formData, [controlItem.name]: e.target.value})
//             }}
//           />
//         );
//       default:
//         return (
//           <Input
//             key={`default-${controlItem.name}`}
//             name={controlItem.name}
//             placeholder={controlItem.placeholder}
//             id={controlItem.name}
//             type={controlItem.type}
//             value={value}
//             onChange={(e) => {
//               setFormData({...formData, [controlItem.name]: e.target.value})
//             }}
//           />
//         );
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//       {formControls.map((controlItem) => (
//         <div key={`field-${controlItem.name}`} className="flex flex-col gap-2">
//           <Label  htmlFor={controlItem.name}>{controlItem.label}</Label>
//           {renderInputsByComponentType(controlItem)}   {/* switch lai pathaucha */}
//         </div>
//       ))}
//       <Button  variant="default" type="submit" className="mt-4">
//         {buttonText || "Submit"}
//       </Button>
//     </form>
//   );
// };

// export default CommonForm;
