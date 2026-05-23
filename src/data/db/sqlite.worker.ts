import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

let db: any = null;

self.onmessage = async (event) => {
	const { type, id, sql, params } = event.data;

	try {
		if (type === "init") {
			const sqlite3 = await sqlite3InitModule();

			try {
				const poolUtil = await sqlite3.installOpfsSAHPoolVfs({});
				db = new poolUtil.OpfsSAHPoolDb("/mydb.sqlite3");
			} catch (e) {
				console.warn("OPFS unavailable, fallback to in-memory:", e);
				db = new sqlite3.oo1.DB("/mydb.sqlite3", "ct");
			}

			self.postMessage({ id, type: "ready" });
		}

		if (type === "exec") {
			const rows: unknown[] = [];
			db.exec({
				sql,
				bind: params,
				rowMode: "object",
				callback: (row: unknown) => rows.push(row),
			});
			self.postMessage({ id, type: "result", rows });
		}

		if (type === "run") {
			db.exec({ sql, bind: params });
			const lastInsertRowid = db.selectValue(
				"SELECT last_insert_rowid()",
			) as number;
			self.postMessage({ id, type: "result", lastInsertRowid });
		}
	} catch (e) {
		self.postMessage({ id, type: "error", error: String(e) });
	}
};
