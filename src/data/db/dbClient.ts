export class DBClient {
	private callId = 0;

	private readonly w: Worker;

	constructor(w: Worker) {
		this.w = w;
	}

	send<T>(message: Record<string, unknown>): Promise<T> {
		return new Promise((resolve, reject) => {
			const id = ++this.callId;

			const handler = (e: MessageEvent) => {
				if (e.data.id !== id) return;
				this.w.removeEventListener("message", handler);
				if (e.data.type === "error") reject(new Error(e.data.error));
				else resolve(e.data as T);
			};

			this.w.addEventListener("message", handler);
			this.w.postMessage({ ...message, id });
		});
	}

	async initDb(): Promise<void> {
		await this.send({ type: "init" });
		await this.runQuery(`PRAGMA foreign_keys = ON`);
	}

	async execQuery<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
		const res = await this.send<{ rows: T[] }>({ type: "exec", sql, params });
		return res.rows;
	}

	async runQuery(
		sql: string,
		params?: unknown[],
	): Promise<{ lastInsertRowid: number }> {
		return this.send<{ lastInsertRowid: number }>({ type: "run", sql, params });
	}
}

const worker = new Worker(new URL("./sqlite.worker.ts", import.meta.url), {
	type: "module",
});

export const dbClient = new DBClient(worker);
