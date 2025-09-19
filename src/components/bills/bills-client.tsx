
'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Bill } from '@/lib/types';
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
import { AlertCircle, CheckCircle2, Pencil, Trash2, PlusCircle, CalendarIcon, Package, PackageOpen } from 'lucide-react';
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


const billSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  dueDate: z.date({ required_error: 'A data de vencimento é obrigatória.'}),
  type: z.enum(['payable', 'receivable'], { required_error: 'O tipo é obrigatório.' }),
  installments: z.coerce.number().int().min(1).optional().default(1),
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

export default function BillsClient() {
  const { bills, addBill, updateBill, deleteBill } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const [billStatus, setBillStatus] = React.useState<Record<string, { daysLeft: number | null }>>({});

  const form = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
    defaultValues: {
        description: '',
        amount: 0,
        dueDate: new Date(),
        type: 'payable',
        installments: 1
    }
  });

  React.useEffect(() => {
    const getDaysUntilDueDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(date);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    
    const newStatus: Record<string, { daysLeft: number | null }> = {};
    bills.forEach(bill => {
        newStatus[bill.id] = { daysLeft: getDaysUntilDueDate(bill.dueDate) };
    });
    setBillStatus(newStatus);
  }, [bills]);
  
  function onAddSubmit(values: z.infer<typeof billSchema>) {
    const newBill: Omit<Bill, 'id'> = {
        description: values.description,
        amount: values.amount,
        dueDate: values.dueDate,
        type: values.type,
        status: 'pending',
    };
    if (values.installments && values.installments > 1) {
        newBill.installments = { current: 1, total: values.installments };
    }
    
    addBill(newBill);
    toast({
        title: "Conta Adicionada",
        description: `A conta "${values.description}" foi adicionada.`,
    });
    setIsAddDialogOpen(false);
    form.reset();
  }

  function handleDeleteBill(billId: string) {
    deleteBill(billId);
    toast({
        title: "Conta Removida",
        description: "A conta foi removida com sucesso.",
    });
  }

  function handleMarkAsPaid(bill: Bill) {
    updateBill({ ...bill, status: 'paid' });
    toast({
      title: 'Conta Paga!',
      description: `${bill.description} foi marcada como paga.`,
    });
  }

  const renderForm = (submitHandler: (values: z.infer<typeof billSchema>) => void) => (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                <Input placeholder="ex: Fatura do cartão" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor Total</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.01" placeholder="150,00" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="installments"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Parcelas</FormLabel>
                    <FormControl>
                    <Input type="number" step="1" min="1" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="payable">A Pagar</SelectItem>
                        <SelectItem value="receivable">A Receber</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button type="submit">Criar Conta</Button>
        </DialogFooter>
        </form>
    </Form>
  )

  return (
    <>
    <div className="flex justify-end mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
            <Button onClick={() => { form.reset(); setIsAddDialogOpen(true)}}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Conta
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nova Conta</DialogTitle>
                    <DialogDescription>
                    Registre uma nova conta a pagar ou a receber.
                    </DialogDescription>
                </DialogHeader>
                {renderForm(onAddSubmit)}
            </DialogContent>
        </Dialog>
    </div>
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">Suas Contas</CardTitle>
            <CardDescription>Uma lista de suas contas a pagar e receber.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bills.map((bill) => {
                        const status = billStatus[bill.id];
                        const daysLeft = status?.daysLeft;
                        const isSoon = daysLeft !== null && daysLeft !== undefined && daysLeft <= 7 && daysLeft >= 0;
                        const isPast = daysLeft !== null && daysLeft !== undefined && daysLeft < 0;
                        const isPaid = bill.status === 'paid';
                        
                        return (
                            <TableRow key={bill.id} className={cn(isPaid ? 'bg-green-500/10' : isPast ? 'bg-red-500/10' : '')}>
                                <TableCell>
                                    <Badge variant={isPaid ? 'default' : 'secondary'} className={cn(isPaid && 'bg-green-600', isPast && !isPaid && 'bg-red-600 text-white')}>
                                        {isPaid ? 'Paga' : 'Pendente'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{bill.description}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {isSoon && !isPaid && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                        <span className={cn(isSoon && !isPaid && 'font-semibold text-yellow-600', isPast && !isPaid && 'font-semibold text-red-600')}>
                                            {formatDate(bill.dueDate)}
                                        </span>
                                    </div>
                                    {daysLeft !== null && daysLeft !== undefined && isSoon && !isPaid && <p className="text-xs text-muted-foreground">{daysLeft} dias restantes</p>}
                                    {daysLeft !== null && daysLeft !== undefined && isPast && !isPaid && <p className="text-xs text-red-500 font-medium">Vencido</p>}
                                </TableCell>
                                <TableCell>
                                   <div className='flex items-center gap-2'>
                                    {bill.type === 'payable' ? <Package className='text-red-500'/> : <PackageOpen className='text-green-500'/>}
                                    <span className="capitalize">{bill.type === 'payable' ? 'A Pagar' : 'A Receber'}</span>
                                   </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {formatCurrency(bill.amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        {!isPaid && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={() => handleMarkAsPaid(bill)}>
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span className="sr-only">Marcar como pago</span>
                                            </Button>
                                        )}
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
                                                        Essa ação não pode ser desfeita. Isso removerá permanentemente a conta.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteBill(bill.id)}>
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
    </>
  );
}

    