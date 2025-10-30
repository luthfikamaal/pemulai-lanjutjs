import Logout from "@/components/logout";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/config/nextauth";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  const session = await getAuthSession();
  return (
    <>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-lg font-semibold mb-2">Hi, {session?.user?.name}!</h1>
        <Logout />
      </div>
    </>
  );
}
