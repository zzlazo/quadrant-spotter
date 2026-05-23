import { type DBClient, dbClient } from "@/data/db/dbClient";
import type { Quadrant, Spot } from "@/infrastructure/models/quadrantModels";
import type { QuadrantRepository } from "@/infrastructure/repositories/quadrantRepository";

export class LocalQuadrantRepository implements QuadrantRepository {
	private readonly dbClient: DBClient;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;
	}

	async findAllQuadrants(): Promise<Quadrant[]> {
		return this.dbClient.execQuery<Quadrant>(
			`SELECT id, name, x_label AS xLabel, y_label AS yLabel FROM quadrants`,
		);
	}

	async insertQuadrant(
		name: string,
		xLabel: string,
		yLabel: string,
	): Promise<number> {
		const res = await this.dbClient.runQuery(
			`INSERT INTO quadrants (name, x_label, y_label) VALUES (?, ?, ?)`,
			[name, xLabel, yLabel],
		);
		return res.lastInsertRowid;
	}

	async updateQuadrant(
		id: number,
		name?: string,
		xLabel?: string,
		yLabel?: string,
	): Promise<void> {
		const sets: string[] = [];
		const params: unknown[] = [];
		if (name !== undefined) {
			sets.push("name = ?");
			params.push(name);
		}
		if (xLabel !== undefined) {
			sets.push("x_label = ?");
			params.push(xLabel);
		}
		if (yLabel !== undefined) {
			sets.push("y_label = ?");
			params.push(yLabel);
		}
		if (sets.length === 0) return;
		params.push(id);
		await this.dbClient.runQuery(
			`UPDATE quadrants SET ${sets.join(", ")} WHERE id = ?`,
			params,
		);
	}

	async deleteQuadrant(id: number): Promise<void> {
		await this.dbClient.runQuery(`DELETE FROM quadrants WHERE id = ?`, [id]);
	}

	async findSpots(quadrantId: number): Promise<Spot[]> {
		return this.dbClient.execQuery<Spot>(
			`SELECT id, name, x, y FROM spots WHERE quadrant_id = ?`,
			[quadrantId],
		);
	}

	async insertSpot(
		quadrantId: number,
		name: string,
		x: number,
		y: number,
	): Promise<number> {
		const res = await this.dbClient.runQuery(
			`INSERT INTO spots (quadrant_id, name, x, y) VALUES (?, ?, ?, ?)`,
			[quadrantId, name, x, y],
		);
		return res.lastInsertRowid;
	}

	async updateSpot(
		id: number,
		name?: string,
		x?: number,
		y?: number,
	): Promise<void> {
		const sets: string[] = [];
		const params: unknown[] = [];
		if (name !== undefined) {
			sets.push("name = ?");
			params.push(name);
		}
		if (x !== undefined) {
			sets.push("x = ?");
			params.push(x);
		}
		if (y !== undefined) {
			sets.push("y = ?");
			params.push(y);
		}
		if (sets.length === 0) return;
		params.push(id);
		await this.dbClient.runQuery(
			`UPDATE spots SET ${sets.join(", ")} WHERE id = ?`,
			params,
		);
	}

	async deleteSpot(id: number): Promise<void> {
		await this.dbClient.runQuery(`DELETE FROM spots WHERE id = ?`, [id]);
	}
}

export const quadrantRepository = new LocalQuadrantRepository(dbClient);
