import { z } from "zod";
//username schema validation
export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast two characters")
  .max(20, "username cannot be more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain any special characters");

//signup schema validation
export const signUpSchema=z.object(
    {
      username:usernameValidation,
      email:z.string().email({message:"Invalid email address"}),
      password:z.string()
      .min(6,{message:"Password should be of atleast 6 characters"})
      .max(10,{message:"Password cannot be more than 10 characters"})
    }
)