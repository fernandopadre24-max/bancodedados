
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
import type { Transaction, Bill, Subscription } from "@/lib/types"

interface DashboardClientProps {}

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

const getDaysUntilDueDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function DashboardClient({}: DashboardClientProps) {
  const { transactions, budgets, savingsGoals, subscriptions, bills } = useData();

  const [clientData, setClientData] = React.useState<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    totalToPay: number;
    totalToReceive: number;
    recentTransactions: Transaction[];
    upcomingBills: Bill[];
    upcomingSubscriptions: Subscription[];
  } | null>(null);

  React.useEffect(() => {
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
      .slice(0, 3);
  
    const upcomingSubscriptions = subscriptions
      .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
      .slice(0, 3);
      
    setClientData({ totalIncome, totalExpenses, balance, totalToPay, totalToReceive, recentTransactions, upcomingBills, upcomingSubscriptions });

  }, [transactions, bills, subscriptions]);

  if (!clientData) {
    return <div className="grid gap-6"></div>; // Or a loading skeleton
  }

  const { totalIncome, totalExpenses, balance, totalToPay, totalToReceive, recentTransactions, upcomingBills, upcomingSubscriptions } = clientData;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <SummaryCard
          title="Saldo Total"
          value={formatCurrency(balance)}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          valueClassName="text-primary"
          className="lg:col-span-2"
        />
        <SummaryCard
          title="Renda do Mês"
          value={formatCurrency(totalIncome)}
          icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
          valueClassName="text-green-600"
        />
        <SummaryCard
          title="Despesas do Mês"
          value={formatCurrency(totalExpenses)}
          icon={<ArrowDownLeft className="h-5 w-5 text-red-500" />}
          valueClassName="text-red-600"
        />
         <SummaryCard
          title="Total a Pagar"
          value={formatCurrency(totalToPay)}
          icon={<Package className="h-5 w-5 text-red-500" />}
          description="Contas pendentes"
          valueClassName="text-red-600"
        />
        <SummaryCard
          title="Total a Receber"
          value={formatCurrency(totalToReceive)}
          icon={<PackageOpen className="h-5 w-5 text-green-500" />}
          description="Contas pendentes"
          valueClassName="text-green-600"
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
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => {
                    const Icon = categoryIcons[transaction.category]
                    return (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                                    <Icon className="h-3 w-3" />
                                    {transaction.category}
                                </Badge>
                            </TableCell>
                            <TableCell
                            className={`text-right font-medium ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                            >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                            </TableCell>
                        </TableRow>
                    )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Visão Geral do Orçamento</CardTitle>
                    <CardDescription>Como você está se saindo em relação aos seus orçamentos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {budgets.slice(0,2).map(budget => {
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
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Próximas Contas</CardTitle>
                    <CardDescription>Suas contas a pagar e receber que vencem em breve.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {upcomingBills.map(bill => {
                        const daysLeft = getDaysUntilDueDate(bill.dueDate);
                        const isSoon = daysLeft <= 7 && daysLeft >= 0;
                        return (
                            <div key={bill.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   {bill.type === 'payable' ? <Package className='text-red-500'/> : <PackageOpen className='text-green-500'/>}
                                    <div>
                                        <p className="font-medium">{bill.description}</p>
                                        <p className={cn("text-sm", isSoon ? "text-yellow-600" : "text-muted-foreground")}>
                                            Vence em {formatDate(bill.dueDate)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Assinaturas Recorrentes</CardTitle>
                    <CardDescription>Seus próximos pagamentos agendados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {upcomingSubscriptions.map(sub => {
                        const daysLeft = getDaysUntilDueDate(sub.nextPaymentDate);
                        const isSoon = daysLeft <= 7 && daysLeft >= 0;
                        return (
                            <div key={sub.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isSoon && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                                    <div>
                                        <p className="font-medium">{sub.name}</p>
                                        <p className={cn("text-sm", isSoon ? "text-yellow-600" : "text-muted-foreground")}>
                                            Vence em {formatDate(sub.nextPaymentDate)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold">{formatCurrency(sub.amount)}</p>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Metas de Poupança</CardTitle>
                    <CardDescription>Seu progresso em direção aos seus objetivos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {savingsGoals.slice(0,2).map(goal => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100
                        return (
                            <div key={goal.id}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{goal.name}</span>
                                    <span className="text-sm font-bold text-primary">{formatCurrency(goal.currentAmount)}</span>
                                </div>
                                <Progress value={progress} indicatorClassName="bg-primary" />
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
