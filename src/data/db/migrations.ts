import { dbClient } from "@/data/db/dbClient";

// バージョンを上げるたびにここに追記する
const migrations: Array<{ version: number; up: () => Promise<void> }> = [
	{
		version: 1,
		up: async () => {
			await dbClient.runQuery(`
                CREATE TABLE IF NOT EXISTS quadrants (
                    id   INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    x_label TEXT NOT NULL,
                    y_label TEXT NOT NULL
                )
            `);
			await dbClient.runQuery(`
                CREATE TABLE IF NOT EXISTS spots (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    quadrant_id INTEGER NOT NULL,
                    name        TEXT NOT NULL,
                    x           INTEGER,
                    y           INTEGER,
                    FOREIGN KEY (quadrant_id) REFERENCES quadrants(id) ON DELETE CASCADE
                )
            `);
		},
	},
];

export async function runMigrations(currentVersion: number): Promise<number> {
	const pending = migrations.filter((m) => m.version > currentVersion);
	for (const migration of pending) {
		await migration.up();
	}
	return pending.at(-1)?.version ?? currentVersion;
}
