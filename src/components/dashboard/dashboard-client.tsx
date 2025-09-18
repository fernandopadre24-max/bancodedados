'use client'

import React from "react"
import type { Transaction, Budget, SavingsGoal } from "@/lib/types"
import { SummaryCard } from "./summary-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { categoryIcons } from "@/lib/icons"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, DollarSign, PiggyBank } from "lucide-react"

interface DashboardClientProps {
  transactions: Transaction[]
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function DashboardClient({ transactions, budgets, savingsGoals }: DashboardClientProps) {
  const { totalIncome, totalExpenses, balance } = React.useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const balance = totalIncome - totalExpenses
    return { totalIncome, totalExpenses, balance }
  }, [transactions])

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(balance)}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          valueClassName="text-primary"
        />
        <SummaryCard
          title="Month's Income"
          value={formatCurrency(totalIncome)}
          icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
          valueClassName="text-green-600"
        />
        <SummaryCard
          title="Month's Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<ArrowDownLeft className="h-5 w-5 text-red-500" />}
          valueClassName="text-red-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
                    <CardTitle className="font-headline">Budget Overview</CardTitle>
                    <CardDescription>How you're tracking against your budgets.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {budgets.slice(0,3).map(budget => {
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
                    <CardTitle className="font-headline">Savings Goals</CardTitle>
                    <CardDescription>Your progress towards your goals.</CardDescription>
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

// Add this to Progress component to allow custom indicator color
declare module "@/components/ui/progress" {
    interface ProgressProps {
        indicatorClassName?: string
    }
}
