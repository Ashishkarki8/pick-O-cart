export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
    validation: {
      required: "User Name is required",
      pattern:{value:/^[a-zA-Z\s]+$/,message:"Username can only contain letters and spaces"},
      minLength: { value: 3, message: "Must be at least 3 characters long" },
      maxLength:{value:30,message:"Username cannot have more than 30 characters"},
    },
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email name",
    componentType: "email",  //in needs to be email but if i add this type to email then it shows html validations
    type: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password ",
    componentType: "input",
    type: "password",
    validation: {
      required: "Password is required",
       minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
    },
  },
];

// Makes the form reusable and easy to update by just modifying this configuration


export const loginFormControls=[
  {name: "email",
    label: "Email",
    placeholder: "Enter your email name",
    componentType: "input",
    type: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password ",
    componentType: "input",
    type: "password",
    validation: {
      required: "Password is required",
       minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
    },
  },
]
  
   
