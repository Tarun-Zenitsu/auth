"use server";

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validated = RegisterSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid Fields!" };

  const { name, email, password, role } = validated.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: "Email already in use!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: role === "CANDIDATE",
    },
  });

  return { success: "User created!" };
};
