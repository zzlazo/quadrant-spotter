import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initializeDb } from "@/data/db/dbInit.ts";
import { quadrantRepository } from "@/data/repositories/localQuadrantRepository.ts";
import type { QuadrantRepository } from "@/infrastructure/repositories/quadrantRepository.ts";
import { initQuadrantStore } from "@/stores/useQuadrans.ts";
import App from "./App.tsx";

await initializeDb();
initQuadrantStore(quadrantRepository);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
