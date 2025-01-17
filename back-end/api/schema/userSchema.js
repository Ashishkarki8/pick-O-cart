import { Schema } from "mongoose";

const userSchema = Schema(
  {
    userName: {
      type: String,
      required: true,
      /*  unique:true, */
      trim: true,
      validate: {
        validator: (value) => /^[a-zA-Z]+[ a-zA-Z]+$/.test(value),
        message: "Username can only contain letters and spaces",
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    // phoneNumber: {
    //   type: String,
    //   validate: {
    //     validator: (value) => /^[0-9]{9,15}$/.test(value),
    //     message: "Phone number must be between 10-15 digits",
    //   },
    // },

    password: {
      type: String,
      required: true,
      select: false  // Prevent password from being returned in queries
    },
    role: {
      type: String,
    //   enum: ["user", "admin"], author means user editor means admin and admin means superadmin
      default: "user",
    },
   /*  gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    }, */
    // address: {
    //   district: {required:true,type:String},
    //   city: {required:false,type:String},
    //   place: {required:true,type:String},
    // },
    profilePicture: {
      type: String,
      default: "default-profile-pic.jpg",
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    /* subscribed: {
      type: Boolean,
      default: false,
    }, */
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
export default userSchema;
