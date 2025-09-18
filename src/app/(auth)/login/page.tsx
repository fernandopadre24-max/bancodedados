
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  username: z.string().min(1, 'Por favor, insira um nome de usuário.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    // Simulating a network request
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'admin') {
        login(); // Set the user in the context
        toast({
          title: 'Login bem-sucedido!',
          description: 'Redirecionando para o painel...',
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no Login',
          description: 'As credenciais fornecidas estão incorretas. Por favor, tente novamente.',
        });
        setIsLoading(false);
      }
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Gem className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Faça login para acessar seu painel financeiro.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        placeholder="admin"
                        {...field}
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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link
              href="/forgot-password"
              className="underline underline-offset-4 hover:text-primary"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Ainda não tem uma conta?{' '}
            <Link
              href="/signup"
              className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
