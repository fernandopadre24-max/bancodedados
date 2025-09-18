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
    'A record of historical spending data, where keys are expense categories' + // keep
      ' and values are the amounts spent in each category. For example: `{food: 300, transportation: 150}`.'
  ),
  income: z.number().describe('Monthly income of the user'),
  contextRequests: z
    .array(z.string())
    .optional()
    .describe(
      'An optional list of user requests of context. For example: `["I have a baby", "I live in NYC"]`.  The AI agent will determine how much of the context to add in order to improve budget suggestions.'
    ),
});
export type SuggestRealisticBudgetsInput = z.infer<typeof SuggestRealisticBudgetsInputSchema>;

const SuggestRealisticBudgetsOutputSchema = z.record(z.number()).describe(
  'A record of suggested budget amounts for each expense category,' + // keep
    ' based on the historical spending data.  For example: `{food: 350, transportation: 200}`.'
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
  prompt: `You are a personal finance expert. Based on the user's historical spending data,
  suggest realistic monthly budget amounts for each expense category. Consider the user's monthly income
  when making your suggestions. The suggestions should align with the user's income and spending habits. Return a JSON object with expense categories as keys and the budget amounts as values.

Historical Spending Data: {{{historicalSpendingData}}}
Monthly Income: {{{income}}}

Context Requests:
{{#each contextRequests}}- {{{this}}}
{{/each}}

Provide the output as a JSON object with expense categories as keys and suggested budget amounts as values.
  {
    "category1": amount1,
    "category2": amount2,
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
    const {output} = await prompt(input);
    return output!;
  }
);
