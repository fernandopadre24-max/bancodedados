
'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Subscription } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Pencil, Trash2, PlusCircle, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useData } from '@/context/DataContext';


const subscriptionSchema = z.object({
  name: z.string().min(1, 'O nome da assinatura é obrigatório.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  billingCycle: z.enum(['mensal', 'anual'], { required_error: 'O ciclo de cobrança é obrigatório.'}),
  nextPaymentDate: z.date({ required_error: 'A data do próximo pagamento é obrigatória.'}),
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function SubscriptionsClient() {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingSubscription, setEditingSubscription] = React.useState<Subscription | null>(null);
  const { toast } = useToast();
  const [subStatus, setSubStatus] = React.useState<Record<string, { daysLeft: number | null }>>({});

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
  });

  React.useEffect(() => {
    const getDaysUntilNextPayment = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextPayment = new Date(date);
        nextPayment.setHours(0, 0, 0, 0);
        const diffTime = nextPayment.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const newStatus: Record<string, { daysLeft: number | null }> = {};
    subscriptions.forEach(sub => {
        newStatus[sub.id] = { daysLeft: getDaysUntilNextPayment(sub.nextPaymentDate) };
    });
    setSubStatus(newStatus);
  }, [subscriptions]);
  
  React.useEffect(() => {
    if (isEditDialogOpen && editingSubscription) {
        form.reset({
            name: editingSubscription.name,
            amount: editingSubscription.amount,
            billingCycle: editingSubscription.billingCycle,
            nextPaymentDate: new Date(editingSubscription.nextPaymentDate)
        });
    } else {
        form.reset({ name: '', amount: 0, billingCycle: 'mensal', nextPaymentDate: new Date()});
    }
  }, [isEditDialogOpen, editingSubscription, form]);

  function handleOpenEditDialog(subscription: Subscription) {
    setEditingSubscription(subscription);
    setIsEditDialogOpen(true);
  }

  function handleCloseDialogs() {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingSubscription(null);
    form.reset();
  }

  function onAddSubmit(values: z.infer<typeof subscriptionSchema>) {
    addSubscription(values);
    toast({
        title: "Assinatura Adicionada",
        description: `A assinatura "${values.name}" foi adicionada com sucesso.`,
    });
    handleCloseDialogs();
  }
  
  function onEditSubmit(values: z.infer<typeof subscriptionSchema>) {
    if (!editingSubscription) return;

    const updatedSub: Subscription = {
        ...editingSubscription,
        ...values,
    };
    updateSubscription(updatedSub);
    toast({
        title: "Assinatura Atualizada",
        description: `A assinatura "${values.name}" foi atualizada com sucesso.`,
    });
    handleCloseDialogs();
  }


  function handleDeleteSubscription(subscriptionId: string) {
    deleteSubscription(subscriptionId);
    toast({
        title: "Assinatura Removida",
        description: "A assinatura foi removida com sucesso.",
    });
  }
  
  const renderForm = (submitHandler: (values: z.infer<typeof subscriptionSchema>) => void) => (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                <Input placeholder="ex: Netflix" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                <Input type="number" step="0.01" placeholder="15,99" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Ciclo de Cobrança</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="nextPaymentDate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Próximo Pagamento</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                            ) : (
                                <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                            }
                            initialFocus
                            locale={ptBR}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialogs}>Cancelar</Button>
            <Button type="submit">{editingSubscription ? 'Salvar Alterações' : 'Criar Assinatura'}</Button>
        </DialogFooter>
        </form>
    </Form>
  )

  return (
    <>
    <div className="flex justify-end mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { if (!open) handleCloseDialogs(); setIsAddDialogOpen(open) }}>
            <DialogTrigger asChild>
            <Button onClick={() => { setEditingSubscription(null); form.reset({ name: '', amount: 0, billingCycle: 'mensal', nextPaymentDate: new Date()}); setIsAddDialogOpen(true)}}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Assinatura
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nova Assinatura</DialogTitle>
                    <DialogDescription>
                    Registre um novo pagamento recorrente.
                    </DialogDescription>
                </DialogHeader>
                {renderForm(onAddSubmit)}
            </DialogContent>
        </Dialog>
    </div>
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">Suas Assinaturas</CardTitle>
            <CardDescription>Uma lista de todas as suas assinaturas recorrentes e suas próximas datas de cobrança.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ciclo de Cobrança</TableHead>
                    <TableHead>Próximo Pagamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptions.map((sub) => {
                        const status = subStatus[sub.id];
                        const daysLeft = status?.daysLeft;
                        const isSoon = daysLeft !== null && daysLeft !== undefined && daysLeft <= 7 && daysLeft >= 0;
                        const isPast = daysLeft !== null && daysLeft !== undefined && daysLeft < 0;
                        return (
                            <TableRow key={sub.id} className={isPast ? 'bg-red-500/10' : ''}>
                                <TableCell className="font-medium">{sub.name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize">{sub.billingCycle}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {isSoon && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                        <span className={cn(isSoon && 'font-semibold text-yellow-600', isPast && 'font-semibold text-red-600')}>
                                            {formatDate(sub.nextPaymentDate)}
                                        </span>
                                    </div>
                                    {daysLeft !== null && daysLeft !== undefined && isSoon && <p className="text-xs text-muted-foreground">{daysLeft} dias restantes</p>}
                                    {daysLeft !== null && daysLeft !== undefined && isPast && <p className="text-xs text-red-500 font-medium">Vencido</p>}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {formatCurrency(sub.amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditDialog(sub)}>
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Editar</span>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Apagar</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Essa ação não pode ser desfeita. Isso removerá permanentemente a assinatura.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteSubscription(sub.id)}>
                                                        Apagar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
      </CardContent>
    </Card>

    <Dialog open={isEditDialogOpen} onOpenChange={(open) => { if (!open) handleCloseDialogs(); setIsEditDialogOpen(open) }}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Editar Assinatura</DialogTitle>
                <DialogDescription>
                    Atualize os detalhes da sua assinatura.
                </DialogDescription>
            </DialogHeader>
            {renderForm(onEditSubmit)}
        </DialogContent>
    </Dialog>
    </>
  );
}

    