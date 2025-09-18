
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Gem, Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  username: z.string().min(1, 'Por favor, insira um nome de usuário.'),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    // This is a mock implementation.
    setTimeout(() => {
        setIsEmailSent(true);
        toast({
            title: 'Link enviado!',
            description: 'Se a recuperação de senha estivesse habilitada, um link seria enviado.',
        });
        setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Gem className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold">Esqueceu sua Senha?</CardTitle>
          <CardDescription>
            {isEmailSent
              ? 'Um link para redefinir sua senha foi enviado (simulação).'
              : 'Insira seu nome de usuário para receber um link de redefinição de senha.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isEmailSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu.usuario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Enviar Link'}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center text-sm text-green-600 bg-green-50 p-4 rounded-md">
                Verifique sua caixa de entrada.
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm text-muted-foreground w-full">
            Lembrou da senha?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
