
'use client'

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { categoryIcons } from "@/lib/icons"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, DollarSign, Repeat, AlertCircle, Package, PackageOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/context/DataContext"
import { SummaryCard } from "./summary-card"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
};

export default function DashboardClient() {
  const dataContext = useData();

  const [clientData, setClientData] = React.useState<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    totalToPay: number;
    totalToReceive: number;
    recentTransactions: any[];
    upcomingBills: any[];
    upcomingSubscriptions: any[];
  } | null>(null);

  React.useEffect(() => {
    if (dataContext) {
      const { transactions, bills, subscriptions } = dataContext;

      const getDaysUntilDueDate = (date: Date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dueDate = new Date(date);
          dueDate.setHours(0, 0, 0, 0);
          const diffTime = dueDate.getTime() - today.getTime();
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };
  
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const balance = totalIncome - totalExpenses;
  
      const pendingBills = bills.filter(b => b.status === 'pending');
      const totalToPay = pendingBills
          .filter(b => b.type === 'payable')
          .reduce((sum, b) => sum + b.amount, 0);
      const totalToReceive = pendingBills
          .filter(b => b.type === 'receivable')
          .reduce((sum, b) => sum + b.amount, 0);
  
      const recentTransactions = transactions.slice(0, 5);
    
      const upcomingBills = bills
        .filter(b => b.status === 'pending')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3)
        .map(bill => ({ ...bill, daysLeft: getDaysUntilDueDate(bill.dueDate) }));
    
      const upcomingSubscriptions = subscriptions
        .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
        .slice(0, 3)
        .map(sub => ({...sub, daysLeft: getDaysUntilDueDate(sub.nextPaymentDate)}));
        
      setClientData({ totalIncome, totalExpenses, balance, totalToPay, totalToReceive, recentTransactions, upcomingBills, upcomingSubscriptions });
    }
  }, [dataContext]);


  if (!dataContext || !clientData) {
    return null;
  }
    
  const { totalIncome, totalExpenses, balance, totalToPay, totalToReceive, recentTransactions, upcomingBills, upcomingSubscriptions } = clientData;
  const { budgets, savingsGoals } = dataContext;


  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <SummaryCard
          title="Saldo Total"
          value={formatCurrency(balance)}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          valueClassName={balance >= 0 ? "text-primary" : "text-red-500"}
          className="lg:col-span-2"
        />
        <SummaryCard
          title="Renda do Mês"
          value={formatCurrency(totalIncome)}
          icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
          valueClassName="text-green-500"
        />
        <SummaryCard
          title="Despesas do Mês"
          value={formatCurrency(totalExpenses)}
          icon={<ArrowDownLeft className="h-5 w-5 text-red-500" />}
          valueClassName="text-red-500"
        />
         <SummaryCard
          title="Total a Pagar"
          value={formatCurrency(totalToPay)}
          icon={<Package className="h-5 w-5 text-red-500" />}
          description="Contas pendentes"
          valueClassName="text-red-500"
        />
        <SummaryCard
          title="Total a Receber"
          value={formatCurrency(totalToReceive)}
          icon={<PackageOpen className="h-5 w-5 text-green-500" />}
          description="Contas pendentes"
          valueClassName="text-green-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Transações Recentes</CardTitle>
            <CardDescription>Suas últimas atividades financeiras.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableBody>
                {recentTransactions.length > 0 ? recentTransactions.map((transaction) => {
                    const Icon = categoryIcons[transaction.category]
                    return (
                        <TableRow key={transaction.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-full">
                                  <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                            className={`text-right font-medium ${
                                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                            }`}
                            >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                            </TableCell>
                        </TableRow>
                    )
                }) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      Nenhuma transação recente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Visão Geral do Orçamento</CardTitle>
                    <CardDescription>Como você está se saindo este mês.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {budgets.length > 0 ? budgets.slice(0,2).map(budget => {
                        const progress = (budget.spent / budget.amount) * 100
                        return (
                            <div key={budget.id}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{budget.category}</span>
                                    <span className="text-sm text-muted-foreground">{formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}</span>
                                </div>
                                <Progress value={progress} />
                            </div>
                        )
                    }) : (
                      <div className="text-center text-muted-foreground py-4">
                        Nenhum orçamento definido.
                      </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Próximas Contas</CardTitle>
                    <CardDescription>Contas que vencem em breve.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {upcomingBills.length > 0 ? upcomingBills.map(bill => {
                        const isSoon = bill.daysLeft <= 7 && bill.daysLeft >= 0;
                        return (
                            <div key={bill.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   {bill.type === 'payable' ? <Package className='text-red-500'/> : <PackageOpen className='text-green-500'/>}
                                    <div>
                                        <p className="font-medium">{bill.description}</p>
                                        <p className={cn("text-sm", isSoon ? "text-amber-500" : "text-muted-foreground")}>
                                            Vence em {formatDate(bill.dueDate)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                            </div>
                        )
                    }) : (
                      <div className="text-center text-muted-foreground py-4">
                        Nenhuma conta próxima.
                      </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Assinaturas Recorrentes</CardTitle>
                    <CardDescription>Seus próximos pagamentos agendados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {upcomingSubscriptions.length > 0 ? upcomingSubscriptions.map(sub => {
                        const isSoon = sub.daysLeft <= 7 && sub.daysLeft >= 0;
                        return (
                            <div key={sub.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary rounded-full">
                                      <Repeat className="h-4 w-4 text-muted-foreground"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{sub.name}</p>
                                        <p className={cn("text-sm", isSoon ? "text-amber-500" : "text-muted-foreground")}>
                                            Vence em {formatDate(sub.nextPaymentDate)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold">{formatCurrency(sub.amount)}</p>
                            </div>
                        )
                    }) : (
                      <div className="text-center text-muted-foreground py-4">
                        Nenhuma assinatura registrada.
                      </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Metas de Poupança</CardTitle>
                    <CardDescription>Seu progresso em direção aos seus objetivos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {savingsGoals.length > 0 ? savingsGoals.slice(0,2).map(goal => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100
                        return (
                            <div key={goal.id}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{goal.name}</span>
                                    <span className="text-sm font-bold text-primary">{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} indicatorClassName="bg-primary" />
                                <div className="text-right text-xs text-muted-foreground mt-1">
                                  {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                                </div>
                            </div>
                        )
                    }) : (
                      <div className="text-center text-muted-foreground py-4">
                        Nenhuma meta de poupança definida.
                      </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
