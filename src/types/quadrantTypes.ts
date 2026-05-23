import type { Quadrant, Spot } from "@/infrastructure/models/quadrantModels";
import type { QuadrantRepository } from "@/infrastructure/repositories/quadrantRepository";

export interface MoveSpotProps {
	id: number;
	newX?: number;
	newY?: number;
}

export interface QuadrantSlice {
	repo: QuadrantRepository | null;
	quadrants: Quadrant[];
	selectedQuadrant: Quadrant | null;
	isFirstLoading: boolean;
	isLoading: boolean;
	isLightLoading: boolean;
	error: string | null;
	fetch: () => Promise<void>;
	create: (
		name: string,
		xLabel: string,
		yLabel: string,
	) => Promise<number | null>;
	updateQuadrantName: (id: number, name: string) => Promise<void>;
	updateQuadrantXLabel: (id: number, xLabel: string) => Promise<void>;
	updateQuadrantYLabel: (id: number, yLabel: string) => Promise<void>;
	delete: (id: number) => Promise<void>;
	selectQuadrant: (id: number) => Promise<void>;
}

export interface SpotSlice {
	currentSpots: Spot[];
	selectedSpotId: number | null;
	selectSpot: (id: number | null) => void;
	moveSpot: (props: MoveSpotProps) => Promise<void>;
	createSpot: (name: string, x: number, y: number) => Promise<void>;
	updateSpotName: (id: number, name: string) => Promise<void>;
	deleteSpot: (id: number) => Promise<void>;
}

export type FullQuadrantStoreType = QuadrantSlice & SpotSlice;
