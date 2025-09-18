// src/ai/flows/suggest-realistic-budgets.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting realistic budget amounts
 * based on user's historical spending data.
 *
 * - suggestRealisticBudgets -  A function that suggests realistic budget amounts for different expense categories.
 * - SuggestRealisticBudgetsInput - The input type for the suggestRealisticBudgets function.
 * - SuggestRealisticBudgetsOutput - The output type for the suggestRealisticBudgets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRealisticBudgetsInputSchema = z.object({
  historicalSpendingData: z.record(z.number()).describe(
    'Um registro de dados históricos de gastos, onde as chaves são as categorias de despesas' +
      ' e os valores são os montantes gastos em cada categoria. Por exemplo: `{comida: 300, transporte: 150}`.'
  ),
  income: z.number().describe('Renda mensal do usuário'),
  contextRequests: z
    .array(z.string())
    .optional()
    .describe(
      'Uma lista opcional de solicitações de contexto do usuário. Por exemplo: `["Eu tenho um bebê", "Eu moro em SP"]`. O agente de IA determinará quanto contexto adicionar para melhorar as sugestões de orçamento.'
    ),
});
export type SuggestRealisticBudgetsInput = z.infer<typeof SuggestRealisticBudgetsInputSchema>;

const SuggestRealisticBudgetsOutputSchema = z.record(z.number()).describe(
  'Um registro de valores de orçamento sugeridos para cada categoria de despesa,' +
    ' com base nos dados históricos de gastos. Por exemplo: `{comida: 350, transporte: 200}`.'
);
export type SuggestRealisticBudgetsOutput = z.infer<typeof SuggestRealisticBudgetsOutputSchema>;

export async function suggestRealisticBudgets(
  input: SuggestRealisticBudgetsInput
): Promise<SuggestRealisticBudgetsOutput> {
  return suggestRealisticBudgetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRealisticBudgetsPrompt',
  input: {schema: SuggestRealisticBudgetsInputSchema},
  output: {schema: SuggestRealisticBudgetsOutputSchema},
  prompt: `Você é um especialista em finanças pessoais. Com base nos dados históricos de gastos do usuário,
  sugira valores de orçamento mensais realistas para cada categoria de despesa. Considere a renda mensal do usuário
  ao fazer suas sugestões. As sugestões devem estar alinhadas com a renda e os hábitos de consumo do usuário. Retorne um objeto JSON com as categorias de despesa como chaves e os valores do orçamento como valores.

Dados Históricos de Gastos:
{{#each historicalSpendingData}}
- {{this.[0]}}: {{this.[1]}}
{{/each}}

Renda Mensal: {{{income}}}

Solicitações de Contexto:
{{#each contextRequests}}- {{{this}}}
{{/each}}

Forneça a saída como um objeto JSON com categorias de despesa como chaves e valores de orçamento sugeridos como valores.
  {
    "categoria1": valor1,
    "categoria2": valor2,
    ...
  }`,
});

const suggestRealisticBudgetsFlow = ai.defineFlow(
  {
    name: 'suggestRealisticBudgetsFlow',
    inputSchema: SuggestRealisticBudgetsInputSchema,
    outputSchema: SuggestRealisticBudgetsOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      historicalSpendingData: Object.entries(input.historicalSpendingData)
    });
    return output!;
  }
);
