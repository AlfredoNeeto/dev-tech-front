import { z } from "zod";

export const filtersSchema = z.object({
  stacks: z.array(z.string()),
  states: z.array(z.string()),
  seniorities: z.array(z.string()),
  modalities: z.array(z.string()),
  periods: z.array(z.number()),
});
