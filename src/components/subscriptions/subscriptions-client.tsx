'use client'

import React from 'react';
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
import { AlertCircle } from 'lucide-react';

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

export default function SubscriptionsClient({ initialSubscriptions }: { initialSubscriptions: Subscription[] }) {
  const [subscriptions, setSubscriptions] = React.useState(initialSubscriptions);

  const getDaysUntilNextPayment = (date: Date) => {
    const today = new Date();
    const nextPayment = new Date(date);
    const diffTime = nextPayment.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  return (
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptions.map((sub) => {
                        const daysLeft = getDaysUntilNextPayment(sub.nextPaymentDate);
                        const isSoon = daysLeft <= 7 && daysLeft > 0;
                        return (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">{sub.name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize">{sub.billingCycle}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {isSoon && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                        <span className={isSoon ? 'font-semibold text-yellow-600' : ''}>
                                            {formatDate(sub.nextPaymentDate)}
                                        </span>
                                    </div>
                                    {isSoon && <p className="text-xs text-muted-foreground">{daysLeft} dias restantes</p>}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {formatCurrency(sub.amount)}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
      </CardContent>
    </Card>
  );
}
