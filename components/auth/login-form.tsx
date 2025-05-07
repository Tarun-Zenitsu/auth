// "use client";

// import * as z from "zod";
// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { LoginSchema } from "@/schemas";
// import { login } from "@/actions/login";
// import { CardWrapper } from "./card-wrapper";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { FormError } from "../form-error";
// import { FormSuccess } from "../form-success";

// const LoginForm = () => {
//   const router = useRouter();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<z.infer<typeof LoginSchema>>({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = (values: z.infer<typeof LoginSchema>) => {
//     setError("");
//     setSuccess("");

//     startTransition(() => {
//       login(values).then((data) => {
//         setError(data?.error);
//         setSuccess(data?.success);

//         if (data?.success) {
//           if (!data.isVerified) {
//             router.push("/verifyStatus");
//           } else {
//             // role-based redirection
//             switch (data.role) {
//               case "ADMIN":
//                 router.push("/admin");
//                 break;
//               case "HIRING_MANAGER":
//                 router.push("/hiringManager");
//                 break;
//               case "RECRUITER":
//                 router.push("/recruiter");
//                 break;
//               case "AUDITOR":
//                 router.push("/auditor");
//                 break;
//               case "CANDIDATE":
//                 router.push("/candidate");
//                 break;
//               default:
//                 router.push("/");
//             }
//           }
//         }
//       });
//     });
//   };

//   return (
//     <CardWrapper
//       headerLabel="Welcome back"
//       backButtonHref="/auth/register"
//       backButtonLable="Don't have an account?"
//       showSocial
//     >
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <div className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="john.doe@example.com"
//                       type="email"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="••••••••"
//                       type="password"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormError message={error} />
//           <FormSuccess message={success} />
//           <Button type="submit" className="w-full" disabled={isPending}>
//             Login
//           </Button>
//         </form>
//       </Form>
//     </CardWrapper>
//   );
// };

// export default LoginForm;

"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "next-auth/react";

import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { validateLogin } from "@/actions/validate-login";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await validateLogin(values);

      if (result.error) {
        setError(result.error);
        return;
      }

      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResponse?.error) {
        setError("Invalid email or password.");
        return;
      }

      setSuccess("Login successful!");

      if (!result.isVerified) {
        router.push("/verifyStatus");
      } else {
        switch (result.role) {
          case "ADMIN":
            router.push("/admin");
            break;
          case "HIRING_MANAGER":
            router.push("/hiringManager");
            break;
          case "RECRUITER":
            router.push("/recruiter");
            break;
          case "AUDITOR":
            router.push("/auditor");
            break;
          case "CANDIDATE":
            router.push("/candidate");
            break;
          default:
            router.push("/");
        }
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/register"
      backButtonLable="Don't have an account?"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="••••••••"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
