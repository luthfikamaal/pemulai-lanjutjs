import { Metadata } from "next";
import FormSignIn from "./form-sign-in";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

export default function Page() {
  return <>
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-4">
        <FormSignIn />
      </div>
      <div className="hidden md:block py-4 pr-4 min-h-screen overflow-hidden">
        <div className="h-full w-full rounded-lg bg-foreground"></div>
      </div>
    </div>
  </>
}