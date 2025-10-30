'use client';

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Logout() {
  const router = useRouter();
  return <>
    <Button onClick={async () => {
      await signOut({
        redirect: false
      });
      toast.success('Successfully signed out');
      router.push('/sign-in');
    }} variant={'destructive'}>
      Sign Out
    </Button>
  </>
}