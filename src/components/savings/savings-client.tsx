'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { SavingsGoal } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlusCircle, Target } from 'lucide-react';
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

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.coerce.number().positive('Target amount must be positive'),
  currentAmount: z.coerce.number().min(0, 'Current amount cannot be negative').optional().default(0),
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function SavingsClient({ initialGoals }: { initialGoals: SavingsGoal[] }) {
  const [goals, setGoals] = React.useState(initialGoals);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
  });

  function onSubmit(values: z.infer<typeof goalSchema>) {
    const newGoal: SavingsGoal = {
      id: (goals.length + 1).toString(),
      ...values,
    };
    setGoals([...goals, newGoal]);
    toast({
        title: "Goal Added",
        description: `Your new savings goal "${values.name}" has been created.`,
    })
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Savings Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Savings Goal</DialogTitle>
              <DialogDescription>
                Define a new goal you want to save up for.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vacation to Japan" {...field} />
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
                      <FormLabel>Target Amount</FormLabel>
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
                      <FormLabel>Current Amount (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Goal</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {goal.name}
                </CardTitle>
                <CardDescription>
                  Target: {formatCurrency(goal.targetAmount)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="font-medium text-primary">
                    {formatCurrency(goal.currentAmount)}
                  </span>
                  <span className="font-semibold text-muted-foreground">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
