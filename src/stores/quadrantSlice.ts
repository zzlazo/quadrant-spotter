import type { StateCreator } from "zustand";
import type { Spot } from "@/infrastructure/models/quadrantModels";
import type {
	FullQuadrantStoreType,
	QuadrantSlice,
} from "@/types/quadrantTypes";
import { executeDebounced } from "@/utils/debounce";

export const createQuadrantSlice: StateCreator<
	FullQuadrantStoreType,
	[],
	[],
	QuadrantSlice
> = (set, get) => ({
	repo: null,
	quadrants: [],
	selectedQuadrant: null,
	isFirstLoading: true,
	isLoading: false,
	isLightLoading: false,
	error: null,

	fetch: async () => {
		set({ isLoading: true, error: null });
		try {
			const data = await get().repo.findAllQuadrants();
			const currentSelectedId = get().selectedQuadrant?.id;
			const nextSelectedQuadrant = currentSelectedId
				? data.find((q) => q.id === currentSelectedId) || null
				: data.length > 0
					? data[0]
					: null;
			let spots: Spot[] = [];
			if (nextSelectedQuadrant) {
				spots = await get().repo.findSpots(nextSelectedQuadrant.id);
			}
			let selectedSpotId: number | null = null;
			if (spots.length > 0) {
				selectedSpotId = spots[0].id;
			}

			set({
				quadrants: data,
				selectedQuadrant: nextSelectedQuadrant,
				isLoading: false,
				isFirstLoading: false,
				currentSpots: spots,
				selectedSpotId,
			});
		} catch (err) {
			set({
				error: err instanceof Error ? err.message : "取得エラー",
				isLoading: false,
			});
		}
	},

	create: async (name, xLabel, yLabel) => {
		set({ isLoading: true, error: null });
		try {
			const newId = await get().repo.insertQuadrant(name, xLabel, yLabel);
			await get().fetch();
			const newSelectedQuadrant = get().quadrants.find((q) => q.id === newId);
			set({
				isLoading: false,
				selectedQuadrant: newSelectedQuadrant,
				currentSpots: [],
				selectedSpotId: null,
			});
			return newId;
		} catch (err) {
			set({
				error: err instanceof Error ? err.message : "作成エラー",
				isLoading: false,
			});
		}
		return null;
	},

	updateQuadrantName: async (id, name) => {
		const prevQ = get().quadrants;
		const prevSQ = get().selectedQuadrant;
		set({
			isLightLoading: true,
			quadrants: prevQ.map((q) => (q.id === id ? { ...q, name } : q)),
			selectedQuadrant: prevSQ?.id === id ? { ...prevSQ, name } : prevSQ,
		});

		executeDebounced(`quadrant-${id}-name`, async () => {
			try {
				await get().repo.updateQuadrant(id, name);
				set({ isLightLoading: false });
			} catch (_) {
				set({
					error: "更新失敗",
					isLightLoading: false,
					quadrants: prevQ,
					selectedQuadrant: prevSQ,
				});
			}
		});
	},

	updateQuadrantXLabel: async (id, xLabel) => {
		const prevQ = get().quadrants;
		const prevSQ = get().selectedQuadrant;
		set({
			isLightLoading: true,
			quadrants: prevQ.map((q) => (q.id === id ? { ...q, xLabel } : q)),
			selectedQuadrant: prevSQ?.id === id ? { ...prevSQ, xLabel } : prevSQ,
		});

		try {
			await get().repo.updateQuadrant(id, undefined, xLabel);
			set({ isLightLoading: false });
		} catch {
			set({
				isLightLoading: false,
				quadrants: prevQ,
				selectedQuadrant: prevSQ,
			});
		}
	},

	updateQuadrantYLabel: async (id, yLabel) => {
		const prevQ = get().quadrants;
		const prevSQ = get().selectedQuadrant;
		set({
			isLightLoading: true,
			quadrants: prevQ.map((q) => (q.id === id ? { ...q, yLabel } : q)),
			selectedQuadrant: prevSQ?.id === id ? { ...prevSQ, yLabel } : prevSQ,
		});

		try {
			await get().repo.updateQuadrant(id, undefined, undefined, yLabel);
			set({ isLightLoading: false });
		} catch {
			set({
				isLightLoading: false,
				quadrants: prevQ,
				selectedQuadrant: prevSQ,
			});
		}
	},

	delete: async (id) => {
		set({ isLoading: true });
		await get().repo.deleteQuadrant(id);
		await get().fetch();
		if (id === get().selectedQuadrant?.id)
			set({ selectedQuadrant: null, currentSpots: [], selectedSpotId: null }); // ★
		set({ isLoading: false });
	},

	selectQuadrant: async (id) => {
		const q = get().quadrants.find((q) => q.id === id);
		set({ selectedQuadrant: q, isLoading: true });
		if (q) {
			try {
				const spots = await get().repo.findSpots(q.id);
				set({
					currentSpots: spots,
					selectedSpotId: spots[0]?.id || null,
					isLoading: false,
				});
			} catch (err) {
				set({
					isLoading: false,
					error: err instanceof Error ? err.message : "スポット取得エラー",
				});
			}
		}
	},
});
