
'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { SavingsGoal } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlusCircle, Target, Pencil, Trash2, PiggyBank, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useData } from '@/context/DataContext';

const goalSchema = z.object({
  name: z.string().min(1, 'O nome da meta é obrigatório'),
  targetAmount: z.coerce.number().positive('O valor alvo deve ser positivo'),
  currentAmount: z.coerce.number().min(0, 'O valor atual não pode ser negativo').optional().default(0),
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export default function SavingsClient() {
  const { savingsGoals, addSavingsGoal, deleteSavingsGoal, updateSavingsGoal } = useData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<SavingsGoal | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
  });

  React.useEffect(() => {
    if (editingGoal) {
      form.reset({
        name: editingGoal.name,
        targetAmount: editingGoal.targetAmount,
        currentAmount: editingGoal.currentAmount,
      });
    } else {
      form.reset({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
      });
    }
  }, [editingGoal, form]);

  function onSubmit(values: z.infer<typeof goalSchema>) {
    if (editingGoal) {
      updateSavingsGoal({ ...editingGoal, ...values });
      toast({
        title: "Meta Atualizada",
        description: `Sua meta "${values.name}" foi atualizada.`,
      });
    } else {
      addSavingsGoal(values);
      toast({
          title: "Meta Adicionada",
          description: `Sua nova meta de poupança "${values.name}" foi criada.`,
      });
    }
    form.reset();
    setIsDialogOpen(false);
    setEditingGoal(null);
  }

  function handleDeleteGoal(goalId: string) {
    deleteSavingsGoal(goalId);
    toast({
        title: "Meta Removida",
        description: "A meta de poupança foi removida com sucesso.",
        variant: 'destructive',
    });
  }

  function handleOpenDialog(goal?: SavingsGoal) {
    setEditingGoal(goal || null);
    setIsDialogOpen(true);
  }


  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Meta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savingsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const isCompleted = progress >= 100;
          return (
            <Card key={goal.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className='flex-1'>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {goal.name}
                  </CardTitle>
                  <CardDescription>
                    Meta: {formatCurrency(goal.targetAmount)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(goal)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Apagar</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso removerá permanentemente a meta de poupança.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteGoal(goal.id)}>
                                    Apagar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3" indicatorClassName={isCompleted ? 'bg-green-500' : 'bg-primary'} />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="font-medium text-primary">
                    {formatCurrency(goal.currentAmount)}
                  </span>
                  <span className="font-semibold text-muted-foreground">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </CardContent>
              {isCompleted && (
                <CardFooter>
                    <p className='text-sm text-green-500 flex items-center gap-2'>
                        <Check className='h-4 w-4'/>
                        Meta Concluída!
                    </p>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingGoal ? 'Editar Meta' : 'Nova Meta de Poupança'}</DialogTitle>
              <DialogDescription>
                {editingGoal ? 'Atualize os detalhes da sua meta.' : 'Defina uma nova meta para a qual você deseja economizar.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Meta</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Viagem para o Japão" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Alvo</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Atual (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">{editingGoal ? 'Salvar Alterações' : 'Criar Meta'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
    </>
  );
}
