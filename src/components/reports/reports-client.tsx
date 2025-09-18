
'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/context/DataContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Package, PackageOpen } from 'lucide-react';

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
    }).format(new Date(date));
};

const chartConfig = {
  income: {
    label: 'Renda',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Despesas',
    color: 'hsl(var(--chart-2))',
  },
};

export default function ReportsClient() {
  const { transactions, budgets, bills } = useData();

  const chartData = React.useMemo(() => {
    const dataByMonth: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        dataByMonth[month].income += t.amount;
      } else {
        dataByMonth[month].expenses += t.amount;
      }
    });

    return Object.entries(dataByMonth).map(([month, data]) => ({ month, ...data })).reverse();
  }, [transactions]);
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Renda vs. Despesas</CardTitle>
          <CardDescription>Uma análise mensal do seu fluxo de caixa.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value as number)}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={80}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                  indicator='dot'
                />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Status do Orçamento</CardTitle>
          <CardDescription>Seus gastos atuais em relação aos seus orçamentos mensais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((budget) => {
            const progress = (budget.spent / budget.amount) * 100;
            const remaining = budget.amount - budget.spent;
            let progressColor = 'bg-primary'
            if (progress > 75 && progress <= 90) {
              progressColor = 'bg-yellow-500'
            } else if (progress > 90) {
              progressColor = 'bg-red-500'
            }

            return (
              <div key={budget.id}>
                <div className="flex justify-between mb-1 items-end">
                  <span className="font-medium">{budget.category}</span>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}</p>
                    <p className={`text-sm ${remaining < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} excedidos`}
                    </p>
                  </div>
                </div>
                <Progress value={progress} indicatorClassName={progressColor} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Relatório de Contas</CardTitle>
            <CardDescription>Um resumo de suas contas a pagar e receber.</CardDescription>
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bills.map((bill) => {
                        const isPaid = bill.status === 'paid';
                        
                        return (
                            <TableRow key={bill.id} className={cn(isPaid ? 'text-muted-foreground' : '')}>
                                <TableCell>
                                    <Badge variant={isPaid ? 'default' : 'secondary'} className={cn(isPaid && 'bg-green-600')}>
                                        {isPaid ? 'Paga' : 'Pendente'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{bill.description}</TableCell>
                                <TableCell>
                                    {formatDate(bill.dueDate)}
                                </TableCell>
                                <TableCell>
                                   <div className='flex items-center gap-2'>
                                    {bill.type === 'payable' ? <Package className='text-red-500'/> : <PackageOpen className='text-green-500'/>}
                                    <span className="capitalize">{bill.type === 'payable' ? 'A Pagar' : 'A Receber'}</span>
                                   </div>
                                </TableCell>
                                <TableCell className={cn("text-right font-semibold", bill.type === 'payable' ? 'text-red-600' : 'text-green-600' )}>
                                    {formatCurrency(bill.amount)}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
      </CardContent>
    </Card>
    </div>
  );
}
