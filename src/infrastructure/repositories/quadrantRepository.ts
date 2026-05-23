import type { Quadrant, Spot } from "@/infrastructure/models/quadrantModels";

export interface QuadrantRepository {
	findAllQuadrants(): Promise<Quadrant[]>;

	insertQuadrant(name: string, xLabel: string, yLabel: string): Promise<number>;

	updateQuadrant(
		id: number,
		name?: string,
		xLabel?: string,
		yLabel?: string,
	): Promise<void>;

	deleteQuadrant(id: number): Promise<void>;

	findSpots(quadrantId: number): Promise<Spot[]>;

	insertSpot(
		quadrantId: number,
		name: string,
		x: number,
		y: number,
	): Promise<number>;

	updateSpot(id: number, name?: string, x?: number, y?: number): Promise<void>;

	deleteSpot(id: number): Promise<void>;
}
