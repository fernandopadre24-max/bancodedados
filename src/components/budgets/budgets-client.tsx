'use client'

import React from 'react'
import type { Budget, Category } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { categoryIcons } from '@/lib/icons'
import { suggestRealisticBudgets, SuggestRealisticBudgetsOutput } from '@/ai/flows/suggest-realistic-budgets'
import { Button } from '@/components/ui/button'
import { Wand2, Loader2, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

interface BudgetsClientProps {
  initialBudgets: Budget[]
  historicalSpendingData: Record<string, number>
  income: number
}

export default function BudgetsClient({ initialBudgets, historicalSpendingData, income }: BudgetsClientProps) {
  const [budgets, setBudgets] = React.useState(initialBudgets)
  const [isSuggesting, setIsSuggesting] = React.useState(false)
  const [suggestedBudgets, setSuggestedBudgets] = React.useState<SuggestRealisticBudgetsOutput | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { toast } = useToast();

  const handleSuggestBudgets = async () => {
    setIsSuggesting(true)
    try {
      const suggestions = await suggestRealisticBudgets({
        historicalSpendingData,
        income,
        contextRequests: ['Quero economizar mais dinheiro', 'Leve em conta a inflação'],
      })
      setSuggestedBudgets(suggestions)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('AI suggestion failed:', error)
      toast({
        variant: "destructive",
        title: "Falha na Sugestão de IA",
        description: "Não foi possível obter sugestões de orçamento no momento. Por favor, tente novamente mais tarde.",
      })
    } finally {
      setIsSuggesting(false)
    }
  }

  const applySuggestions = () => {
    if (!suggestedBudgets) return;
    
    const updatedBudgets = budgets.map(budget => {
        const suggestionKey = budget.category.toLowerCase().replace(' ', '');
        if (suggestedBudgets[suggestionKey]) {
            return { ...budget, amount: suggestedBudgets[suggestionKey] };
        }
        return budget;
    });

    setBudgets(updatedBudgets);
    setIsDialogOpen(false);
    setSuggestedBudgets(null);
    toast({
        title: "Orçamentos Atualizados",
        description: "Seus orçamentos foram atualizados com as sugestões da IA.",
    })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleSuggestBudgets} disabled={isSuggesting}>
          {isSuggesting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Sugerir com IA
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const Icon = categoryIcons[budget.category]
          const progress = (budget.spent / budget.amount) * 100
          const remaining = budget.amount - budget.spent
          let progressColor = 'bg-primary'
          if (progress > 75 && progress <= 90) {
            progressColor = 'bg-yellow-500'
          } else if (progress > 90) {
            progressColor = 'bg-red-500'
          }

          return (
            <Card key={budget.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {budget.category}
                  </CardTitle>
                  <CardDescription>
                    {formatCurrency(budget.amount)} / mês
                  </CardDescription>
                </div>
                <div
                  className={`font-semibold ${
                    progress > 90
                      ? 'text-red-600'
                      : progress > 75
                      ? 'text-yellow-600'
                      : 'text-primary'
                  }`}
                >
                  {progress.toFixed(0)}%
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={progress} indicatorClassName={progressColor} />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Gasto: {formatCurrency(budget.spent)}</span>
                  <span>
                    {remaining >= 0
                      ? `Restante: ${formatCurrency(remaining)}`
                      : `Excedido: ${formatCurrency(Math.abs(remaining))}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Wand2 className="text-primary"/> Sugestões de Orçamento com IA
            </DialogTitle>
            <DialogDescription>
              Com base em seus gastos, aqui estão algumas sugestões de orçamento realistas.
            </DialogDescription>
          </DialogHeader>
          {suggestedBudgets && (
             <div className="space-y-4 py-4">
                <Alert>
                    <AlertTitle>Análise de Especialista</AlertTitle>
                    <AlertDescription>
                        Essas sugestões visam equilibrar seu estilo de vida atual, identificando áreas para economia potencial.
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    {Object.entries(suggestedBudgets).map(([category, amount]) => {
                        const originalBudget = budgets.find(b => b.category.toLowerCase().replace(' ', '') === category);
                        const originalAmount = originalBudget ? originalBudget.amount : 0;
                        const difference = amount - originalAmount;
                        return (
                            <div key={category} className="flex justify-between items-center p-2 rounded-md bg-secondary/50">
                                <span className="capitalize font-medium">{category}</span>
                                <div className='text-right'>
                                    <span className="font-bold">{formatCurrency(amount)}</span>
                                    {difference !== 0 && (
                                        <p className={`text-xs ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ({difference > 0 ? '+' : ''}{formatCurrency(difference)})
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
             </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={applySuggestions}>
                <Check className="mr-2 h-4 w-4" />
                Aplicar Sugestões
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
