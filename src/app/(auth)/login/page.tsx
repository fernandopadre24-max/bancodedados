
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
import { Gem, Loader2, User, KeyRound } from 'lucide-react';
import { useAuth, MockUser } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, users } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    setIsLoading(true);
    // Simulating a network request
    setTimeout(() => {
        const user = users.find(u => u.displayName === username && u.password === password);
        if (user) {
            login(user);
            toast({
              title: 'Login bem-sucedido!',
              description: `Bem-vindo, ${user.displayName}! Redirecionando para o painel...`,
            });
            router.push('/dashboard');
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro de Login',
                description: 'Nome de usuário ou senha inválidos.',
            });
            setIsLoading(false);
        }
    }, 500);
  };

  const handleSelectLogin = () => {
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
            Entre com um usuário e senha ou selecione um perfil de exemplo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input id="username" placeholder="Seu nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                </span>
            </div>
          </div>
            
          <div className="space-y-2">
            <Label htmlFor="user-select">Perfis de Exemplo</Label>
                <div className='flex gap-2'>
                    <Select onValueChange={handleUserChange}>
                        <SelectTrigger id="user-select">
                            <SelectValue placeholder="Escolha um perfil..." />
                        </SelectTrigger>
                        <SelectContent>
                            {users.filter(u => u.isExample).map(user => (
                                 <SelectItem key={user.uid} value={user.uid}>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{user.displayName}</span>
                                    </div>
                                 </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSelectLogin} disabled={isLoading || !selectedUser} variant='secondary'>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                    </Button>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/signup" className="underline">
                    Cadastre-se
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
