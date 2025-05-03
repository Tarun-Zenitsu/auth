"use server";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevents NEXT_REDIRECT
    });

    if (res?.error) {
      return { error: res.error };
    }

    return { success: "Login successful!" };
  } catch (error: any) {
    const message = error?.cause?.err?.message || error?.message;
    return { error: message || "Something went wrong." };
  }
};
