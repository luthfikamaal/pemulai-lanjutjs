'use client';

import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiCrossFill, RiXrpFill } from '@remixicon/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { Loader } from 'lucide-react';

const FormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.').max(50, 'Name must be at most 50 characters long.'),
  email: z.string().check(z.email('Please enter a valid email address.')),
  password: z.string().min(6, 'Password must be at least 6 characters long.').max(100, 'Password must be at most 100 characters long.'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match.',
  path: ['passwordConfirm'],
});

export default function FormSignUp() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', name: '', password: '', passwordConfirm: '' },
  });
  const { setError } = form;
  const [loading, setLoading] = useState({ register: false })

  const onSubmit = async () => {
    try {
      setLoading({ register: true });
      await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/sign-up', form.getValues());
      toast.custom((t) => (
        <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>
            Account created successfully! Please check your email to verify your account.
          </AlertTitle>
        </Alert>
      ));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status == 400) {
          const { error: formErrors } = error.response.data as { error: Record<string, string[]> };
          for (const field in formErrors) {
            setError(field as keyof z.infer<typeof FormSchema>, {
              type: 'server',
              message: formErrors[field].join(' '),
            });
          }
          toast.custom((t) => (
            <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
              <AlertIcon>
                <RiXrpFill />
              </AlertIcon>
              <AlertTitle>
                Please fix the errors in the form and try again
              </AlertTitle>
            </Alert>
          ));
        } else {
          toast.custom((t) => (
            <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
              <AlertIcon>
                <RiXrpFill />
              </AlertIcon>
              <AlertTitle>
                An error occurred while submitting the form
              </AlertTitle>
            </Alert>
          ));
        }
      }
    } finally {
      setLoading({ register: false });
    }
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className='max-w-sm mx-auto w-full'>
      <h1 className="text-2xl mb-6 font-bold">
        Create a New Account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password:</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-muted-foreground text-xs">
            By signing up, you agree to our <span className='hover:underline underline-offset-2'>Terms of Service</span> and <span className='hover:underline underline-offset-2'>Privacy Policy</span>.
          </p>
          <div className="flex mt-5 items-center justify-end gap-2.5">
            <Button type="submit" className='w-full' disabled={loading.register}>
              {loading.register && <Loader className='w-4 h-4 animate-spin' />}
              Create Account
            </Button>
          </div>
          <p className='text-center text-sm text-muted-foreground'>
            Already have an account? <Link href={'/sign-in'} className='hover:underline underline-offset-2 font-semibold text-foreground'>Sign In</Link>.
          </p>
        </form>
      </Form>
    </div>
  );
}
