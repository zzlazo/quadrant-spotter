import { z } from 'zod'

const QuadrantSchema = z.object({
    id: z.number(),
    name: z.string(),
    xLabel: z.string(),
    yLabel: z.string()
});

export type Quadrant = z.infer<typeof QuadrantSchema>;

const SpotSchema = z.object({
    id: z.number(),
    name: z.string(),
    x: z.int(),
    y: z.int()
});

export type Spot = z.infer<typeof SpotSchema>;
