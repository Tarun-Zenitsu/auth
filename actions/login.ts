// "use server";

// import { LoginSchema } from "@/schemas";
// import { signIn } from "@/auth";
// import * as z from "zod";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// import { AuthError } from "next-auth";
// import { getUserByEmail } from "@/data/user";

// export const login = async (values: z.infer<typeof LoginSchema>) => {
//   const validatedFields = LoginSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Invalid fields!" };
//   }

//   const { email, password } = validatedFields.data;
//   const existingUser = await getUserByEmail(email);

//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     return {
//       success: "Login successful!",
//       isVerified: existingUser?.isVerified,
//       role: existingUser?.role,
//     };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return { error: "Invalid email or password." };
//     }
//     return { error: "An unexpected error occurred." };
//   }
// };

"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { compare } from "bcryptjs";

export const validateLogin = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password) {
    return { error: "Invalid credentials." };
  }

  const isPasswordValid = await compare(password, existingUser.password);
  if (!isPasswordValid) {
    return { error: "Invalid credentials." };
  }

  return {
    success: true,
    isVerified: existingUser.isVerified,
    role: existingUser.role,
    email,
    password,
  };
};
