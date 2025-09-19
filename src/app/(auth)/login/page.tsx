
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Gem, Loader2, User } from 'lucide-react';
import { useAuth, MockUser } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, users } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  const handleLogin = () => {
    if (!selectedUser) {
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Por favor, selecione um usuário para entrar.',
        });
        return;
    }
    setIsLoading(true);
    // Simulating a network request
    setTimeout(() => {
        login(selectedUser); // Set the user in the context
        toast({
          title: 'Login bem-sucedido!',
          description: `Bem-vindo, ${selectedUser.displayName}! Redirecionando para o painel...`,
        });
        router.push('/dashboard');
    }, 500);
  };

  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.uid === userId) || null;
    setSelectedUser(user);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Gem className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold">Acessar Painel</CardTitle>
          <CardDescription>
            Selecione um perfil de usuário para continuar ou cadastre-se.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="user-select">Selecione o Usuário</Label>
                <Select onValueChange={handleUserChange}>
                    <SelectTrigger id="user-select">
                        <SelectValue placeholder="Escolha um perfil..." />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map(user => (
                             <SelectItem key={user.uid} value={user.uid}>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{user.displayName}</span>
                                </div>
                             </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          <Button onClick={handleLogin} className="w-full" disabled={isLoading || !selectedUser}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </Button>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/signup" className="underline">
                    Cadastre-se
                </Link>
            </div>
          <div className="text-center text-sm text-muted-foreground">
            Este é um login simulado para desenvolvimento.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
