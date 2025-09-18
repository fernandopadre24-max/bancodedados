
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
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
  const { transactions, budgets } = useData();

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
    </div>
  );
}
