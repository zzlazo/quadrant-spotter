import { dbClient } from "@/data/db/dbClient";
import { runMigrations } from "@/data/db/migrations";

const IDB_DB_NAME = "app-meta";
const IDB_STORE = "meta";
const IDB_KEY = "schemaVersion";

function openMetaDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(IDB_DB_NAME, 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(IDB_STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

function getVersion(idb: IDBDatabase): Promise<number> {
	return new Promise((resolve, reject) => {
		const tx = idb.transaction(IDB_STORE, "readonly");
		const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
		req.onsuccess = () => resolve(req.result ?? 0);
		req.onerror = () => reject(req.error);
	});
}

function setVersion(idb: IDBDatabase, version: number): Promise<void> {
	return new Promise((resolve, reject) => {
		const tx = idb.transaction(IDB_STORE, "readwrite");
		const req = tx.objectStore(IDB_STORE).put(version, IDB_KEY);
		req.onsuccess = () => resolve();
		req.onerror = () => reject(req.error);
	});
}

let initialized = false;

export async function initializeDb(): Promise<void> {
	if (initialized) return;

	await dbClient.initDb();

	const idb = await openMetaDb();
	const currentVersion = await getVersion(idb);
	const latestVersion = await runMigrations(currentVersion);

	if (latestVersion > currentVersion) {
		await setVersion(idb, latestVersion);
	}

	initialized = true;
}
