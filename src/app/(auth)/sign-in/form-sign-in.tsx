'use client';

import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { X } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().check(z.email('Please enter a valid email address.')),
  password: z.string().min(6, 'Password must be at least 6 characters long.').max(100, 'Password must be at most 100 characters long.'),
});

export default function FormSignIn() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '' },
  });
  const [loading, setLoading] = useState({ sigIn: false });
  const router = useRouter();
  const message = useSearchParams().get('m');

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        toast.error(message);
      }, 0);
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading({ ...loading, sigIn: true });
      // console.log(data.email, data.password);
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.status !== 200) {
        toast.error('Invalid email or password.');
        return;
      }
      toast.success('Successfully signed in!');
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({ ...loading, sigIn: false });
    }
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className='max-w-sm mx-auto w-full'>
      <h1 className="text-2xl mb-6 font-bold">
        Sign In to Your Account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address:</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" {...field} />
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
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex mt-5 items-center justify-end gap-2.5">
            <Button type="submit" className='w-full'>
              Sign In
            </Button>
          </div>
          <p className='text-center text-sm text-muted-foreground'>
            Don't have an account? <Link href={'/sign-up'} className='hover:underline underline-offset-2 font-semibold text-foreground'>Sign Up</Link>.
          </p>
        </form>
      </Form>
    </div>
  );
}
