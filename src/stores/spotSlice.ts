import type { StateCreator } from "zustand";
import type {
	FullQuadrantStoreType,
	MoveSpotProps,
	SpotSlice,
} from "@/types/quadrantTypes";
import { executeDebounced } from "@/utils/debounce";

export const createSpotSlice: StateCreator<
	FullQuadrantStoreType,
	[],
	[],
	SpotSlice
> = (set, get) => ({
	currentSpots: [],
	selectedSpotId: null,

	selectSpot: (id) => set({ selectedSpotId: id }),

	moveSpot: async ({ id, newX, newY }: MoveSpotProps) => {
		if (newX === undefined && newY === undefined) return;
		const updatedKeys = [
			...(newX === undefined ? [] : ["x"]),
			...(newY === undefined ? [] : ["y"]),
		];

		const prevS = get().currentSpots;

		set({
			isLightLoading: true,
			currentSpots: prevS.map((s) =>
				s.id === id
					? {
							...s,
							...(newX !== undefined && { x: newX }),
							...(newY !== undefined && { y: newY }),
						}
					: s,
			),
		});

		executeDebounced(`spot-${id}-${updatedKeys.join("-")}`, async () => {
			try {
				await get().repo.updateSpot(id, undefined, newX, newY);
				set({ isLightLoading: false });
			} catch {
				set({
					isLightLoading: false,
					currentSpots: prevS,
				});
			}
		});
	},

	createSpot: async (name, x, y) => {
		const qId = get().selectedQuadrant?.id;
		if (!qId) return;
		set({ isLightLoading: true });
		await get().repo.insertSpot(qId, name, x, y);
		set({
			currentSpots: await get().repo.findSpots(qId),
			isLightLoading: false,
		});
	},

	updateSpotName: async (id, name) => {
		const prevS = get().currentSpots;
		set({
			isLightLoading: true,
			currentSpots: prevS.map((s) => (s.id === id ? { ...s, name } : s)),
			// ★ selectedSpot への反映処理が不要に
		});
		executeDebounced(`spot-${id}-name`, async () => {
			try {
				await get().repo.updateSpot(id, name);
				set({ isLightLoading: false });
			} catch {
				set({
					isLightLoading: false,
					currentSpots: prevS,
				});
			}
		});
	},

	deleteSpot: async (id) => {
		const qId = get().selectedQuadrant?.id;
		set({ isLightLoading: true });
		let newStates: Partial<FullQuadrantStoreType> = { isLightLoading: false };
		try {
			await get().repo.deleteSpot(id);
			if (qId) {
				const spots = await get().repo.findSpots(qId);
				newStates = {
					...newStates,
					currentSpots: spots,
					selectedSpotId:
						id === get().selectedSpotId ? null : get().selectedSpotId,
				};
			}
		} catch (err) {
			newStates = {
				...newStates,
				error: err instanceof Error ? err.message : "スポット削除エラー",
			};
		}
		set(newStates);
	},
});
