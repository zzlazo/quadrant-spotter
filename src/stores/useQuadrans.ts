import { create } from "zustand";
import type { QuadrantRepository } from "@/infrastructure/repositories/quadrantRepository";
import type { FullQuadrantStoreType } from "@/types/quadrantTypes";
import { createQuadrantSlice } from "./quadrantSlice";
import { createSpotSlice } from "./spotSlice";

const createInitialStore = () =>
	create<FullQuadrantStoreType>()((...a) => ({
		repo: null,
		...createQuadrantSlice(...a),
		...createSpotSlice(...a),
	}));

export const useQuadrantStore = createInitialStore();

export const initQuadrantStore = (repository: QuadrantRepository) => {
	useQuadrantStore.setState({ repo: repository });
};
