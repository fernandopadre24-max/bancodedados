'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Palette, Bell, CreditCard, Lock, AppWindow } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useAppContext } from '@/context/AppContext'
import { Input } from '../ui/input'

export default function SettingsClient() {
  const [theme, setTheme] = React.useState('system')
  const { appTitle, setAppTitle } = useAppContext();

  React.useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        if(systemTheme === 'dark') root.classList.add('dark')
        else root.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppWindow className="h-5 w-5" />
            Aplicativo
          </CardTitle>
          <CardDescription>
            Personalize as configurações gerais do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="app-title">Título do Aplicativo</Label>
            <Input 
                id="app-title"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                className="w-[180px]"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aparência
          </CardTitle>
          <CardDescription>
            Personalize a aparência do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Tema</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Escolha como você recebe as notificações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Notificações por E-mail</Label>
              <p className='text-sm text-muted-foreground'>Receba um resumo semanal de suas finanças.</p>
            </div>
            <Switch id="email-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
             <div>
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className='text-sm text-muted-foreground'>Receba alertas sobre pagamentos e orçamentos.</p>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Segurança e Privacidade
          </CardTitle>
          <CardDescription>
            Gerencie as configurações de segurança da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <Label htmlFor="currency">Alterar Senha</Label>
            <Button variant="outline">Alterar</Button>
          </div>
          <Separator />
           <div className="flex items-center justify-between">
            <Label htmlFor="currency">Autenticação de Dois Fatores (2FA)</Label>
            <Button variant="outline">Ativar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Preferências Financeiras
          </CardTitle>
          <CardDescription>
            Ajuste as configurações relacionadas às suas finanças.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="currency">Moeda Padrão</Label>
            <Select defaultValue="BRL">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">BRL (R$)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
