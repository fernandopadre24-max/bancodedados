
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Camera, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'


export default function ProfileClient() {
  const { user } = useAuth();
  const { toast } = useToast()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setAvatarPreview(user.photoURL || null);
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth.currentUser) return;

    setIsLoading(true);
    try {
        // Here you would typically upload the avatarPreview to a storage service
        // (like Firebase Storage) and get a public URL.
        // For this example, we'll assume the base64 string is the URL.
        // In a real app, replace `avatarPreview` with the uploaded image URL.
        await updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: avatarPreview,
        });

        toast({
            title: "Perfil Atualizado",
            description: "Suas informações foram salvas com sucesso.",
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: "Erro ao Atualizar",
            description: "Não foi possível salvar suas alterações. Tente novamente.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas Informações</CardTitle>
        <CardDescription>Atualize seu nome, e-mail e foto de perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={avatarPreview ?? undefined} alt="User Avatar" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 flex items-center justify-center h-8 w-8 bg-primary rounded-full text-primary-foreground cursor-pointer" onClick={handleAvatarClick}>
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
             <Button type="button" variant="outline" onClick={handleAvatarClick}>
              Trocar Foto
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} disabled />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
