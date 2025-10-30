import { Metadata } from "next";
import FormSignUp from "./form-sign-up";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function Page() {
  return <>
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-4">
        <FormSignUp />
      </div>
      <div className="hidden md:block py-4 pr-4 min-h-screen overflow-hidden">
        <div className="h-full w-full rounded-lg bg-foreground"></div>
      </div>
    </div>
  </>
}